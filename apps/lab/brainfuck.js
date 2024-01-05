import { EditorView, EditorState, basicSetup } from "@codemirror/basic-setup"
import { StreamLanguage } from "@codemirror/stream-parser"
import { brainfuck } from "@codemirror/legacy-modes/mode/brainfuck"

var editorView = new EditorView({
  state: EditorState.create({
    doc: ">+++++[-<+++++>]\n"
      + ">++++++++[-<++++++++>]\n"
      + "++++[->++++<]>[-<++++++>]\n"
      + ">++++[-<++++++++>]\n"
      + "<<<<+[->+.>+.>.<<<]\n"
      + "++++++++++.\n",
    extensions: [
      basicSetup,
      StreamLanguage.define(brainfuck),
    ],
  }),
  parent: document.createElement("div"),
});

class SoullbfMemory extends Map {
  constructor(dataType, cells) {
    super();
    let finiteCells = cells !== Infinity;
    let isBigInt = dataType >= 8;
    let overflow = isBigInt ? BigInt(1) << BigInt(63) : 2 ** (dataType * 8 - 1);
    let m = overflow + overflow;
    this.fixOverflow = dataType == 99 ? (v) => v : v => {
      let v_ = isBigInt ? BigInt(v) : Math.floor(v);
      if (v_ !== v_) throw new TypeError("数据不能是NaN");
      if (v_ === Infinity || v_ === -Infinity) throw new RangeError("数据不能是无穷大");
      v_ = (v_ + overflow) % m;
      if (v_ < 0) v_ += m;
      return v_ - overflow;
    };
    this.pointer = 0;
    this.dataType = dataType, this.cells = cells, this.finiteCells = finiteCells, this.isBigInt = isBigInt;
    super.set(0, isBigInt ? BigInt(0) : 0);
    this.haltOnPointerOverflow = false;
  }
  getCurr() {
    return super.get(this.pointer);
  }
  setCurr(v) {
    if (v !== undefined)
      super.set(this.pointer, this.fixOverflow(v));
  }
  increment(i) {
    let v = super.get(this.pointer);
    super.set(this.pointer, this.fixOverflow(++v));
  }
  decrement(i) {
    let v = super.get(this.pointer);
    super.set(this.pointer, this.fixOverflow(--v));
  }
  right(i) {
    this.pointer++;
    if (this.pointer >= this.cells) {
      if (this.haltOnPointerOverflow)
        throw new Error("指针越界！");
      else
        this.pointer -= this.cells;
    }
    if (!super.has(this.pointer))
      super.set(this.pointer, this.isBigInt ? BigInt(0) : 0);
  }
  left(i) {
    this.pointer--;
    if (this.pointer < 0) {
      if (this.haltOnPointerOverflow)
        throw new Error("指针越界！");
      else if (this.finiteCells)
        this.pointer += this.cells;
    }
    if (!super.has(this.pointer))
      super.set(this.pointer, this.isBigInt ? BigInt(0) : 0);
  }
}

window.vm = new Vue({
  el: "#app",
  data: {
    bigIntNotSupported: typeof BigInt !== "function",
    cellsPresets: [30000, 5000, 100],

    code: "",
    codeHighlight: "",

    config: {
      eof: undefined, // {undefined: no_change, -1, 0}
      dataType: 1, // {1: Int8, 2: Int16, 4: Int32, 8: Int64, 99: BigInt}
      _cellsSelect: 30000,
      _cellsInput: undefined,
      cells: 30000, // {(int), Infinity}
      allowNegativeMP: false,
    },

    tickSpeed: 100,

    panel: "edit", //edit, run, compile
    stat: "ready", // ready, run, pause, end
    codePointer: 0,
    breakpoints: new Set(),
    memory: null,
    staticInput: true,
    input: "",
    inputPointer: 0,
    inputBuffer: "",
    inputBufferEOF: false,
    waitingForInput: false,
    output: "",

    message: null
  },

  computed: {
    cellsInputState() {
      this.config._cellsInput; // make Vue update the state when _cellsInput changes
      if (!this.$refs.cellsInput) return true;
      return this.$refs.cellsInput.checkValidity() && true;
    },
    syntaxError() {
      const code = this.code;
      let level = 0;
      for (let i = 0; i < code.length; i++) {
        if (code[i] === "[") {
          ++level;
        } else if (code[i] === "]") {
          if (--level < 0) return true;
        }
      }
      return level > 0;
    }
  },

  methods: {
    cellsInputChange(v) {
      if (!vm.cellsInputState) return;
      vm.config._cellsSelect = vm.config.cells = v;
    },
    cellsSelectChange(v) {
      if (v === undefined) {
        if (vm.config.cells === Infinity) vm.config.cells = 30000;
        vm.config._cellsSelect = vm.config._cellsInput = vm.config.cells;
        vm.$bvModal.show('custom-cells-dialog');
      } else {
        vm.config._cellsInput = vm.config.cells = v;
      }
    },
    tickSpeedChange(v) {
      if (v < 4) vm.tickSpeed = 4;
    },

    renderMemory() {
      let m = [...vm.memory.entries()], r = [], i = vm.config.cells === Infinity && vm.config.allowNegativeMP ? -Infinity : -1;
      m.sort((l, r) => l[0] - r[0]);
      m.forEach((v) => {
        if (v[0] !== i + 1)
          r.push([i]);
        i = v[0];
        r.push(v);
      });
      if (vm.config.cells !== i + 1)
        r.push([i + 1]);
      return r;
    },

    inputBufferKeypress($event) {
      const modifiers = $event.shiftKey | $event.ctrlKey << 1 | $event.altKey << 2 | $event.metaKey << 3;
      if (modifiers < 4 && $event.key === "Enter") {
        $event.preventDefault();
        return vm.inputBufferEnter();
      }
      if (modifiers === 2 && $event.key === "d") { // Ctrl-D
        $event.preventDefault();
        if (!vm.inputBuffer) return vm.inputBufferEnded();
      }
    },
    inputBufferEnter() {
      vm.input = vm.inputBuffer + "\n", vm.inputPointer = 0, vm.output += vm.input, vm.inputBuffer = "";
    },
    inputBufferEnded() {
      if (vm.inputBuffer) vm.inputBufferEnter();
      vm.inputBufferEOF = true;
    },

    codeClick($event) {
      let i = $event.target.dataset.i;
      if (i) {
        i = Number(i);
        if (vm.breakpoints.has(i))
          vm.breakpoints.delete(i);
        else if ("><+-.,[]".includes(vm.code[i]))
          vm.breakpoints.add(i);
        vm.$forceUpdate();
      }
    },

    panelChange() {
      if (vm.panel === "edit")
        vm.reset();
      else if (vm.panel === "run")
        vm.init();
    },

    iStep() {
      let instruction = vm.code[vm.codePointer], cond = true;
      while (cond) {
        cond = false;
        if (instruction === undefined)
          throw "程序退出！";

        switch (instruction) {
          case '>':
            vm.memory.right();
            break;
          case '<':
            vm.memory.left();
            break;
          case '+':
            vm.memory.increment();
            break;
          case '-':
            vm.memory.decrement();
            break;
          case '.':
            vm.output += String.fromCharCode(Number(vm.memory.getCurr()));
            break;
          case ',':
            if (vm.inputPointer < vm.input.length)
              vm.waitingForInput = false, vm.memory.setCurr(vm.input.charCodeAt(vm.inputPointer++));
            else if (vm.staticInput || vm.inputBufferEOF)
              vm.memory.setCurr(vm.config.eof);
            else {
              vm.waitingForInput = true;
              return;
            }
            break;
          case '[':
            let i3 = vm.code.substr(vm.codePointer), curr = vm.memory.getCurr();
            if (
              i3.match(/^\[([^><+-.,[\]]*)\-([^><+-.,[\]]*)\]/) && (vm.config.dataType !== 99 || curr > 0) ||
              i3.match(/^\[([^><+-.,[\]]*)\+([^><+-.,[\]]*)\]/) && (vm.config.dataType !== 99 || curr < 0)
            )
              vm.memory.setCurr(0), vm.codePointer += 2;
            else if (!curr) {
              let depth = 1;
              while (depth) {
                instruction = vm.code[++vm.codePointer];
                if (instruction === '[')
                  depth++;
                else if (instruction === ']')
                  depth--;
              }
            }
            break;
          case ']':
            if (vm.memory.getCurr()) {
              let depth = 1;
              while (depth) {
                instruction = vm.code[--vm.codePointer];
                if (instruction === ']')
                  depth++;
                else if (instruction === '[')
                  depth--;
              }
            }
            break;
          default:
            cond = true;
            break;
        }
        if (vm.output.length >= 131072)
          throw new Error("输出过长！");
        do
          instruction = vm.code[++vm.codePointer];
        while (instruction && !"><+-.,[]".includes(instruction));
      }
      if (vm.breakpoints.has(vm.codePointer))
        throw "break";
      vm.$nextTick(() => {
        let mt = vm.$el.querySelector(".soullbf-memory-table"),
          mp = mt.querySelector(".soullbf-pointer");
        if (mt && mp)
          mt.scrollLeft = mp.offsetLeft - mt.offsetWidth / 2;
        if (instruction === '.')
          vm.$el.querySelector(".soullbf-right").scrollTop = 2147483647;
      });
    },

    iHandleError(e) {
      clearTimeout(vm.intHandle);
      if (e instanceof Error) {
        vm.stat = 'end';
        vm.iShowMessage('danger', e);
        console.error(e);
      }
      else if (e === "break") {
        vm.stat = 'pause';
      }
      else {
        vm.stat = 'end';
        vm.iShowMessage('success', e);
      }
    },

    iShowMessage(variant, text) {
      vm.message = { variant, text };
    },

    init() {
      vm.code = editorView.state.doc.toString();
      if (vm.syntaxError) {
        this.$bvToast.toast("存在未配对的方括号，请检查", {
          title: "语法错误",
          variant: "danger",
          toaster: "b-toaster-top-center"
        });
        return;
      }

      vm.panel = 'run';
      vm.stat = 'pause';
      vm.codePointer = 0;
      vm.inputPointer = 0;
      vm.output = "";
      vm.inputBuffer = "";
      vm.memory = new SoullbfMemory(vm.config.dataType, vm.config.cells);
      vm.memory.haltOnPointerOverflow = !vm.config.allowNegativeMP;
      vm.staticInput = Boolean(vm.input);
      vm.breakpoints = new Set();
      vm.inputBufferEOF = false;
      vm.message = null;
    },
    run() {
      vm.stat = 'run';
      let f = () => {
        let end = Date.now() + 30;
        try {
          do
            vm.iStep();
          while (Date.now() < end);
          vm.intHandle = setTimeout(f, 10);
        } catch (e) {
          vm.iHandleError(e);
        }
      };
      f();
    },
    tick() {
      vm.stat = 'run';
      let f = () => {
        try {
          vm.iStep();
          vm.intHandle = setTimeout(f, vm.tickSpeed);
        } catch (e) {
          vm.iHandleError(e);
        }
      };
      f();
    },
    step() {
      vm.stat = 'pause';
      try {
        vm.iStep();
      } catch (e) {
        vm.iHandleError(e);
      }
    },
    pause() {
      vm.stat = 'pause';
      clearTimeout(vm.intHandle);
    },
    reset() {
      vm.stat = 'ready';
      clearTimeout(vm.intHandle);
      vm.panel = 'edit';
      vm.codePointer = 0;
      vm.memory = null;
      vm.message = null;
      if (!vm.staticInput)
        vm.input = "";
      vm.waitingForInput = false;
    },
  },

  mounted() {
    this.$nextTick(() => {
      let slot = document.getElementById("editorSlot");
      slot.parentNode.replaceChild(editorView.dom, slot);
    });
  }
});

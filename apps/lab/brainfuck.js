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

    codeInputScrollTop: 0,

    code: "",
    codeHighlight: "",
    syntaxError: false,

    config: {
      eof: undefined, // {undefined: no_change, -1, 0}
      dataType: 1, // {1: Int8, 2: Int16, 4: Int32, 8: Int64, 99: BigInt}
      _cells: 30000,
      cells: 30000, // {(int), Infinity}
      allowNegativeMP: false,
    },

    tickSpeed: 300,

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

    leaveLoopDepth: 0,

    message: null
  },

  methods: {
    handleInput(raw, offset) {
      vm.code = raw;
      let frag = document.createDocumentFragment(),
        line = document.createElement("div"),
        token = null, text = null;
      let i = 0, l = raw.length, depth = 0, error = false, newLine = true;
      let caretNode = null, caretOffset = 1;
      if (i === 0 && offset === 0)
        caretNode = line, caretOffset = 0;
      while (i < l) {
        let char = raw[i++];
        if (char === "\n") {
          if (newLine) {
            text = document.createElement("br"),
              line.appendChild(text);
          }
          newLine = true;
          frag.appendChild(line);
          line = document.createElement("div");
          if (i === offset)
            caretNode = line, caretOffset = 0;
        } else {
          newLine = false;
          token = document.createElement("span"), text = document.createTextNode(char);
          token.classList.add("token");
          if (char === "+")
            token.classList.add("increment", "inserted");
          else if (char === "-")
            token.classList.add("decrement", "deleted");
          else if (char === "<" || char === ">")
            token.classList.add("pointer", "keyword");
          else if (char === "." || char === ",")
            token.classList.add("operator", "inserted");
          else if (char === "[")
            depth++, token.classList.add("branching", "important");
          else if (char === "]") {
            depth--, token.classList.add("branching", "important");
            if (depth < 0)
              depth = 0, error = true, token.classList.add("soullbf-error");
          } else
            token.classList.add("comment");
          token.appendChild(text);
          line.appendChild(token);
          if (i === offset)
            caretNode = text, caretOffset = 1;
        }
        //console.log({i, depth, newLine, caretNode, caretOffset});
      }
      if (depth > 0)
        error = true,
          token.classList.add("soullbf-error");
      vm.syntaxError = error;
      if (newLine)
        line.appendChild(document.createElement("br"));
      frag.appendChild(line);
      return {
        renderedNode: frag,
        caretNode,
        caretOffset
      };
    },

    ucellsChange(v) {
      if (v === undefined) {
        vm.config.cells = vm.config._cells;
        vm.$bvModal.show('custom-cells-dialog');
      }
      else
        vm.config._cells = v;
    },
    cellsChange(v) {
      vm.config.cells = v;
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
      vm.input = vm.inputBuffer + "\n", vm.inputPointer = 0, vm.output += vm.input, vm.inputBuffer = "";
    },
    inputBufferEnded() {
      vm.inputBufferEOF = true;
      vm.input = vm.inputBuffer, vm.inputPointer = 0, vm.output += vm.input + "^C" + "\n", vm.inputBuffer = "";
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
            break; case '<':
            vm.memory.left();
            break; case '+':
            vm.memory.increment();
            break; case '-':
            vm.memory.decrement();
            break; case '.':
            vm.output += String.fromCharCode(Number(vm.memory.getCurr()));
            break; case ',':
            if (vm.inputPointer < vm.input.length)
              vm.waitingForInput = false, vm.memory.setCurr(vm.input.charCodeAt(vm.inputPointer++));
            else if (vm.staticInput || vm.inputBufferEOF)
              vm.memory.setCurr(vm.config.eof);
            else {
              vm.waitingForInput = true;
              return;
            }
            break; case '[':
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
            break; case ']':
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
            break; default:
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
      vm.panel = 'run';
      vm.stat = 'pause';
      vm.code = editorView.state.doc.toString();
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
      vm.panel = 'edit';
      vm.codePointer = 0;
      vm.memory = null;
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

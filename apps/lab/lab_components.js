/**
 * SoulManualPrism
 * 手动prism代码块。
 */
Vue.component('soul-manual-prism', {
    template: `<pre
        v-on="listeners"
        class="soul-manual-prism"><code
        class="soul-manual-prism"><slot></slot></code></pre>`,
    computed: {
        listeners: function () {
            return this.$listeners;
        }
    }
})

/**
 * SoulFakeTextarea
 * 一个简陋的带高亮代码编辑器。
 * 
 * 用 handleInput 属性来渲染代码高亮。
 * handleInput(raw, offset) : { renderedNode, caretNode, caretOffset }
 * 参数：
 * raw - 源代码字符串
 * offset - 光标的位置（0索引）
 * 返回对象：
 * renderedNode - 语法高亮文档片段，结构：
 *     文档片段 -> 每行一个 div -> 每个 token 一个 span -> 每个 span 中一个文本节点。
 *     （空行要用 <div><br/></div> 表示 ）
 * caretNode - 光标在上述文档片段中处于哪个文本节点中。
 * caretOffset - 光标在上述文本节点中的位置（从文本节点开头几个字符处）。
 */
Vue.component('soul-fake-textarea', {
    model: {
      prop: 'html',
      event: 'input'
    },
    props: {
        id: String, 
        value: String,
        handleInput: Function
    },
    data: () => ({
    }),
    template: `<pre
        class="el-textarea soul-fake-textarea soullbf-wrapcode"><code
        class="el-textarea__inner"
        contenteditable="true"
        :id="id"
        @input="oninput"
        @compositionend="oninput"
        ></code></pre>`,
    mounted() {
        this.$nextTick(() => {
            this.update(this.handleInput(this.value, 0).renderedNode);
        });
    },
    methods: {
        oninput($event) {
            if ($event.isComposing) // 正在用输入法输入，渲染会打断输入
                return;
            let vm = this;
            let raw = "", index = 0, firstLine = true;
            let selection = getSelection(), focusNode = selection.focusNode;
            let i = document.createNodeIterator(
                vm.$el.querySelector("code"),
                NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT
            ),
                node = i.nextNode();
            do {
                if (node.nodeType === 1)
                    if (node.tagName.toLowerCase() === "code")
                        continue;
                    else {
                        if (!firstLine && node.tagName.toLowerCase() === "div")
                            raw += "\n";
                    }
                firstLine = false;
                if (focusNode === node)
                    index = raw.length + selection.focusOffset;
                if (node.nodeType === 3)
                    raw += node.nodeValue;
            } while (node = i.nextNode());


            let result = vm.handleInput(raw, index);
            this.update(result.renderedNode);
            selection.collapse(result.caretNode, result.caretOffset);
        },
        update(node) {
            let code = vm.$el.querySelector("code");
            code.innerHTML = "";
            code.appendChild(node);
        }
    }
})

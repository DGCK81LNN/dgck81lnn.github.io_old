class RichardMarkup {

    get[Symbol.toStringTag]() {
        return "RichardMarkup";
    }

    constructor(code) {

        /**
         * 确保条件成立。
         * 
         * @param {boolean} cond 断言的条件
         * @param {Function} ErrorType 如果c为false抛出的错误类型
         * @param {string} msg 错误消息
         * @param {Object} info 附加信息
         */
        function assert(cond, ErrorType = Error, msg = "assertion failed", info = null) {
            if (!cond)
                throw Object.assign(new ErrorType("RichardMarkup: " + msg), info);
        }

        /**
         * 从代码中读入指定字符串
         * 
         * @param {...string} expected 可以读入的字符串列表
         * @returns {string} 找到的子字符串
         * @throws 找不到适当的序列时抛出 SyntaxError
         */
        function expect(...expected) {
            let found = tryExpect(...expected);
            if (found === undefined)
                assert(false, SyntaxError, `未能找到适当的${expected.length > 1 ? JSON.stringify(expected) : JSON.stringify(expected[0])}`, {
                    i: codePointer
                });
            return found;
        }

        /**
         * 从代码中读入指定字符串
         * 
         * @param {...string} expected 可以读入的字符串列表
         * @returns {string | undefined} 找到的子字符串；找不到时返回undefined
         */
        function tryExpect(...expected) {
            for (let p of expected) {
                if (codeLower.substr(codePointer, p.length) === p.toLowerCase()) {
                    codePointer += p.length;
                    return p;
                }
            }
        }

        /**
         * 忽略接下来的空白
         */
        function whitespace() {
            while ([" ", "\t", "\n"].includes(code[codePointer]))
                ++codePointer;
        }

        /**
         * 从代码中读入内容直到遇到指定标识为止
         * 
         * @param {string} expected 读取结束的标识
         * @returns {string} 读到的内容
         */
        function readUntil(expected) {
            let read = "",
                expectedLen = expected.length,
                expectedLower = expected.toLowerCase();
            while (codeLower.substr(codePointer, expectedLen) !== expectedLower)
                if (codePointer < codeLen)
                    read += code[codePointer++];
                else
                    assert(false, SyntaxError, `未能找到适当的${JSON.stringify(expected)}`, {
                        i: codePointer
                    });
            codePointer += expectedLen;
            return read;
        }

        /**
         * 读入纯文本，直到遇到标签为止
         */
        function text() {
            if (!textOnThisLine)
                whitespace();
            let startPos = -1,
                endPos = -1,
                read = "";
            do {
                endPos = code.indexOf('>', codePointer);
                if (endPos === -1) endPos = codeLen;
                else startPos = code.lastIndexOf('<', endPos);
                if (startPos === -1) startPos = codeLen;
                if ([..."abcdefghijklmnopqrstuvwxyz-_:/!"].includes(codeLower[startPos + 1]))
                    break;
                read += code[codePointer++];
            } while (codePointer < codeLen)
            //console.log(startPos, endPos, code.slice(startPos, endPos + 1));
            read += code.slice(codePointer, startPos);
            read = read.split('\n').map(line => line.trim()).join('\n');
            codePointer = startPos;
            if (read) {
                currElem.appendChild(document.createTextNode(read));
                textOnThisLine = !read.endsWith("\n"); //, console.log({textOnThisLine});
            }
        }

        /**
         * 从代码中读入元素的特性
         * 
         * @param elem 要把特性存储到的元素
         */
        function attributes(elem) {
            while (codePointer < codeLen && code[codePointer] !== ">") {
                let attrKey = "",
                    attrValue = "";
                whitespace();
                while (codePointer < codeLen && ![" ", "\n", "\t", "="].includes(code[codePointer]))
                    attrKey += code[codePointer++];
                whitespace();
                if (tryExpect("=")) {
                    whitespace();
                    if (tryExpect("\""))
                        attrValue = readUntil("\"");
                    else
                        while (codePointer < codeLen && ![" ", "\n", "\t", "\"", ">", "/"].includes(code[codePointer]))
                            attrValue += code[codePointer++];
                }
                whitespace();
                elem.setAttribute(attrKey, attrValue);
            }
        }

        assert(typeof code === "string", TypeError, '代码必须是字符串');

        let codeLen = code.length,
            codeLower = code.toLowerCase(),
            codePointer = 0;
        let document = this.document = new Document(),
            currElem;
        let textOnThisLine; // 当前行是否读到了文本

        whitespace();
        expect("<?richard-markup");
        expect(" ", "\n");
        document.appendChild(document.createProcessingInstruction("richard-markup", readUntil("?>")));
        whitespace();
        currElem = document.appendChild(document.createElement('root'));
        if (tryExpect('<root')) {
            attributes(currElem);
            expect('>');
            whitespace();
        }
        while (codePointer < codeLen) {
            //console.log({document, currElem});
            text();
            let endTag = '</' + currElem.tagName;
            let found = tryExpect('<a', '<s', '<choices', '<choice', '<script', endTag, '<!--');
            if (!found)
                break;
            else if (found === endTag) {
                whitespace();
                expect('>');
                currElem = currElem.parentNode;
                if (currElem === document)
                    break;
            } else if (found === '<!--') {
                currElem.appendChild(document.createComment(readUntil("-->")));
            } else { // start tag
                let elem = document.createElement(found.substr(1));
                whitespace();
                attributes(elem);
                currElem.appendChild(elem);
                if (['<a'].includes(found)) { // 如果此元素不能有内容，默认是自闭合标签
                    tryExpect("/");
                    whitespace();
                    expect(">");
                } else {
                    expect(">");
                    currElem = elem;
                }
            }
        } // end of while (codePointer < codeLen)
        //console.log("remainder: " + JSON.stringify(code.substr(codePointer, 20)));
    } // end of constructor()
}

export function main() {
    try {
        var code = `
<?richard-markup v1?>
Hello, world!
<choices>
    Are you...
    <choice goto="roy">Roy</choice>
    <choice goto="richard">Richard</choice>
    <choice>Neither</choice>
</choices>
Hello... whoever you are!
<a goto="_exit" name="roy">
<!-- ↑ 从其他地方跳转到这里时，这里的goto不会执行 -->
Hi, <s color=12>Roy</s>!
<a goto="_exit" name="richard">
Hello <s color=15>Richard</s>!
`;
        console.log(code);
        var richard = new RichardMarkup(code);
        console.log(richard.document);
    } catch (e) {
        console.log("Error found at:", code.substr(e.i));
        throw e;
    }
}
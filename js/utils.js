/**
 * @author DGCK81LNN
 * @overview 几个简单实用（×）的util。
 * @copyright 2020 DGCK81LNN.
 * @license MPL-2.0
 */

// DATE UTIL

/**
 * 按指定位数格式化整数。
 * 
 * @param {number} num 要格式化的数字。
 * @param {(number|false)} [len=2] 目标位数。
 * @param {boolean} sign 是否显示正号。
 * @returns {string}
 */
function zeroizeLNN(num, len=2, sign) {
    num = Math.floor(num);
    var str = Math.abs(num).toString();
    if (len !== false) {
        if (str.length > len)
            str = str.substr(-len);
        else
            while (str.length < len) str = "0" + str;
    }
    if (sign) str = (num < 0 ? "-" : "+") + str;
    return str;
}
{
    let LNN_DATE_FORMAT = {
        'yyyy': t => zeroizeLNN(t.getFullYear(), 4),
        'yy': t => zeroizeLNN(t.getFullYear()),
        'M': t => t.getMonth() + 1,
        'MM': t => zeroizeLNN(t.getMonth() + 1),
        'MMM': t => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][t.getMonth()],
        'MMMM': t => ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][t.getMonth()],
        'd': t => t.getDate(),
        'dd': t => zeroizeLNN(t.getDate()),
        'ddd': t => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][t.getDay()],
        'dddd': t => ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][t.getDay()],
        'h': t => t.getHours() % 12 || 12,
        'hh': t => zeroizeLNN(t.getHours() % 12 || 12),
        'H': t => t.getHours(),
        'HH': t => zeroizeLNN(t.getHours()),
        't': t => t.getHours() < 12 ? 'a' : 'p',
        'tt': t => t.getHours() < 12 ? 'am' : 'pm',
        'T': t => t.getHours() < 12 ? 'A' : 'P',
        'TT': t => t.getHours() < 12 ? 'AM' : 'PM',
        'm': t => t.getMinutes(),
        'mm': t => zeroizeLNN(t.getMinutes()),
        's': t => t.getSeconds(),
        'ss': t => zeroizeLNN(t.getSeconds()),
        'l': t => t.getMilliseconds(),
        'L': t => zeroizeLNN(t.getMilliseconds(), 3).substr(0, 1),
        'LL': t => zeroizeLNN(t.getMilliseconds(), 3).substr(0, 2),
        'LLL': t => zeroizeLNN(t.getMilliseconds(), 3).substr(0, 3),
        'ZZ': t => zeroizeLNN(-Math.floor(t.getTimezoneOffset() / 60), false, true),
        'ZZZ': t => zeroizeLNN(-Math.floor(t.getTimezoneOffset() / 60), 2, true),
        'zz': t => zeroizeLNN(-t.getTimezoneOffset() % 60),
    };
    /**
     * 格式化日期。
     * 
     * @param {string} fmt 格式字符串。参考下表：
     * 
     * |  符号   |       含义       |   示例   |
     * |---------|------------------|----------|
     * | `yyyy`  | 完整年份         | `2020`   |
     * | `yy`    | 两位年份         | `20`     |
     * | `M`     | 月份             | `3`      |
     * | `MM`    | 两位月份         | `03`     |
     * | `MMM`   | 英文月份缩写     | `Mar`    |
     * | `MMMM`  | 完整英文月份     | `March`  |
     * | `d`     | 日               | `8`      |
     * | `dd`    | 两位日           | `08`     |
     * | `ddd`   | 英文星期缩写     | `Sun`    |
     * | `dddd`  | 完整英文星期     | `Sunday` |
     * | `H`     | 24小时制小时     | `20`     |
     * | `HH`    | 24小时制两位小时 | `20`     |
     * | `h`     | 12小时制小时     | `8`      |
     * | `hh`    | 12小时制两位小时 | `08`     |
     * | `t`     | 小写上下午a/p    | `p`      |
     * | `tt`    | 小写上下午am/pm  | `pm`     |
     * | `T`     | 大写上下午A/P    | `P`      |
     * | `TT`    | 大写上下午AM/PM  | `PM`     |
     * | `m`     | 分钟             | `1`      |
     * | `mm`    | 两位分钟         | `01`     |
     * | `s`     | 秒               | `4`      |
     * | `ss`    | 两位秒           | `04`     |
     * | `l`     | 毫秒             | `23`     |
     * | `L`     | 秒小数部分1位    | `0`      |
     * | `LL`    | 秒小数部分2位    | `02`     |
     * | `LLL`   | 秒小数部分3位    | `023`    |
     * | `ZZ`    | 时区小时数       | `+8`     |
     * | `ZZZ`   | 两位时区小时数   | `+08`    |
     * | `zz`    | 时区分钟数       | `00`     |
     * | `\`     | 转义下个字符     | -        |
     * @returns {string} 格式化后的日期。
     * 
     * @example
     * // 返回一个类似"2020-12-05T20:19:35.233Z+0800"的字符串
     * new Date().formatLNN("yyyy-MM-dd\\THH:mm:ss.LLLZZZzz");
     */
    function formatLNN (fmt) {
        var i = 0,
            char = "",
            lastChar = "",
            chars = "",
            result = "";
        for (; i <= fmt.length; ++i) {
            lastChar = char, char = fmt[i];
            if (char == "\\")
                ++i;
            else if (char == lastChar || !chars) {
                chars += char;
                continue;
            }
            if (chars in LNN_DATE_FORMAT) result += LNN_DATE_FORMAT[chars](this);
            else result += chars;
            if (char == "\\")
                result += fmt[i], chars = "";
            else chars = char;
        }
        return result;
    };
    Date.prototype.formatLNN = formatLNN;
}

// GETELEMENTS UTIL

/**
 * 获取文档中所有带id的元素（虽然很多浏览器都会自动做这件事）。
 * 
 * @returns {HTMLElement[]}
 */
this.getElementsLNN = () => [...document.querySelectorAll("*[id]")].map(e => window[e.id] = e);
/**
 * 获取指定id的元素。
 * 
 * @param {string} id 元素的id。
 * @returns {?HTMLElement}
 */
this.$$$ = id => window[id] = document.getElementById(id);
/**
 * 批量获取带id的元素。
 * 
 * @param  {...string} args 每个元素的id。
 * @returns {Array.<?HTMLElement>} 每个元素。
 */
this.$$ = (...args) => args.map($$$);

// RANDOMIZE UTIL

{
    /**
     * 获得随机整数。
     * 
     * @param {number} from 随机数的最小值。
     * @param {number} to 随机数的最大值加1。
     * @returns {number} 给定范围内的随机整数。
     */
    var randIntLNN = (from, to) => Math.floor(Math.random() * (to - from)) + from;
    Math.randIntLNN = randIntLNN;
    /**
     * 获得数组中的随机元素。
     * 
     * @this {Array.} Array的实例。
     * @returns {*} 随机选取的元素。
     */
    var randItemLNN = () =>this[randBetweenLNN(0, this.length)];
    Object.defineProperty(Array.prototype, "randItemLNN", {
        value: randItemLNN,
        enumerable: false
    });
    function randSortLNN () {
        var arr = [],
            i = 0;
        for (; i < this.length; i++)
            arr.push({
                r: randLNN(),
                v: this[i]
            });
        arr.sort((a, b) => a.r - b.r);
        for (i = 0; i < this.length; i++)
            this[i] = arr[i].v;
    }
    Object.defineProperty(Array.prototype, "randSortLNN", {
        value: randSortLNN,
        enumerable: false
    });
}

// XHR UTIL

/** @namespace */
this.XHRUtilLNN = {
    /**
     * 发起GET请求。
     * 
     * @param {string} url 请求的URL。
     * @param {string} [query] 要追加到URL的查询字符串。
     * @param {boolean} [noCache=false] 是否追加一个时间戳到查询字符串来避免浏览器缓存。
     * @param {Function} [callback] 回调函数。如果省略，则发起同步请求。
     * @returns {XMLHttpRequest} 已经发起的请求。
     */
    get(url, query, noCache, callback) {
        var xhr = new XMLHttpRequest();
        if (query) url += (url.match("\\?") ? "&" : "?") + query;
        if (noCache) url += (url.match("\\?") ? "&" : "?") + "_=" + Date.now();
        var hasCallback = typeof callback == "function";
        xhr.open("get", url, hasCallback);
        if (hasCallback) {
            xhr.onload = event => void callback(true, event, xhr);
            xhr.onerror = event => void callback(false, event, xhr);
        }
        xhr.send();
        return xhr;
    },
    /**
     * 发起POST请求。
     * 
     * @param {string} url 请求的URL。
     * @param {(FormData|Object)} [data] 表单数据。如果不是一个FormData实例，则会被当做一个包含键值对的对象处理。
     * @param {Function} [callback=] 回调函数。如果省略，则发起同步请求。
     * @returns {XMLHttpRequest} 已经发起的请求。
     */
    post(url, data, callback) {
        var xhr = new XMLHttpRequest(),
            hasCallback = typeof callback == "function",
            formData = null;
        if (data instanceof FormData) formData = data;
        else {
            formData = new FormData();
            for (var i in data)
                formData.append(i, data[i]);
        }
        xhr.open("post", url, hasCallback);
        if (hasCallback) {
            xhr.onload = event => void callback(true, event, xhr);
            xhr.onerror = event => void callback(false, event, xhr);
        }
        xhr.send(formData);
        return xhr;
    }
};

// BASE64 UTIL

/** @namespace */
this.Base64LNN = function() {
    var utf8Encoder = new TextEncoder(),
        utf8Decoder = new TextDecoder();
    return {
        [Symbol.toStringTag]: "Base64LNN",
 
        table: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
 
        /** @param {Uint8Array} bytes */
        /** @returns {string} */
        encode(bytes) {
            let i = 0, l = bytes.length;
            let str = "";
            while (i < l) {
                let byte1 = bytes[i++],
                    byte2 = bytes[i++],
                    byte3 = bytes[i++];
                str += this.table[                       byte1 >> 2 ];
                str += this.table[((byte1 &  3) << 4) | (byte2 >> 4)];
                str += byte2 === undefined ? "="
                     : this.table[((byte2 & 15) << 2) | (byte3 >> 6)];
                str += byte3 === undefined ? "="
                     : this.table[  byte3 & 63                      ];
            }
            return str;
        },
 
        /** @param {string} str */
        /** @returns {Uint8Array} */
        decode(str) {
            let chars = [], bytes = [], fill = 0;
            for (let char of str) {
                if (char === "=")
                    chars.push(0), ++fill;
                else {
                    let i = this.table.indexOf(char);
                    if (i !== -1)
                        chars.push(i), fill = 0;
                }
            }
            let i = 0, l = chars.length;
            while (i < l) {
                bytes.push(
                    ( chars[i++]       << 2) | (chars[i] >> 4),
                    ((chars[i++] & 15) << 4) | (chars[i] >> 2),
                    ((chars[i++] &  3) << 6) |  chars[i++]
                );
            }
            while (fill-- > 0)
                bytes.pop();
            return new Uint8Array(bytes);
        },
 
        /** @param {string} str */
        /** @returns {string} */
        encodeUTF8(str) {
            return this.encode(utf8Encoder.encode(str));  
        },
 
        /** @param {string} str */
        /** @returns {string} */
        decodeUTF8(str) {
            return utf8Decoder.decode(this.decode(str));
        },
    };
} ();

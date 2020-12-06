/**
 * @author 小马纯真灵魂 (DGCK81LNN)
 * @overview ECMAScript能力检测。
 * @copyright 2020 DGCK81LNN.
 * @license MPL-2.0
 * 在这个科技日新月异的时代
 * ECMAScript版本一定要紧跟潮流！
 * 让我看看这个浏览器的ES版本……
 */

var _test;
try {
    /*
     * ES2015到2020的每个版本都引入了新的语法。
     * 针对每个版本，我都调用一次Function构造函数，
     * 创建一个含有新语法的函数。
     * 如果浏览器不支持这个语法就会抛出运行时错误。
     */

    // 第一关！ES2015添加的【匿名箭头函数】
    _test = 0;
    new Function("_=>0");

    // 第二关！ES2016添加的【乘方运算符】
    _test = 1;
    new Function("0**1");

    // 第三关！ES2017添加的【参数列表末尾允许多余逗号】
    _test = 2;
    new Function("(a,)=>0");

    // 第四关！ES2018添加的【剩余元素和展开元素】
    _test = 3;
    new Function("(...a)=>[...a]");

    // 第五关！ES2019添加的【catch可以没有小括号】
    _test = 4;
    new Function("try { } catch { }");

    // 最后一关！！ES2020添加的【无限长度整形】
    _test = 5;
    new Function("0n");

    // OHHHHHHHHHHHHHHHHHHH，浏览器通过了考验！
    _test = 6;
} catch (err) {
    /*
     * 哦豁，中途报错了
     * 那就给用户弹一个对话框
     * (每24小时)只弹一次就够了，所以如果以前弹过那就不弹了
     */
    if (!/(?:(?:^|.*;\s*)soulTest\s*\=\s*([^;]*).*$)|^.*$/.exec(document.cookie)[1]) {
        /*
         * 现在先看看是不是IE。
         * 如果是IE就建议用户更换其他浏览器。否则建议用户更新浏览器。（
         */
        var msg2 = navigator.userAgent.indexOf("MSIE") !== -1 ? "更换其他浏览器。" : "更新浏览器。";
        /*
         * 然后再看看事情有多严重。
         * 如果ES2016都不支持，
         * 那这浏览器基本就没法要了）
         */
        var msg1 = [
            "您的浏览器不支持 ECMAScript 2015 ，页面将无法正常显示。如果可以，请您",
            "您的浏览器不支持 ECMAScript 2016 ，网站功能将无法正常使用。如果可以，请您",
            "您的浏览器不支持 ECMAScript 2017 ，网站功能将无法正常使用。如果可以，请您",
            "您的浏览器不支持 ECMAScript 2018 ，部分功能将无法正常使用。如果可以，请您",
            "您的浏览器不支持 ECMAScript 2019 ，部分功能将无法正常使用。如果可以，建议您",
            "您的浏览器不支持 ECMAScript 2020 ，某些功能可能无法正常使用。如果可以，建议您",
        ][_test];
        /*
         * 弹框辣！
         */
        alert(msg1 + msg2);
    }
}

/**
 * 最后的最后，把测试结果记录下来，24小时内就不再弹框了。
 */
document.cookie = "soulTest=" + _test + "; expires="+new Date(Date.now()+86400000)+"; path=/";

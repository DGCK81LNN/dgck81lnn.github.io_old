const replacements = [
    /(f\W*?)u(\W*?c\W*?k)/ig,
    /(s\W*?h\W*?)i(\W*?t)/ig,
    /(d\W*?)i(\W*?c\W*?k)/ig,
    /(b\W*?)i(\W*?t\W*?c\W*?h)/ig,
    /(p\W*?)u(\W*?s\W*?s\W*?y)/ig,
];
text.oninput = () => {
    var origin = text.value,
        result = origin;
    replacements.forEach(item => {
        result = result.replace(item, "$1x$2");
    })
    if (origin != result) {
        var selectionStart = text.selectionStart,
            selectionEnd = text.selectionEnd;
        text.value = result;
        text.setSelectionRange(selectionStart, selectionEnd);
    }
};

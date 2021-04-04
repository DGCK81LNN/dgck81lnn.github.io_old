var digits = [1],
    power = 0,
    base = parseInt(prompt("Enter Base", "2")),
    targetPower = parseInt(prompt("Enter Index", "2018")),
    loops = 16,
    ih = false;
if (isNaN(base) || base <= 0 || base > Number.MAX_SAFE_INTEGER ||
    isNaN(targetPower) || targetPower <= 0 || targetPower > Number.MAX_SAFE_INTEGER)
    throw alert("Invalid Input");

function subloop() {
    var i = 0,
        carrier = 0;
    while (i < digits.length || carrier) {
        var digit = (digits[i] || 0) * base + carrier,
            a = digit % 10;
        carrier = (digit - a) / 10,
            digits[i++] = a;
    }
}

function superloop() {
    var done = power == targetPower,
        showDigits = (done ? digits.slice() : digits.slice(Math.max(digits.length - 100, 0), digits.length)).reverse(),
        text = "Progress:",
        progress = Math.pow(power / targetPower, 2) * 20,
        showNum;
    showNum = showDigits.join("");
    for (let i = 0; i < 20; ++i)
        text += i > progress ? "-" : ">";
    text += "\nTime used: " + Math.floor(Date.now() - startTime) / 1000 + "s";
    text += "\nDigits: " + digits.length;
    text += "\nSpeed: " + loops;
    text += "\n" + base + "^" + power + "=\n" + showNum + ((done || digits.length <= 100) ? "" : "...");
    out.value = text;
    if (power > targetPower) throw alert("Error");
    else if (power == targetPower) return;
    loops = Math.min(targetPower - power, loops);
    var superloopStartTime = Date.now();
    for (let i = loops; i > 0;) switch (i % 8) {
        case 0:
            subloop(), i--;
        case 7:
            subloop(), i--;
        case 6:
            subloop(), i--;
        case 5:
            subloop(), i--;
        case 4:
            subloop(), i--;
        case 3:
            subloop(), i--;
        case 2:
            subloop(), i--;
        case 1:
            subloop(), i--;
    }
    power += loops;
    loops = Math.ceil(loops / (Date.now() - superloopStartTime) * 40) || 1;
    if (loops == Infinity && !ih) loops = 3000, ih = true;
    setTimeout(superloop, 10);
}
var startTime = Date.now();
superloop();
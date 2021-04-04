/**
 * @var {HTMLTextareaElement} text
 * @var {HTMLTextareaElement} out
 */

/** @enum {number} */
const DR = {
    RIGHT: 0, DOWN: 1, LEFT: 2, UP: 3,
    STRING: 4,
    BRIDGE: 8,
    /** @example let directions = dr & DR.DIRECTIONS; */
    DIRECTIONS: 3,
    /** @example let mDrBSomething = new Array(DR.MAX_VALUE + 1).fill(false) */
    MAX_VALUE: 11
}

/**
 * @member {boolean?} wallUp
 * @member {boolean?} wallLeft
 * @member {BefungeCell} cellUp
 * @member {BefungeCell} cellLeft
 * @member {BefungeCell} cellDown
 * @member {BefungeCell} cellRight
 * @member {boolean[]} mDrBTried maps DR to boolean
 */
class BefungeCell {
    /**
     * @param {string} char
     */
    constructor(char) {
        this._charCode = char ? char.charCodeAt(0) : 32;
        Object.defineProperties(this, {
            cellUp: {
                enumerable: false,
                writable: true,
                value: null
            },
            cellLeft: {
                enumerable: false,
                writable: true,
                value: null
            },
            cellDown: {
                enumerable: false,
                writable: true,
                value: null
            },
            cellRight: {
                enumerable: false,
                writable: true,
                value: null
            },
        });
        this.mDrBTried = new Array(8).fill(false);
    }
    get charCode() {
        return this._charCode;
    }
    set charCode(value) {
        if (!isNaN(value))
            this._charCode = Number(value);
    }
    get char() {
        return String.fromCharCode(this._charCode);
    }
    set char(value) {
        this._charCode = String(value).charCodeAt(0) || 0;
    }
    /** @returns {boolean?} */
    get wallDown() {
        return this.cellDown.wallUp;
    }
    set wallDown(value) {
        this.cellDown.wallUp = value === null ? null : Boolean(value);
    }
    /** @returns {boolean?} */
    get wallRight() {
        return this.cellRight.wallLeft;
    }
    set wallRight(value) {
        this.cellRight.wallLeft = value === null ? null : Boolean(value);
    }

    /** @param {Befunge} cell */
    attachDownCell(cell) {
        this.cellDown = cell;
        cell.cellUp = this;
    }
    /** @param {Befunge} cell */
    attachCellRight(cell) {
        this.cellRight = cell;
        cell.cellLeft = this;
    }

    /** @param {DR} dr @returns {BefungeCell} */
    cellMoveDr(dr) {
        let f = [
            cell => cell.cellRight,
            cell => cell.cellDown,
            cell => cell.cellLeft,
            cell => cell.cellUp
        ][dr & DR.DIRECTIONS];
        return dr & DR.BRIDGE ? f(f(this)) : f(this);
    }
    hardenWalls() {
        if (this.wallRight === null)
            this.wallRight = true;
        if (this.wallDown === null)
            this.wallDown = true;
        if (this.wallLeft === null)
            this.wallLeft = true;
        if (this.wallUp === null)
            this.wallUp = true;
    }
    /** @param {DR} dr */
    breakWallDr(dr) {
        if (!(dr & DR.BRIDGE))
            [
                cell => cell.wallRight = false,
                cell => cell.wallDown = false,
                cell => cell.wallLeft = false,
                cell => cell.wallUp = false
            ][dr & DR.UP](this);
    }
}
BefungeCell.prototype.mDrBTried = null;
BefungeCell.prototype.token = "comment";
BefungeCell.prototype.wallUp = BefungeCell.prototype.wallLeft = null;
BefungeCell.prototype.cellUp = BefungeCell.prototype.cellLeft = null;


class IPState {
    /** @param {BefungeCell} cell @param {DR} dr */
    constructor(cell, dr) {
        this.cell = cell;
        this.dr = dr;
    }
}


function step() {
    let {
        cell,
        dr
    } = queue.shift();
    let char = cell.char;
    /** @type {boolean[]} maps DR to boolean */
    let mDrB = new Array(DR.MAX_VALUE + 1).fill(false);
    cell.hardenWalls();
    if (dr & DR.STRING)
        if (char === "\"")
            cell.token = "string", mDrB[dr & DR.DIRECTIONS] = true;
        else {
            if (cell.token == "comment")
                cell.token = "string";
            mDrB[dr] = true;
        }
    else if (char === ">")
        cell.token = "important", mDrB[DR.RIGHT] = true;
    else if (char === "v")
        cell.token = "important", mDrB[DR.DOWN] = true;
    else if (char === "<")
        cell.token = "important", mDrB[DR.LEFT] = true;
    else if (char === "^")
        cell.token = "important", mDrB[DR.UP] = true;
    else if (char === "_")
        cell.token = "keyword", mDrB[DR.RIGHT] = mDrB[DR.LEFT] = true;
    else if (char === "|")
        cell.token = "keyword", mDrB[DR.DOWN] = mDrB[DR.UP] = true;
    else if (char === "?")
        cell.token = "keyword", mDrB[DR.RIGHT] = mDrB[DR.DOWN] = mDrB[DR.LEFT] = mDrB[DR.UP] = true;
    else if (char === "#")
        cell.token = "important", mDrB[dr | DR.BRIDGE] = true;
    else if (char === "\"")
        cell.token = "string", mDrB[dr | DR.STRING] = true;
    else if (char === "@")
        cell.token = "important", mDrB[dr] = true;
    else {
        mDrB[dr] = true;
        if ([..."+-*%!`:\\$"].includes(char))
            cell.token = "operator";
        else if ([...",.gp&~"].includes(char))
            cell.token = "function";
        else if ([..."0123456789"].includes(char))
            cell.token = "literal";
    }
    mDrB.forEach((b, dr) => {
        if (!b)
            return;
        cell.breakWallDr(dr);
        let cellNew = cell.cellMoveDr(dr),
            drNew = dr & (DR.DIRECTIONS | DR.STRING);
        if (!cellNew.mDrBTried[drNew]) {
            cellNew.mDrBTried[drNew] = true;
            queue.push(new IPState(cellNew, drNew));
        }
    });
}

function render() {
    /** @type {HTMLStyleElement} */
    let style = document.querySelector("style.mazemap") || document.head.appendChild(document.createElement("style"));
    style.className = "mazeMap";
    style.textContent = `
table.mazemap {
background-color: #eee;
font: 16px Consolas, monospace;
text-shadow: 1px 1px white;
border-collapse: collapse;
text-align: center;
}
table.mazemap td {
width: 11px;
height: 20px;
--true: 1px solid black;
--false: 1px solid transparent;
--null: 1px dotted #aaa;
}
table.mazemap td.token.operator { color: #811; }
table.mazemap td.token.important { color: #ca0; }
table.mazemap td.token.string { color: #4c0; }
table.mazemap td.token.function { color: hotpink; }
table.mazemap td.token.literal { color: purple; }
table.mazemap td.token.keyword { color: #24f; }
table.mazemap td.token.comment { color: gray; background-color: #ddd; }
table.mazemap td.ip { background: #fcc; }
`;

    /** @type {HTMLTableElement} */
    let table = document.querySelector("table.mazemap") || document.body.appendChild(document.createElement("table"));
    map.forEach((line, y) => {
        let tr = table.children[y] || table.appendChild(document.createElement("tr"));
        line.forEach((cell, x) => {
            let td = tr.children[x] || tr.appendChild(document.createElement("td"));
            td.textContent = cell.char;
            td.className = (queue.some(ip => ip.cell === cell) ? "ip" : "") + " token " + cell.token;
            td.style.borderTop = `var(--${cell.wallUp})`;
            td.style.borderLeft = `var(--${cell.wallLeft})`;
            td.style.borderBottom = `var(--${cell.wallDown})`;
            td.style.borderRight = `var(--${cell.wallRight})`;
        });
    });
    table.className = "mazemap";
}

/**
 * @type {number}
 */
var width;
/**
 * @type {number}
 */
var height;
/**
 * @type {BefungeCell[][]}
 */
var map;
/**
 * @type {IPState[]}
 */
var queue;



text.oninput = () => {
    {
        let table = document.querySelector("table.mazemap");
        if (table)
            table.remove();
    }

    width = 0;
    map = text.value.split("\n").map(line => {
        if (width < line.length)
            width = line.length;
        return [...line].map(char => new BefungeCell(char));
    });
    height = map.length;
    queue = [new IPState(map[0][0], DR.RIGHT)];

    map.forEach(line => {
        while (line.length < width)
            line.push(new BefungeCell());
    });
    map.forEach((line, y) => {
        line.forEach((cell, x) => {
            cell.attachDownCell(map[y + 1 < height ? y + 1 : 0][x]);
            cell.attachCellRight(line[x + 1 < width ? x + 1 : 0]);
        });
        line[0].wallLeft = true;
    });
    map[0].forEach(cell => {
        cell.wallUp = true;
    });
    /*
    function doIt() {
        let t = Date.now() + 10,
            i = 0;
        do
            step();
        while (i++ < 5 && Date.now() < t && queue.length);
        render();
        if (queue.length)
            setTimeout(doIt, 10);
    }
    */
    while (queue.length)
        step();
    render();
}

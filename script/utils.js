
class Table {
    constructor(rows = []) {
        this.rows = Array.isArray(rows) ? rows.filter(x => x instanceof TableRow) : [];
    }

    static parse = (object) => {
        if (!(object instanceof Object)) return undefined;
        return new Table(
            object.rows?.map(x => TableRow.parse(x))
        );
    }
}
class TableRow {
    constructor(cells = []) {
        this.cells = Array.isArray(cells) ? cells.filter(x => x instanceof TableCell) : [];
    }

    static parse = (object) => {
        if (!(object instanceof Object)) return undefined;
        return new TableRow(
            object.cells?.map(x => TableCell.parse(x))
        );
    }
}
class TableCell {
    constructor(text) {
        this.text = typeof text === 'string' ? text : "";
    }

    static parse = (text) => new TableCell(text);
    /* OPEN THIS WHEN TABLECELL WILL HAVE MORE ATTRIBUTES */
    // static parse = (object) => {
    //     console.log("TableCell", object);
    //     if (!(object instanceof Object)) return undefined;
    //     return new TableCell(
    //         object
    //     );
    // }
}

class Id {
    #key = null;
    //#context = null;
    static logIdList = [];

    constructor(string, context = null, { forceDuplicateError = false } = {}) {
        Object.defineProperty(this, "equals", { enumerable: false });
        try {
            if (typeof string !== 'string') throw `invalid parameter passed`;
            string = string.replace(/^\s+|\s+$/ig, "");
            string = string.replace(/[^0-9a-z-_]+/ig, "_");
            string = string.toLowerCase();
            if (context !== null && (typeof context !== 'string' || context.length === 0)) context = null;
            if (context) {
                if (forceDuplicateError && Id.isDuplicate(string, context)) throw `duplicate value ${string}.`;
                //if (Id.isDuplicate(string, context)) string = `${string}_${Id.nextId(string, context)}`;
                Id.logId(string, context);
            }
            this.#key = string;
            //this.#context = context;
            return this;
        } catch(e) {
            console.error(e);
            return undefined;
        }
    }

    get value() {
        //if (this.#context) return `${this.#context}_${this.#key}`;
        return this.#key;
    }

    toName = () => this.#key.replace(/_+/ig," ").replace(/(?<=^| )\w/ig, c => c.toUpperCase());

    equals = (id) => id.string === this.#key;

    static logId = (string, context) => {
        if (!string || !context) return false;
        const contextElement = this.logIdList.find(e => e.context === context);
        if (contextElement) {
            if (contextElement.list) contextElement.list.push(string);
            else contextElement.list = [string];
        }
        else this.logIdList.push({ context: context, list: [string] });
        return true;
    }

    static nextId = (string, context) => {
        if (!string || !context) return 0;
        const contextList = this.logIdList.find(e => e.context === context);
        if (!contextList || !contextList.list) return 0;
        return contextList.list.filter(e => e.indexOf(string) >= 0).length;
    }

    static isDuplicate = (string, context) => {
        if (!string || !context) return false;
        return this.logIdList.find(e => e.context === context && e.list?.includes(string)) ? true : false;
    }

    static cleanContext = (context) => {
        if (typeof context === 'undefined' || context === "") this.logIdList = [];
        this.logIdList = this.logIdList.filter(x => x.context !== context);
        return this.logIdList;
    }
}

function isFinitePositive(int) {
    return typeof int === 'number' && !isNaN(int) && isFinite(int) && int >= 0;
}

//NEED REFACTORY...
function replaceMarkup(string) {
    const markupList = [
        { key: '((1))', value: { tagName: "img", attr: { "src": "assets/image/dist1.png", "class": "inline-image" } } },
        { key: '((2))', value: { tagName: "img", attr: { "src": "assets/image/dist2.png", "class": "inline-image" } } },
        { key: '((3))', value: { tagName: "img", attr: { "src": "assets/image/dist3.png", "class": "inline-image" } } },
        { key: '((6))', value: { tagName: "img", attr: { "src": "assets/image/dist6.png", "class": "inline-image" } } },
        { key: '((R))', value: { tagName: "img", attr: { "src": "assets/image/ranged.png", "class": "inline-image" } } },
        { key: '((M))', value: { tagName: "img", attr: { "src": "assets/image/melee.png", "class": "inline-image" } } },
        { key: '((-))', value: "•" },
    ];
    const container = document.createElement("span");
    let parts = [string];
    markupList.forEach(markup => {
        const temp = [];
        parts.forEach(element => {
            if (element instanceof HTMLElement) {
                temp.push(element);
                return;
            }
            element.split(markup.key).forEach((part, i) => {
                if (i > 0) {
                    let replacement;
                    if (typeof markup.value === 'string') replacement = markup.value;
                    else {
                        replacement = document.createElement(markup.value.tagName);
                        for (const attr in markup.value.attr) {
                            replacement.setAttribute(attr, markup.value.attr[attr]);
                        }
                    }
                    temp.push(replacement);
                }
                if (part !== "") temp.push(part);
            });
        });
        parts = temp;
    });
    parts.forEach(p => {
        if (p instanceof HTMLElement) container.appendChild(p);
        else container.appendChild(document.createTextNode(p));
    });
    return container;
}

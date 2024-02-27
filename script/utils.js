class Id {
    key = null;
    context = null;
    static logIdList = [];

    constructor(string, context = null) {
        Object.defineProperty(this, "equals", { enumerable: false });
        try {
            if (typeof string !== 'string') throw `invalid parameter passed`;
            string = string.replace(/^\s+|\s+$/ig, "");
            string = string.replace(/[^0-9a-z-_]+/ig, "_");
            string = string.toLowerCase();
            if (context !== null && (typeof context !== 'string' || context.length === 0)) context = null;
            if (context) {
                if (Id.isDuplicate(string, context)) throw `duplicate value ${string}.`;
                Id.logId(string, context);
            }
            this.key = string;
            this.context = context;
            return this;
        } catch(e) {
            console.error(e);
            return undefined;
        }
    }

    equals = (id) => id.key === this.key;

    static logId = (key, context) => {
        if (!key || !context || Id.isDuplicate(key, context)) return false;
        const contextElement = this.logIdList.find(e => e.context === context);
        if (contextElement) {
            if (contextElement.list) contextElement.list.push(key);
            else contextElement.list = [key];
        }
        else this.logIdList.push({ context: context, list: [key] });
        return true;
    }
    static isDuplicate = (key, context) => {
        if (!key || !context) return false;
        return (this.logIdList.find(e => e.context === context && e.list?.includes(key)) ? true : false);
    }

    static cleanContext = (context) => {
        if (typeof context === 'undefined' || context === "") this.logIdList = [];
        this.logIdList = this.logIdList.filter(x => x.context !== context);
        return this.logIdList;
    }
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

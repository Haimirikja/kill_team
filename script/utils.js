class Id {
    key = null;
    context = null;
    static logIdList = [];

    constructor(string, context = null) {
        Object.defineProperty(this, "equals", { enumerable: false });
        try {
            if (string === null || typeof string !== 'string') throw `invalid null parameter passed`;
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
            alert(e);
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
}

function replaceMarkup(string) {
    const markupList = [
        { key: '((1))', value: { tagName: "img", attr: { src: "assets/image/dist1.png", class: "inline-image" } } },
        { key: '((2))', value: { tagName: "img", attr: { src: "assets/image/dist2.png", class: "inline-image" } } },
        { key: '((3))', value: { tagName: "img", attr: { src: "assets/image/dist3.png", class: "inline-image" } } },
        { key: '((6))', value: { tagName: "img", attr: { src: "assets/image/dist6.png", class: "inline-image" } } },
        { key: '((R))', value: { tagName: "img", attr: { src: "assets/image/ranged.png", class: "inline-image" } } },
        { key: '((M))', value: { tagName: "img", attr: { src: "assets/image/melee.png", class: "inline-image" } } },
    ];
    const container = document.createElement("span");
    let parts = [string];
    markupList.forEach(markup => {
        let output = [];
        parts.forEach(s => {
            if (s instanceof HTMLElement) {
                output.push(s);
                return;
            }
            s.split(markup.key).forEach((e, i) => {
                if (i > 0) {
                    const replacement = document.createElement(markup.value.tagName);
                    for (const a in markup.value.attr) {
                        replacement.setAttribute(a, markup.value.attr[a]);
                    }
                    output.push(replacement);
                }
                output.push(e);
            });
        });
        parts = output;
    });
    parts = parts.map(x => {
        if (x instanceof HTMLElement) return x;
        return document.createTextNode(x);
    });
    parts.forEach(p => {
        container.appendChild(p);
    });
    return container;
}

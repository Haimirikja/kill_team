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
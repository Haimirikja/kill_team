
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

window.onload = () => {
    /*
    const kt = new KillTeam("Corsair Voidscarred", "Aeldari");
    const op = new Operative("Felarch", { experiencePoints: 6 });
    console.log(op);
    kt.addOperative(op);
    console.log(kt);
    kt.removeOperative(op);
    console.log(kt);
    */
    console.log(EQUIPMENTS);
    const target = document.getElementById("Content");
    EQUIPMENTS.forEach(kt => {
        if (kt.killTeam === "void-dancer_troupe") {
            const items = kt.items;
            const rareItems = kt.rareItems;
            items.forEach(item => {
                const name = item.name;
                const description = item.description;
                const value = item.value;
                const value2 = item.value2;
                const limit = item.limit;
                const dedicated = item.dedicated;
                const ability = item.ability;
                const action = item.action;
                const weapon = item.weapon;
                const id = new Id(name, "item");
                const itemElement = document.createElement("div");
                if (id.key) itemElement.id = id.key;
                if (dedicated) itemElement.setAttribute("for", new Id(dedicated).key);
                const itemHeader = document.createElement("header");
                const itemName = document.createElement("h2");
                itemName.innerText = name;
                if (limit) {
                    const limitElement = document.createElement("sup");
                    limitElement.innerText = "+";
                    itemName.appendChild(limitElement);
                }
                const itemCost = document.createElement("span");
                itemCost.innerText = `[${value + (value2 !== null ? "/" + value2 : "")}EP]`;
                itemName.appendChild(itemCost);
                itemHeader.appendChild(itemName);
                itemElement.appendChild(itemHeader);
                if (description) {
                    const descriptionElement = document.createElement("div");
                    description.forEach(row => {
                        const rowElement = document.createElement("div");
                        rowElement.innerText = row;
                        descriptionElement.appendChild(rowElement);
                    });
                    itemElement.appendChild(descriptionElement);
                }
                if (ability) {
                    itemElement.appendChild(Ability.parse(ability).toHTML());
                }
                if (action) {
                    itemElement.appendChild(Action.parse(action).toHTML());
                }
                if (weapon) {
                    itemElement.appendChild(Weapon.parse(weapon).toHTML());
                }
                target.appendChild(itemElement);
            });
        }
    });
    
}
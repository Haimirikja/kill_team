
class Equipment {
    constructor(name, rare = false, value = [], limit = false, dedicated = null, description = [], { ability = null, action = null, weapon = null } = {}) {
        Object.defineProperty(this, "toString", { enumerable: false });
        Object.defineProperty(this, "equals", { enumerable: false });
        Object.defineProperty(this, "toHTML", { enumerable: false });
        this.name = name && typeof name === 'string' ? name : "";
        this.rare = typeof rare === 'boolean' ? rare : false;
        this.value = Array.isArray(value) ? value.filter(x => isFinitePositive(x)) : [];
        this.limit = typeof limit === 'boolean' ? limit : false;
        this.dedicated = dedicated instanceof Id ? dedicated.key : null;
        this.description = Array.isArray(description) ? description.filter(x => typeof x === 'string') : [];
        this.ability = ability instanceof Ability ? ability : null;
        this.action = action instanceof Action ? action : null;
        this.weapon = weapon instanceof Weapon ? weapon : null;
    }

    static parse = (object) => {
        if (!(object instanceof Object)) return undefined;
        return new Equipment(
            object.name,
            object.rare,
            object.value,
            object.limit,
            object.dedicated ? new Id(object.dedicated) : null,
            object.description,
            {
                ability: object.ability ? Ability.parse(object.ability) : null,
                action: object.action ? Action.parse(object.action) : null,
                weapon: object.weapon ? Weapon.parse(object.weapon) : null,
            }
        );
    }

    toString = () => JSON.stringify({
        name: this.name,
        rare: this.rare,
        value: this.value,
        limit: this.limit,
        dedicated: this.dedicated,
        description: this.description,
        ability: this.ability,
        action: this.action,
        weapon: this.weapon,
    });

    equals = (equipment) => {
        if (!(equipment instanceof Equipment)) equipment = Equipment.parse(equipment);
        return equipment && equipment.toString() === this.toString();
    }

    toHTML = () => {
        const itemElement = document.createElement("div");
        itemElement.classList.add("kill-team-item");
        itemElement.id = new Id(this.name, "equipment").key;
        if (this.dedicated) itemElement.setAttribute("for", new Id(this.dedicated).key);
        const itemHeader = document.createElement("header");
        const itemName = document.createElement("div");
        itemName.classList.add("title");
        itemName.innerText = this.name;
        if (this.limit) {
            const limitElement = document.createElement("sup");
            limitElement.innerText = "+";
            itemName.appendChild(limitElement);
        }
        itemName.appendChild(document.createTextNode(` [${this.value.join("/")}EP]`))
        itemHeader.appendChild(itemName);
        itemElement.appendChild(itemHeader);
        if (this.description) {
            const descriptionElement = document.createElement("div");
            this.description.forEach(row => {
                descriptionElement.appendChild(replaceMarkup(row));
            });
            itemElement.appendChild(descriptionElement);
        }
        if (this.ability) itemElement.appendChild(this.ability.toHTML());
        if (this.action) itemElement.appendChild(this.action.toHTML());
        if (this.weapon) itemElement.appendChild(this.weapon.toHTML({ tableWrapper: true }));
        return itemElement;
    }
}

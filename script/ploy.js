
class Ploy {
    constructor(name = "", cost = null, description = [], { abilities = [], actions = [], weapons = [] } = {}) {
        Object.defineProperty(this, "toString", { enumerable: false });
        Object.defineProperty(this, "equals", { enumerable: false });
        Object.defineProperty(this, "toHTML", { enumerable: false });
        this.name = name && typeof name === 'string' ? name : "";
        cost = parseInt(cost);
        this.cost = isFinitePositive(cost) && cost > 0 ? cost : null;
        this.description = Array.isArray(description) ? description.filter(x => typeof x === 'string') : [];
        this.abilities = Array.isArray(abilities) ? abilities.filter(x => x instanceof Ability) : [];
        this.actions = Array.isArray(actions) ? actions.filter(x => x instanceof Action) : [];
        this.weapons = Array.isArray(weapons) ? weapons.filter(x => x instanceof Weapon) : [];
    }

    static parse = (object) => {
        if (!(object instanceof Object)) return undefined;
        return new Ploy(
            object.name,
            object.cost,
            object.description,
            {
                abilities: object.abilities?.map(x => Ability.parse(x)),
                actions: object.actions?.map(x => Action.parse(x)),
                weapons: object.weapons?.map(x => Weapon.parse(x)),
            },
        );
    }

    toString = () => JSON.stringify({
        name: this.name,
        cost: this.cost,
        description: this.description,
        abilities: this.abilities,
        actions: this.actions,
        weapons: this.weapons,
    });

    equals = (ploy) => {
        if (!(ploy instanceof Ploy)) ploy = Ploy.parse(ploy);
        return ploy && ploy.toString() === this.toString();
    }

    toHTML = () => {
        const ployElement = document.createElement("div");
        ployElement.classList.add("ploy");
        const ployHeader = document.createElement("header");
        const ployName = document.createElement("span");
        ployName.innerText = this.name;
        ployHeader.appendChild(ployName);
        if (this.cost !== null) {
            const ployCost = document.createElement("span");
            ployCost.innerText = `${this.cost}CP`;
            ployHeader.appendChild(ployCost);
        }
        ployElement.appendChild(ployHeader);
        if (this.type) {
            const ployType = document.createElement("div");
            const ployTypeText = document.createElement("i");
            ployTypeText.innerText = `${this.type} Ploy`;
            ployType.appendChild(ployTypeText);
            ployElement.appendChild(ployType);
        }
        const ployContent = document.createElement("div");
        ployContent.classList.add("content");
        this.description.forEach((row, i) => {
            if (i > 0) ployContent.appendChild(document.createElement("br"));
            ployContent.appendChild(replaceMarkup(row));
        });
        if (this.abilities.length) {
            this.abilities.forEach(ability => {
                ployContent.appendChild(ability.toHTML());
            });
        }
        if (this.actions.length) {
            this.actions.forEach(action => {
                ployContent.appendChild(action.toHTML());
            });
        }
        if (this.weapons.length) {
            this.weapons.forEach(weapon => {
                ployContent.appendChild(weapon.toHTML({tableWrapper: true}));
            });
        }
        ployElement.appendChild(ployContent);
        return ployElement;
    }
}

class StrategicPloy extends Ploy {
    constructor(name = "", cost = 0, description = [], { abilities = [], actions = [], weapons = [] } = {}) {
        super(name, cost, description, { abilities: abilities, actions: actions, weapons: weapons });
        this.type = "Strategic";
    }

    static parse = (object) => {
        if (!(object instanceof Object)) return undefined;
        return new StrategicPloy(
            object.name,
            object.cost,
            object.description,
            {
                abilities: object.abilities?.map(x => Ability.parse(x)),
                actions: object.actions?.map(x => Action.parse(x)),
                weapons: object.weapons?.map(x => Weapon.parse(x)),
            },
        );
    }
}

class TacticalPloy extends Ploy {
    constructor(name = "", cost = 0, description = [], { abilities = [], actions = [], weapons = [] } = {}) {
        super(name, cost, description, { abilities: abilities, actions: actions, weapons: weapons });
        this.type = "Tactical";
    }

    static parse = (object) => {
        if (!(object instanceof Object)) return undefined;
        return new TacticalPloy(
            object.name,
            object.cost,
            object.description,
            {
                abilities: object.abilities?.map(x => Ability.parse(x)),
                actions: object.actions?.map(x => Action.parse(x)),
                weapons: object.weapons?.map(x => Weapon.parse(x)),
            },
        );
    }
}

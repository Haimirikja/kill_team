
class Ploy {
    constructor(name = "", cost = 0, description = []) {
        Object.defineProperty(this, "toString", { enumerable: false });
        Object.defineProperty(this, "equals", { enumerable: false });
        Object.defineProperty(this, "toHTML", { enumerable: false });
        this.name = name && typeof name === 'string' ? name : "";
        cost = parseInt(cost);
        this.cost = !isNaN(cost) && isFinite(cost) && cost > 0 ? cost : 0;
        this.description = Array.isArray(description) ? description.filter(x => typeof x === 'string') : [];
    }

    static parse = (object) => {
        if (!(object instanceof Object)) return undefined;
        return new Ploy(
            object.name,
            object.cost,
            object.description,
        );
    }

    toString = () => JSON.stringify({
        name: this.name,
        cost: this.cost,
        description: this.description,
    });

    equals = (ploy) => {
        if (!(ploy instanceof Ploy)) ploy = Ploy.parse(ploy);
        return this.toString() === ploy.toString();
    }

    toHTML = () => {
        const ployElement = document.createElement("div");
        ployElement.classList.add("ploy");
        const ployHeader = document.createElement("header");
        const ployName = document.createElement("span");
        ployName.innerText = this.name;
        const ployCost = document.createElement("span");
        ployCost.innerText = `${this.cost}CP`;
        ployHeader.appendChild(ployName);
        ployHeader.appendChild(ployCost);
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
        })
        ployElement.appendChild(ployContent);
        return ployElement;
    }
}

class StrategicPloy extends Ploy {
    constructor(name = "", cost = 0, description = []) {
        super(name, cost, description);
        this.type = "Strategic";
    }

    static parse = (object) => {
        if (!(object instanceof Object)) return undefined;
        return new StrategicPloy(
            object.name,
            object.cost,
            object.description,
        );
    }
}

class TacticalPloy extends Ploy {
    constructor(name = "", cost = 0, description = []) {
        super(name, cost, description);
        this.type = "Tactical";
    }

    static parse = (object) => {
        if (!(object instanceof Object)) return undefined;
        return new TacticalPloy(
            object.name,
            object.cost,
            object.description,
        );
    }
}

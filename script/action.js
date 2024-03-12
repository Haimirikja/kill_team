
class Action {
    constructor(name, cost = 1, description = []) {
        Object.defineProperty(this, "toString", { enumrable: false });
        Object.defineProperty(this, "equals", { enumrable: false });
        Object.defineProperty(this, "toHTML", { enumerable: false });
        cost = parseInt(cost);
        this.name = name && typeof name === 'string' ? name : "";
        this.cost = isFinitePositive(cost) ? cost : 1;
        if (!Array.isArray(description)) description = [description];
        this.description = description.filter(x => typeof x === 'string');
    }

    static parse = (object) => {
        if (!(object instanceof Object)) return undefined;
        return new Action(
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

    equals = (action) => {
        if (!(action instanceof Action)) action = Ability.parse(action);
        return action && action.toString() === this.toString();
    }

    toHTML = ({ isBlock = false } = {}) => {
        isBlock = typeof isBlock === 'boolean' ? isBlock : false;
        const actionElement = document.createElement("div");
        actionElement.classList.add("action");
        if (isBlock) {
            const actionTitle = document.createElement("div");
            ["title", "flex", "row", "nowrap", "space-between"].forEach(cls => actionTitle.classList.add(cls));
            const actionName = document.createElement("span");
            actionName.innerText = this.name;
            actionTitle.appendChild(actionName);
            const actionCost = document.createElement("span");
            actionCost.innerText = `${this.cost}AP`;
            actionTitle.appendChild(actionCost);
            actionElement.appendChild(actionTitle);
            const actionContent = document.createElement("div");
            actionContent.classList.add("content");
            this.description.forEach((row, i) => {
                if (i > 0) actionContent.appendChild(document.createElement("br"));
                actionContent.appendChild(replaceMarkup(row));
            });
            actionElement.appendChild(actionContent);
        } else {
            const actionName = document.createElement("b");
            actionName.innerText = `${this.name} (${this.cost}AP)${this.description.length ? ": " : ""}`;
            actionElement.appendChild(actionName);
            this.description.forEach((row, i) => {
                if (i > 0) actionElement.appendChild(document.createElement("br"));
                actionElement.appendChild(replaceMarkup(row));
            });
        }
        return actionElement;
    }
}

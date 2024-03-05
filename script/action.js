
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

    toHTML = () => {
        const actionElement = document.createElement("div");
        actionElement.classList.add("kill-team-action");
        const actionName = document.createElement("b");
        actionName.innerText = `${this.name} (${this.cost}AP)${this.description.length ? ": " : ""}`;
        actionElement.appendChild(actionName);
        this.description.forEach((row, i) => {
            if (i > 0) actionElement.appendChild(document.createElement("br"));
            actionElement.appendChild(replaceMarkup(row));
        });
        return actionElement;
    }
}

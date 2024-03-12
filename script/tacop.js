const TacOpCategory = [
    "Seek & Destroy",
    "Security",
    "Infiltration",
    "Recon",
    "Faction",
];

class TacOp {
    constructor(name = "", category = "", killTeam = "", description = [], resolves = [], { actions = [] } = {}) {
        Object.defineProperty(this, "toString", { enumerable: false });
        Object.defineProperty(this, "equals", { enumerable: false });
        Object.defineProperty(this, "toHTML", { enumerable: false });
        this.name = typeof name === 'string' ? name : "";
        this.category = TacOpCategory.find(x => x === category) ?? "";
        this.killTeam = typeof killTeam === 'string' ? killTeam : "";
        this.description = Array.isArray(description) ? description.filter(x => typeof x === 'string') : [];
        this.resolves = Array.isArray(resolves) ? resolves.filter(x => typeof x === 'string') : [];
        this.actions = Array.isArray(actions) ? actions.filter(x => x instanceof Action) : [];
    }

    static parse = (object) => {
        if (!(object instanceof Object)) return undefined;
        console.log(object);
        return new TacOp(
            object.name,
            object.category,
            object.killTeam,
            object.description,
            object.resolves,
            {
                actions: object.actions?.map(x => Action.parse(x)),
            }
        )
    }

    toString = () => JSON.stringify({
        name: this.name,
        category: this.category,
        killTeam: this.killTeam,
        description: this.description,
        resolves: this.resolves,
        actions: this.actions,
    });

    equals = (tacOp) => {
        if (!(tacOp instanceof TacOp)) tacOp = TacOp.parse(tacOp)
        return tacOp && tacOp.toString() === this.toString();
    }

    toHTML = () => {
        const tacOpElement = document.createElement("div");
        tacOpElement.classList.add("tacop");
        tacOpElement.setAttribute("data-type", this.type);
        if (this.killTeam) tacOpElement.setAttribute("data-kill-team", this.killTeam);
        const tacOpName = document.createElement("div");
        tacOpName.classList.add("title");
        tacOpName.innerText = this.name;
        tacOpElement.appendChild(tacOpName);
        const tacOpContent = document.createElement("div");
        tacOpContent.classList.add("content");
        tacOpContent.appendChild(document.createTextNode(this.category));
        tacOpContent.appendChild(document.createTextNode(this.killTeam));
        this.description.forEach(row => tacOpContent.appendChild(document.createTextNode(row)));
        this.resolves.forEach(row => tacOpContent.appendChild(document.createTextNode(row)));
        this.actions.forEach(action => tacOpContent.appendChild(action.toHTML({ isBlock: true })));
        tacOpElement.appendChild(tacOpContent);
        return tacOpElement;
    }

}
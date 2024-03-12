const TacOpCategory = [
    "Seek & Destroy",
    "Security",
    "Infiltration",
    "Recon",
    "Faction",
];

class TacOp {
    constructor(name = "", category = "", killTeam = "", description = [], resolves = [], { actions = [] } = {}){
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
        return new TacOp(
            object.name,
            object.category,
            object.killTeam,
            object.description,
            object.resolves,
            object.actions?.map(x => Action.parse(x)),
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
        tacOpElement.appendChild(document.createTextNode(this.name));
        tacOpElement.appendChild(document.createTextNode(this.category));
        tacOpElement.appendChild(document.createTextNode(this.killTeam));
        this.description.forEach(row => tacOpElement.appendChild(document.createTextNode(row)));
        this.resolves.forEach(row => tacOpElement.appendChild(document.createTextNode(row)));
        this.actions.forEach(action => tacOpElement.appendChild(action.toHTML()));
        return tacOpElement;
    }

}

window.onload = () => {

    const target = document.getElementById("Content");
    TAC_OPS.forEach(tacOp => {
        target.appendChild(TacOp.parse(tacOp).toHTML());
    });

}
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
        tacOpElement.id = new Id(`${this.name} ${this.category} ${this.killTeam}`, "tacop").value;
        tacOpElement.classList.add("tacop");
        tacOpElement.setAttribute("for", new Id(this.category).value);
        if (this.killTeam) tacOpElement.setAttribute("data-kill-team", new Id(this.killTeam).value);
        const tacOpName = document.createElement("div");
        tacOpName.classList.add("title");
        tacOpName.innerText = this.name;
        tacOpElement.appendChild(tacOpName);
        const tacOpContent = document.createElement("div");
        tacOpContent.classList.add("content");
        let genericContainer;
        genericContainer = document.createElement("div");
        const tacOpCategory = document.createElement("i");
        tacOpCategory.innerText = this.category;
        genericContainer.appendChild(tacOpCategory);
        tacOpContent.appendChild(genericContainer);
        //tacOpCategory.appendChild(document.createTextNode(this.killTeam));
        genericContainer = document.createElement("div");
        this.description.forEach((row, i) => {
            if (i > 0) genericContainer.appendChild(document.createElement("br"));
            genericContainer.appendChild(replaceMarkup(row));
        });
        tacOpContent.appendChild(genericContainer);
        genericContainer = document.createElement("ul");
        let listElement;
        this.resolves.forEach(row => {
            listElement = document.createElement("li");
            listElement.appendChild(replaceMarkup(row));
            genericContainer.appendChild(listElement);
        });
        tacOpContent.appendChild(genericContainer);
        this.actions.forEach(action => tacOpContent.appendChild(action.toHTML({ isBlock: true })));
        tacOpElement.appendChild(tacOpContent);
        return tacOpElement;
    }

}
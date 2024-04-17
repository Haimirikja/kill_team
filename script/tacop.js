const TacOpCategory = [
    "Seek & Destroy",
    "Security",
    "Infiltration",
    "Recon",
    "Faction",
];

class TacOp {
    static pickedTacOps = new Deck();
    static selectedTacOps = new Deck();

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

    toHTML = ({ mode = "rule", callback_update = null } = {}) => {
        switch(mode.toUpperCase()) {
            case "RULE":
                mode = "RULE";
                break;
            case "CARD":
            default:
                mode = "CARD";
                break;
        }
        const tacOpElement = document.createElement("div");
        tacOpElement.id = new Id(`${this.name} ${this.category} ${this.killTeam}`, "tacop").value;
        tacOpElement.classList.add("tacop");
        if (mode === "CARD") tacOpElement.classList.add("card");
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
        if (mode === "RULE") {
            tacOpElement.addEventListener('click', _ => {
                const sender = document.getElementById(tacOpElement.id);
                if (!sender.classList.contains("selected") && TacOp.pickedTacOps.elements.length < 6) {
                    sender.classList.toggle("selected", true);
                    this.addTacOp();
                } else {
                    sender.classList.toggle("selected", false);
                    this.removeTacOp();
                }
                callback_update();
            });
        }
        return tacOpElement;
    }

    addTacOp = () => {
        if (!TacOp.pickedTacOps.elements.find(x => x.equals(this))) TacOp.pickedTacOps.add(this);
    }
    removeTacOp = () => {
        TacOp.pickedTacOps.elements = TacOp.pickedTacOps.elements.filter(x => !x.equals(this));
    }
    save = (killTeamName) => {
        if (!localStorage) return;
        const storage = JSON.parse(localStorage.getItem("TacOpsManager")) ?? [{ killTeam: killTeamName }];
        if (!storage || !Array.isArray(storage)) return;
		const skt = storage.find(kt => kt.killTeam === killTeamName);
		if (!skt) storage.push({ killTeam: killTeamName, tacOps: [this] });
		else {
			if (skt.tacOps && skt.tacOps.length) skt.tacOps.push(this);
			else skt.tacOps = [this];
		}
		localStorage.setItem("TacOpsManager", JSON.stringify(storage));
    }
    
}
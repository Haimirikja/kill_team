
class FireTeam {
    constructor(name = "", operatives = []) {
        Object.defineProperty(this, "addOperative", { enumerable: false });
        Object.defineProperty(this, "removeOperative", { enumerable: false });
        Object.defineProperty(this, "parse", { enumerable: false });
        Object.defineProperty(this, "toString", { enumerable: false });
        Object.defineProperty(this, "equals", { enumerable: false });
        Object.defineProperty(this, "toHTML", { enumerable: false });
        this.name = name && typeof name === 'string' ? name : "";
        this.operatives = Array.isArray(operatives) ? operatives.filter(x => x instanceof Operative) : [];
    }
    
    addOperative = (operative) => {
        if (operative instanceof Operative) this.operatives.push(operative);
        return this.operatives;
    }

    removeOperative = (operative) => {
        if (operative instanceof Operative) this.operatives.splice(this.operatives.indexOf(this.operatives.find(x => x.equals(operative))), 1);
        return this.operatives;
    }

    static parse = (object) => {
        if (!(object instanceof Object)) return undefined;
        return new FireTeam (
            object.name,
            object.operatives?.map(x => Operative.parse(x)),
        )
    }

    toString = () => JSON.stringify({
        name: this.name,
        operatives: this.operatives,
    });

    equals = (fireTeam) => fireTeam && fireTeam.name && this.name === fireTeam.name;

    toHTML = ({ goBackRef = null } = {}) => {
        const fireTeamElement = document.createElement("div");
        fireTeamElement.id = new Id(this.name, "fire_team").value;
        fireTeamElement.classList.add("kill-team-fire-team");
        const fireTeamName = document.createElement("h2");
        fireTeamName.classList.add("title");
        fireTeamName.classList.add("toggle-show");
        fireTeamName.appendChild(document.createTextNode(`${this.name} Fire Team`));
        fireTeamElement.appendChild(fireTeamName);
        const fireTeamContent = document.createElement("div");
        fireTeamName.addEventListener('click', (e) => slideToggle(fireTeamContent, { sender: e.currentTarget }));
        const operativeList = document.createElement("div");
        operativeList.classList.add("legend");
        const operativeListTitle = document.createElement("h3");
        operativeListTitle.classList.add("title");
        operativeListTitle.innerText = "Operatives";
        operativeList.appendChild(operativeListTitle);
        const operativeBlock = document.createElement("div");
        operativeBlock.classList.add("datasheet");
        this.operatives.forEach(operative => {
            const operativeLink = document.createElement("a");
            operativeLink.setAttribute("href", `#${new Id(operative.name).value}`);
            operativeLink.innerText = operative.name;
            operativeList.appendChild(operativeLink);
            operativeBlock.appendChild(operative.toHTML({ goBackRef: fireTeamElement }));
        });
        if (goBackRef instanceof HTMLElement && goBackRef.id){
            const goToElement = document.createElement("a");
            goToElement.setAttribute("href", `#${goBackRef.id}`);
            goToElement.innerText = "⯅ Back";
            fireTeamContent.appendChild(goToElement);
        }
        fireTeamContent.appendChild(operativeList);
        fireTeamContent.appendChild(operativeBlock);
        fireTeamElement.appendChild(fireTeamContent);
        return fireTeamElement;
    }
}
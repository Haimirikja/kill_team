class Operative {
    constructor(
        name = "",
        stats = [],
        weapons = [],
        abilities = [],
        actions = [],
        {
            mandatory = false,
            limitNum = 0,
            limitTag = [],
        } = {}
    ) {
        Object.defineProperty(this, "toString", { enumerable: false });
        Object.defineProperty(this, "equals", { enumerable: false });
        Object.defineProperty(this, "toHTML", { enumerable: false });
        this.name = name && typeof name === 'string' ? name : "";
        this.stats = new Array(6).fill("");
        if (Array.isArray(stats)) stats.forEach((x, i) => this.stats[i] = x);
        this.weapons = Array.isArray(weapons) ? weapons.filter(x => x instanceof Weapon) : [];
        this.abilities = Array.isArray(abilities) ? abilities.filter(x => x instanceof Ability) : [];
        this.actions = Array.isArray(actions) ? actions.filter(x => x instanceof Action) : [];
        this.mandatory = typeof mandatory === 'boolean' ? mandatory : false;
        limitNum = parseInt(limitNum);
        this.limitNum = isFinitePositive(limitNum) ? limitNum : 0;
        this.limitTag = Array.isArray(limitTag) ? limitTag.filter(x => typeof x === 'string') : [];
    }

    static parse = (object) => {
        if (!(object instanceof Object)) return undefined;
        return new Operative(
            object.name,
            object.stats,
            object.weapons?.map(x => Weapon.parse(x)),
            object.abilities?.map(x => Ability.parse(x)),
            object.actions?.map(x => Action.parse(x)),
            {
                mandatory: object.mandatory,
                limitNum: object.limitNum,
                limitTag: object.limitTag,
            }
        );
    }

    toString = () => JSON.stringify({
        name: this.name,
        stats: this.stats,
        weapons: this.weapons,
        abilities: this.abilities,
        actions: this.actions,
        mandatory: this.mandatory,
        limitNum: this.limitNum,
        limitTag: this.limitTag,
    });

    equals = (operative) => {
        if (!(operative instanceof Operative)) operative = Operative.parse(operative);
        return this.toString() === operative.toString();
    }

    toHTML = () => {
        const operativeElement = document.createElement("div");
        operativeElement.classList.add("kill-team-operative");
        operativeElement.id = new Id(this.name, "operative").key;
        const operativeHeader = document.createElement("header");
        const operativeName = document.createElement("div");
        operativeName.classList.add("operative-name");
        operativeName.innerText = this.name;
        operativeHeader.appendChild(operativeName);
        const operativeStats = document.createElement("table");
        operativeStats.classList.add("operative-stats");
        let tableRow;
        let tableCell;
        tableRow = document.createElement("tr");
        ["M", "APL", "GA", "DF", "SV", "W"].forEach(column => {
            tableCell = document.createElement("th");
            tableCell.innerText = column;
            tableRow.appendChild(tableCell);
        });
        operativeStats.appendChild(tableRow);
        tableRow = document.createElement("tr");
        this.stats.forEach((stat, i) => {
            tableCell = document.createElement("td");
            if (stat) tableCell.innerText = i === 4 ? `${stat}+` : stat;
            tableRow.appendChild(tableCell);
        });
        operativeStats.appendChild(tableRow);
        operativeHeader.appendChild(operativeStats);
        operativeElement.appendChild(operativeHeader);
        const operativeInventory = Weapon.tableHTMLWrapper;
        const table = Weapon.tableHTMLWrapper;
        table.appendChild(Weapon.tableHTMLHeader);
        this.weapons.forEach(weapon => {
            table.appendChild(weapon.toHTML());
        });
        operativeInventory.appendChild(table);
        operativeElement.appendChild(operativeInventory);
        const operativeInfo = document.createElement("div");
        operativeInfo.classList.add("operative-info");
        let blockElement;
        let blockTitle;
        let blockContent;
        blockElement = document.createElement("div");
        blockElement.classList.add("operative-abilities");
        blockTitle = document.createElement("div");
        blockTitle.classList.add("title");
        blockTitle.innerText = "Abilities";
        blockElement.appendChild(blockTitle);
        blockContent = document.createElement("div");
        blockContent.classList.add("content");
        if (this.abilities.length === 0) blockContent.innerText = "-";
        this.abilities.forEach(ability => {
            blockContent.appendChild(ability.toHTML());
        });
        blockElement.appendChild(blockContent);
        operativeInfo.appendChild(blockElement);
        blockElement = document.createElement("div");
        blockElement.classList.add("operative-actions");
        blockTitle = document.createElement("div");
        blockTitle.classList.add("title");
        blockTitle.innerText = "Unique Actions";
        blockElement.appendChild(blockTitle);
        blockContent = document.createElement("div");
        blockContent.classList.add("content");
        if (this.actions.length === 0) blockContent.innerText = "-";
        this.actions.forEach(action => {
            blockContent.appendChild(action.toHTML());
        });
        blockElement.appendChild(blockContent);
        operativeInfo.appendChild(blockElement);
        operativeElement.appendChild(operativeInfo);
        return operativeElement;
    }

}
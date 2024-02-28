const Specialism = {
    NONE: "None",
    COMBAT: "Combat",
    STAUNCH: "Staunch",
    MARKSMAN: "Marksman",
    SCOUT: "Scout",
};

const Rank = {
    0: "Adept",
    6: "Veteran",
    16: "Ace",
    31: "Grizzled",
    51: "Revered",
}

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
            equipment = [],
            battleHonour = [],
            battleScars = [],
            specialism = Specialism.NONE,
            experiencePoints = 0
        } = {}
    ) {
        Object.defineProperty(this, "addExperience", { enumerable: false });
        Object.defineProperty(this, "addEquipment", { enumerable: false });
        Object.defineProperty(this, "removeEquipment", { enumerable: false });
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
        this.limitNum = !isNaN(limitNum) && isFinite(limitNum) && limitNum > 0 ? limitNum : 0,
        this.limitTag = Array.isArray(limitTag) ? limitTag.filter(x => typeof x === 'string') : [];
        this.equipment = Array.isArray(equipment) ? equipment.filter(x => x instanceof Equipment) : [];
        this.battleHonour = Array.isArray(battleHonour) ? battleHonour.filter(x => typeof x === 'string') : [];
        this.battleScars = Array.isArray(battleScars) ? battleScars.filter(x => typeof x === 'string') : [];
        this.specialism = Object.values(Specialism).find(x => x === specialism).length ? specialism : Specialism.NONE;
        this.experiencePoints = experiencePoints < 0 ? 0 : experiencePoints;
        this.rank = this.#getRank(experiencePoints);
    }

    #getRank = () => {
        let currentRank = Rank[0];
        for (const rank in Rank) {
            if (this.experiencePoints < rank) break;
            currentRank = Rank[rank];
        }
        return currentRank;
    }

    addExperience = (experience) => {
        this.experiencePoints += experience;
        this.rank = this.#getRank();
        return this.experiencePoints;
    }

    addEquipment = (equipment) => {
        if (equipment instanceof Equipment) this.equipment.push(equipment);
        return this.equipment;
    }

    removeEquipment = (equipment) => {
        if (equipment instanceof Equipment) this.equipment.splice(this.equipment.indexOf(this.equipment.find(x => x.equals(equipment))));
        return this.equipment;
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
                equipment: object.equipment?.map(x => Equipment.parse(x)),
                battleHonour: object.battleHonour,
                battleScars: object.battleScars,
                specialism: object.specialism,
                experiencePoints: object.experiencePoints,
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
        equipment: this.equipment,
        battleHonour: this.battleHonour,
        battleScars: this.battleScars,
        specialism: this.specialism,
        experiencePoints: this.experiencePoints,
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
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

class KillTeam {
    constructor(name = "", faction = "", abilities = [], strategicPloys = [], tacticalPloys = [], psychicPowers = [], fireTeams = []) {
        Object.defineProperty(this, "addOperative", { enumerable: false });
        Object.defineProperty(this, "removeOperative", { enumerable: false });
        Object.defineProperty(this, "toString", { enumerable: false });
        Object.defineProperty(this, "toHTML", { enumerable: false });
        this.name = name && typeof name === 'string' ? name : "";
        this.faction = faction && typeof faction === 'string' ? faction : "";
        this.abilities = Array.isArray(abilities) ? abilities.filter(x => x instanceof Ability) : [];
        this.strategicPloys = Array.isArray(strategicPloys) ? strategicPloys.filter(x => x instanceof Ploy) : [];
        this.tacticalPloys = Array.isArray(tacticalPloys) ? tacticalPloys.filter(x => x instanceof Ploy) : [];
        this.psychicPowers = Array.isArray(psychicPowers) ? psychicPowers.filter(x => x instanceof PsychicPower) : [];
        this.fireTeams = Array.isArray(fireTeams) ? fireTeams.filter(x => x instanceof FireTeam) : [];
    }

    addFireTeam = (fireTeam) => {
        if (fireTeam instanceof FireTeam) this.fireTeams.push(fireTeam);
        return this.fireTeams;
    }
    
    removeFireTeam = (fireTeam) => {
        if (fireTeam instanceof FireTeam) this.fireTeams.splice(this.fireTeams.indexOf(this.fireTeams.find(x => x.equals(fireTeam))), 1);
        return this.fireTeams;
    }

    static parse = (object) => {
        if (!(object instanceof Object)) return undefined;
        return new KillTeam(
            object.name,
            object.faction,
            object.abilities?.map(x => Ability.parse(x)),
            object.strategicPloys?.map(x => Ploy.parse(x)),
            object.tacticalPloys?.map(x => Ploy.parse(x)),
            object.psychicPowers?.map(x => PsychicPower.parse(x)),
            object.fireTeams?.map(x => FireTeam.parse(x)),
        )
    }

    toString = () => JSON.stringify({
        name: this.name,
        faction: this.faction,
        abilities: this.abilities,
        strategicPloy: this.strategicPloys,
        tacticalPloy: this.tacticalPloys,
        psychicPowers: this.psychicPowers,
        fireTeams: this.fireTeams
    });

    toHTML = () => {
        const killTeamElement = document.createElement("div");
        const killTeamName = document.createElement("h1");
        killTeamName.classList.add("title");
        killTeamName.innerText = `${this.name} Kill Team`+(this.faction ? ` (${this.faction})` : "");
        killTeamElement.appendChild(killTeamName);
        const fireTeamsList = document.createElement("div");
        fireTeamsList.classList.add("legend");
        const fireTeamsBlock = document.createElement("div");
        this.fireTeams.forEach(fireTeam => {
            const fireTeamLink = document.createElement("a");
            fireTeamLink.setAttribute("href", `#${new Id(fireTeam.name).key}`);
            fireTeamLink.innerText = `${fireTeam.name} Fire Team`;
            fireTeamsList.appendChild(fireTeamLink);
            fireTeamsBlock.appendChild(fireTeam.toHTML());
        });
        killTeamElement.appendChild(fireTeamsList);
        if (this.abilities) {
            const killTeamAbilities = document.createElement("div");
            const killTeamAbilitiesTitle = document.createElement("h2");
            killTeamAbilitiesTitle.classList.add("title");
            const killTeamAbilitiesSubTitle = document.createElement("div");
            if (this.abilities.length === 1) {
                killTeamAbilitiesTitle.innerText = "ABILITY";
                killTeamAbilitiesSubTitle.innerText = `Below, you will find common abilities of the ${this.name} kill team.`;
            } else {
                killTeamAbilitiesTitle.innerText = "ABILITIES";
                killTeamAbilitiesSubTitle.innerText = `Below, you will find common abilities of the ${this.name} kill team.`;
            }
            killTeamAbilities.appendChild(killTeamAbilitiesTitle);
            killTeamAbilities.appendChild(killTeamAbilitiesSubTitle);
            this.abilities.forEach(ability => {
                killTeamAbilities.appendChild(ability.toHTML(true));
            });
            killTeamElement.appendChild(killTeamAbilities);
        }
        if (this.strategicPloys) {
            const killTeamStrategic = document.createElement("div");
            this.strategicPloys.forEach(ploy => {
                killTeamStrategic.appendChild(ploy.toHTML());
            });
            killTeamElement.appendChild(killTeamStrategic);
        }
        if (this.tacticalPloys) {
            const killTeamTactical = document.createElement("div");
            this.tacticalPloys.forEach(ploy => {
                killTeamTactical.appendChild(ploy.toHTML());
            });
            killTeamElement.appendChild(killTeamTactical);
        }
        if (this.psychicPowers) {
            const killTeamPsychicPowers = document.createElement("div");
            const killTeamPsychicPowersTitle = document.createElement("h2");
            killTeamPsychicPowersTitle.classList.add("title");
            killTeamPsychicPowersTitle.innerText = "PSYCHIC POWERS";
            killTeamPsychicPowers.appendChild(killTeamPsychicPowersTitle);
            const killTeamPsychicPowersSubtitle = document.createElement("div");
            killTeamPsychicPowersSubtitle.innerText = `Each time a friendly ${this.name} operative performs the Manifest Psychic Power action, select one psychic power from the list below to be resolved. You can only select each psychic power a maximum of once per Turning Point.`
            killTeamPsychicPowers.appendChild(killTeamPsychicPowersSubtitle);
            this.psychicPowers.forEach(psychicPower => {
                killTeamPsychicPowers.appendChild(psychicPower.toHTML());
            });
            killTeamElement.appendChild(killTeamPsychicPowers);
        }
        killTeamElement.appendChild(fireTeamsBlock);
        return killTeamElement;
    }
}

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

    toHTML = () => {
        const fireTeamElement = document.createElement("div");
        fireTeamElement.classList.add("kill-team-fire-team");
        fireTeamElement.id = new Id(this.name).key;
        const fireTeamName = document.createElement("h2");
        fireTeamName.classList.add("title");
        fireTeamName.innerText = `${this.name} Fire Team`;
        fireTeamElement.appendChild(fireTeamName);
        const operativeList = document.createElement("div");
        operativeList.classList.add("legend");
        const operativeBlock = document.createElement("div");
        operativeBlock.classList.add("datasheet");
        this.operatives.forEach(operative => {
            const operativeLink = document.createElement("a");
            operativeLink.setAttribute("href", `#${new Id(operative.name).key}`);
            operativeLink.innerText = operative.name;
            operativeList.appendChild(operativeLink);
            operativeBlock.appendChild(operative.toHTML());
        });
        fireTeamElement.appendChild(operativeList);
        fireTeamElement.appendChild(operativeBlock);
        return fireTeamElement;
    }
}

class Operative {
    constructor(
        name = "",
        stats = [],
        weapons = [],
        abilities = [],
        actions = [],
        {
            unique = false,
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
        this.stats = Array.isArray(stats) && stats.length === 6 ? stats : [];
        this.abilities = Array.isArray(abilities) ? abilities.filter(x => x instanceof Ability) : [];
        this.actions = Array.isArray(actions) ? actions.filter(x => x instanceof Action) : [];
        this.weapons = Array.isArray(weapons) ? weapons.filter(x => x instanceof Weapon) : [];
        this.unique = typeof unique === 'boolean' ? unique : false;
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
                unique: object.unique,
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
        unique: this.unique,
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
            tableCell.innerText = i === 4 ? `${stat}+` : stat;
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
        const ployElementHeader = document.createElement("header");
        const ployElementName = document.createElement("span");
        ployElementName.innerText = this.name;
        const ployElementCost = document.createElement("span");
        ployElementCost.innerText = `${this.cost}CP`;
        ployElementHeader.appendChild(ployElementName);
        ployElementHeader.appendChild(ployElementCost);
        ployElement.appendChild(ployElementHeader);
        const ployElementType = document.createElement("div");
        ployElementType.innerText = "Strategic / Tactical";
        ployElement.appendChild(ployElementType);
        const ployElementContent = document.createElement("div");
        this.description.forEach((row, i) => {
            if (i > 0) ployElementContent.appendChild(document.createElement("br"));
            ployElementContent.appendChild(replaceMarkup(row));
        })
        ployElement.appendChild(ployElementContent);
        return ployElement;
    }
}

class Ability {
    constructor(name, description = [], table = null) {
        Object.defineProperty(this, "toString", { enumrable: false });
        Object.defineProperty(this, "equals", { enumrable: false });
        Object.defineProperty(this, "toHTML", { enumerable: false });
        this.name = name && typeof name === 'string' ? name : "";
        if (!Array.isArray(description)) description = [description];
        this.description = description.filter(x => typeof x === 'string');
        this.table = table;
    }

    static parse = (object) => {
        if (!(object instanceof Object)) return undefined;
        return new Ability(
            object.name,
            object.description,
            object.table,
        );
    }

    toString = () => JSON.stringify({
        name: this.name,
        description: this.description,
        table: this.table,
    });

    equals = (ability) => {
        if (!(ability instanceof Ability)) ability = Ability.parse(ability);
        return this.toString() === ability.toString();
    }

    toHTML = (headedTitle = false) => {
        const abilityElement = document.createElement("div");
        abilityElement.classList.add("kill-team-ability");
        if (headedTitle) {
            const abilityName = document.createElement("h3");
            abilityName.classList.add("title");
            abilityName.innerText = this.name;
            abilityElement.appendChild(abilityName);
            const abilityDescription = document.createElement("div");
            this.description.forEach((row, i) => {
                if (i > 0) abilityDescription.appendChild(document.createElement("br"));
                abilityDescription.appendChild(replaceMarkup(row));
            });
            abilityElement.appendChild(abilityDescription);
            if (this.table) {
                const abilityTable = document.createElement("table");
                abilityTable.classList.add("ability-table");
                const abilityTableHeader = document.createElement("thead");
                const abilityTableContent = document.createElement("tbody");
                let rowElement;
                let cellElement;
                this.table.rows.forEach((row, i) => {
                    rowElement = document.createElement("tr");
                    row.cells.forEach(cell => {
                        cellElement = document.createElement(i === 0 ? "th" : "td");
                        cellElement.appendChild(replaceMarkup(cell));
                        rowElement.appendChild(cellElement);
                    });
                    if (i === 0) abilityTableHeader.appendChild(rowElement);
                    else abilityTableContent.appendChild(rowElement);
                });
                abilityTable.appendChild(abilityTableHeader);
                abilityTable.appendChild(abilityTableContent);
                abilityElement.appendChild(abilityTable);
            }
        } else {
            const abilityName = document.createElement("b");
            abilityName.innerText = this.description.length ? `${this.name}: ` : this.name;
            abilityElement.appendChild(abilityName);
            this.description.forEach((row, i) => {
                if (i > 0) abilityElement.appendChild(document.createElement("br"));
                abilityElement.appendChild(replaceMarkup(row));
            });
        }
        
        return abilityElement;
    }
}

class Action {
    constructor(name, cost = 1, description = []) {
        Object.defineProperty(this, "toString", { enumrable: false });
        Object.defineProperty(this, "equals", { enumrable: false });
        Object.defineProperty(this, "toHTML", { enumerable: false });
        cost = parseInt(cost);
        this.name = name && typeof name === 'string' ? name : "";
        this.cost = !isNaN(cost) && isFinite(cost) && cost >= 0 ? cost : 1;
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
        return this.toString() === action.toString();
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

class PsychicPower {
    constructor(name, description = [], { weapons = [] } = {}) {
        Object.defineProperty(this, "toString", { enumerable: false });
        Object.defineProperty(this, "equals", { enumerable: false });
        Object.defineProperty(this, "toHTML", { enumerable: false });
        this.name = name && typeof name === 'string' ? name : "";
        this.description = Array.isArray(description) ? description.filter(x => typeof x === 'string') : [];
        this.weapons = Array.isArray(weapons) ? weapons.filter(x => x instanceof Weapon) : [];
    }

    static parse = (object) => {
        if (!(object instanceof Object)) return undefined;
        return new PsychicPower(
            object.name,
            object.description,
            {
                weapons: object.weapons?.map(x => Weapon.parse(x)),
            }
        );
    }
    
    toString = () => JSON.stringify({
        name: this.name,
        description: this.description,
        weapons: this.weapons,
    });

    equals = (psychicPower) => {
        if (!(psychicPower instanceof PsychicPower)) psychicPower = PsychicPower.parse(psychicPower);
        return this.toString() === psychicPower.toString();
    }

    toHTML = () => {
        const psychicPowerElement = document.createElement("div");
        psychicPowerElement.classList.add("kill-team-psychic-power");
        const psychicPowerTitle = document.createElement("header");
        const psychicPowerName = document.createElement("span");
        const psychicPowerContent = document.createElement("div");
        psychicPowerName.innerText = this.name;
        psychicPowerTitle.appendChild(psychicPowerName);
        psychicPowerElement.appendChild(psychicPowerTitle);
        this.description.forEach((row, i) => {
            if (i > 0) psychicPowerContent.appendChild(document.createElement("br"));
            psychicPowerContent.appendChild(replaceMarkup(row));
        });
        this.weapons.forEach(weapon => {
            psychicPowerContent.appendChild(weapon.toHTML({tableWrapper: true}));
        });
        psychicPowerElement.appendChild(psychicPowerContent);
        return psychicPowerElement;
    }

}

class Equipment {
    constructor(name, rare = false, value = [], limit = false, dedicated = null, description = [], { ability = null, action = null, weapon = null } = {}) {
        Object.defineProperty(this, "toString", { enumerable: false });
        Object.defineProperty(this, "equals", { enumerable: false });
        Object.defineProperty(this, "toHTML", { enumerable: false });
        this.name = name && typeof name === 'string' ? name : "";
        this.rare = typeof rare === 'boolean' ? rare : false;
        this.value = Array.isArray(value) ? value.filter(x => typeof x === 'number' && isFinite(x) && x >= 0) : [];
        this.limit = typeof limit === 'boolean' ? limit : false;
        this.dedicated = dedicated instanceof Id ? dedicated.key : null;
        this.description = Array.isArray(description) ? description.filter(x => typeof x === 'string') : [];
        this.ability = ability instanceof Ability ? ability : null;
        this.action = action instanceof Action ? action : null;
        this.weapon = weapon instanceof Weapon ? weapon : null;
    }

    static parse = (object) => {
        if (!(object instanceof Object)) return undefined;
        return new Equipment(
            object.name,
            object.rare,
            object.value,
            object.limit,
            object.dedicated ? new Id(object.dedicated) : null,
            object.description,
            {
                ability: object.ability ? Ability.parse(object.ability) : null,
                action: object.action ? Action.parse(object.action) : null,
                weapon: object.weapon ? Weapon.parse(object.weapon) : null,
            }
        );
    }

    toString = () => JSON.stringify({
        name: this.name,
        rare: this.rare,
        value: this.value,
        limit: this.limit,
        dedicated: this.dedicated,
        description: this.description,
        ability: this.ability,
        action: this.action,
        weapon: this.weapon,
    });

    equals = (equipment) => {
        if (!(equipment instanceof Equipment)) equipment = Equipment.parse(equipment);
        return this.toString() === equipment.toString();
    }

    toHTML = () => {
        const itemElement = document.createElement("div");
        itemElement.classList.add("kill-team-item");
        itemElement.id = new Id(this.name, "equipment").key;
        if (this.dedicated) itemElement.setAttribute("for", new Id(this.dedicated).key);
        const itemHeader = document.createElement("header");
        const itemName = document.createElement("div");
        itemName.classList.add("title");
        itemName.innerText = this.name;
        if (this.limit) {
            const limitElement = document.createElement("sup");
            limitElement.innerText = "+";
            itemName.appendChild(limitElement);
        }
        itemName.appendChild(document.createTextNode(` [${this.value.join("/")}EP]`))
        itemHeader.appendChild(itemName);
        itemElement.appendChild(itemHeader);
        if (this.description) {
            const descriptionElement = document.createElement("div");
            this.description.forEach(row => {
                descriptionElement.appendChild(replaceMarkup(row));
            });
            itemElement.appendChild(descriptionElement);
        }
        if (this.ability) itemElement.appendChild(this.ability.toHTML());
        if (this.action) itemElement.appendChild(this.action.toHTML());
        if (this.weapon) itemElement.appendChild(this.weapon.toHTML({ tableWrapper: true }));
        return itemElement;
    }
}

class Weapon {
    constructor(name, type, profiles = []) {
        Object.defineProperty(this, "toString", { enumerable: false });
        Object.defineProperty(this, "equals", { enumerable: false });
        Object.defineProperty(this, "toHTML", { enumerable: false });
        this.name = name && typeof name === 'string' ? name : "";
        this.type = type && typeof type === 'string' ? type : "";
        this.profiles = Array.isArray(profiles) ? profiles.filter(x => x instanceof WeaponProfile) : [];
    }

    static get tableHTMLWrapper() {
        const table = document.createElement("table");
        table.classList.add("kill-team-weaponList");
        return table;
    }

    static get tableHTMLHeader() {
        const tableHead = document.createElement("thead");
        const tableRow = document.createElement("tr");
        let tableCell;
        let tableCellText;
        ["", "Name", "A", "BS/WS", "D", "Special Rules", "!"].forEach(column => {
            tableCell = document.createElement("th");
            tableCellText = document.createElement("div");
            tableCellText.innerText = column;
            tableCell.appendChild(tableCellText);
            tableRow.appendChild(tableCell);
        });
        tableHead.appendChild(tableRow);
        return tableHead;
    }

    static parse = (object) => {
        if (!(object instanceof Object)) return undefined;
        return new Weapon(
            object.name,
            object.type,
            object.profiles?.map(x => WeaponProfile.parse(x)),
        );
    }

    toString = () => JSON.stringify({
        name: this.name,
        type: this.type,
        profiles: this.profiles,
    });

    equals = (weapon) => {
        if (!(weapon instanceof Weapon)) weapon = Weapon.parse(weapon);
        return this.toString() === weapon.toString();
    }

    toHTML = ({ tableWrapper = false } = {}) => {
        const tableBody = document.createElement("tbody");
        let tableRow;
        if (this.profiles.length) {
            tableRow = this.profiles[0].toHTML(this.name, this.type, this.profiles.length > 1);
            tableBody.appendChild(tableRow);
            if (this.profiles.length > 1) {
                this.profiles.forEach(profile => {
                    tableBody.appendChild(profile.toHTML());
                });
            }
        }
        if (tableWrapper) {
            const table = Weapon.tableHTMLWrapper;
            table.appendChild(Weapon.tableHTMLHeader);
            table.appendChild(tableBody);
            return table;
        } else {
            return tableBody;
        }
    }
}

class WeaponProfile {
    constructor(
        name = "",
        attacks = 1,
        skill = 6,
        damageNorm = 1,
        damageCrit = 1,
        range = Infinity,
        {
            specialRules = [],
            criticalEffects = [],
        } = {}
    ) {
        Object.defineProperty(this, "toString", { enumerable: false });
        Object.defineProperty(this, "equals", { enumerable: false });
        Object.defineProperty(this, "toHTML", { enumerable: false });
        attacks = parseInt(attacks);
        skill = parseInt(skill);
        damageNorm = parseInt(damageNorm);
        damageCrit = parseInt(damageCrit);
        range = parseInt(range);
        this.name = name && typeof name === 'string' ? name : "";
        this.attacks = !isNaN(attacks) && isFinite(attacks) && attacks > 0 ? attacks : 1;
        this.skill = !isNaN(skill) && skill > 1 && skill <= 6 ? skill : 6;
        this.damageNorm = !isNaN(damageNorm) && isFinite(damageNorm) && damageNorm >= 0 ? damageNorm : 0;
        this.damageCrit = !isNaN(damageCrit) && isFinite(damageCrit) && damageCrit >= 0 ? damageCrit : 0;
        this.range = !isNaN(range) && range > 0 ? range : Infinity;
        this.specialRules = Array.isArray(specialRules) ? specialRules.filter(x => typeof x === 'string') : [];
        this.criticalEffects = Array.isArray(criticalEffects) ? criticalEffects.filter(x => typeof x === 'string') : [];
    }

    get specialRulesFull() {
        const temp = [];
        if (isFinite(this.range)) temp.push(`Rng ((${this.range}))`);
        return temp.concat(this.specialRules);
    }

    static parse = (object) => {
        if (!(object instanceof Object)) return undefined;
        return new WeaponProfile(
            object.name,
            object.attacks,
            object.skill,
            object.damageNorm,
            object.damageCrit,
            object.range,
            {
                specialRules: object.specialRules,
                criticalEffects: object.criticalEffects,
            }
        );
    }

    toString = () => JSON.stringify({
        name: this.name,
        attacks: this.attacks,
        skill: this.skill,
        damageNorm: this.damageNorm,
        damageCrit: this.damageCrit,
        range: this.range,
        specialRules: this.specialRules,
        criticalEffects: this.criticalEffects,
    });

    equals = (profile) => {
        if (!(profile instanceof WeaponProfile)) profile = WeaponProfile.parse(profile);
        return this.toString() === profile.toString();
    }

    toHTML = (name = null, type = null, profileHeader = false) => {
        let tableCell;
        const tableRow = document.createElement("tr");
        tableCell = document.createElement("td");
        if (type) tableCell.appendChild(replaceMarkup(type));
        tableRow.appendChild(tableCell);
        tableCell = document.createElement("td");
        tableCell.innerText = name && typeof name === 'string' ? name : `- ${this.name}`;
        tableRow.appendChild(tableCell);
        if (profileHeader) {
            tableCell = document.createElement("td");
            tableCell.setAttribute("colspan", 5);
            const italic = document.createElement("i");
            italic.innerText = "Each time this weapon is selected to make a shooting attack with, select one of the profiles below to use:";
            tableCell.appendChild(italic);
            tableRow.appendChild(tableCell);
        } else {
            tableCell = document.createElement("td");
            tableCell.innerText = this.attacks;
            tableRow.appendChild(tableCell);
            tableCell = document.createElement("td");
            tableCell.innerText = `${this.skill}+`;
            tableRow.appendChild(tableCell);
            tableCell = document.createElement("td");
            tableCell.innerText = `${this.damageNorm}/${this.damageCrit}`;
            tableRow.appendChild(tableCell);
            tableCell = document.createElement("td");
            if (this.specialRulesFull.length) {
                this.specialRulesFull.forEach((x, i) => {
                    if (i > 0) tableCell.appendChild(document.createTextNode(", "));
                    tableCell.appendChild(replaceMarkup(x));
                });
            }
            else tableCell.innerText = "-";
            tableRow.appendChild(tableCell);
            tableCell = document.createElement("td");
            if (this.criticalEffects.length) {
                this.criticalEffects.forEach((x, i) => {
                    if (i > 0) tableCell.appendChild(document.createTextNode(", "));
                    tableCell.appendChild(replaceMarkup(x));
                });
            }
            else tableCell.innerText = "-";
        }
        tableRow.appendChild(tableCell);
        return tableRow;
    }
}
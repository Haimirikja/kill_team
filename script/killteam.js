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
    constructor(name = "", faction = "", operatives = []) {
        Object.defineProperty(this, "addOperative", { enumerable: false });
        Object.defineProperty(this, "removeOperative", { enumerable: false });
        this.name = name;
        this.faction = faction;
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
}

class Operative {
    constructor(
        name = "",
        stats = [],
        weapons = [],
        abilities = [],
        actions = [],
        {
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
        this.name = typeof name === 'string' ? name : "";
        this.stats = Array.isArray(stats) && stats.length === 6 ? stats : [];
        this.abilities = Array.isArray(abilities) ? abilities.filter(x => x instanceof Ability) : [];
        this.actions = Array.isArray(actions) ? actions.filter(x => x instanceof Action) : [];
        this.weapons = Array.isArray(weapons) ? weapons.filter(x => x instanceof Weapon) : [];
        this.equipment = Array.isArray(equipment) ? equipment.filter(x => x instanceof Equipment) : [];
        this.battleHonour = Array.isArray(battleHonour) ? battleHonour.filter(x => typeof x === 'string') : [];
        this.battleScars = Array.isArray(battleScars) ? battleScars.filter(x => typeof x === 'string') : [];
        this.specialism = typeof specialism === 'string' ? specialism : Specialism.NONE;
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
                equipment: object.equipment?.map(x => Equipment.parse(x)),
                battleHonour: object.battleHonour,
                battleScars: object.battleScars,
                specialism: object.specialism,
                experiencePoints: object.experiencePoints
            }
        );
    }

    toString = () => JSON.stringify({
        name: this.name,
        stats: this.stats,
        weapons: this.weapons,
        abilities: this.abilities,
        actions: this.actions,
        equipment: this.equipment,
        battleHonour: this.battleHonour,
        battleScars: this.battleScars,
        specialism: this.specialism,
        experiencePoints: this.experiencePoints
    });

    equals = (operative) => {
        if (!(operative instanceof Operative)) operative = Operative.parse(operative);
        return this.toString() === operative.toString();
    }

    toHTML = (id) => {
        const operativeElement = document.createElement("div");
        operativeElement.classList.add("kill-team-operative");
        if (id instanceof Id) operativeElement.id = id.key;
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
            console.log(action);
            blockContent.appendChild(action.toHTML());
        });
        blockElement.appendChild(blockContent);
        operativeInfo.appendChild(blockElement);
        operativeElement.appendChild(operativeInfo);
        return operativeElement;
    }

}

class Ability {
    constructor(name, description = []) {
        Object.defineProperty(this, "toString", { enumrable: false });
        Object.defineProperty(this, "equals", { enumrable: false });
        Object.defineProperty(this, "toHTML", { enumerable: false });
        this.name = typeof name === 'string' ? name : "";
        if (!Array.isArray(description)) description = [description];
        this.description = description.filter(x => typeof x === 'string');
    }

    static parse = (object) => {
        if (!(object instanceof Object)) return undefined;
        return new Ability(
            object.name,
            object.description
        );
    }

    toString = () => JSON.stringify({
        name: this.name,
        description: this.description
    });

    equals = (ability) => {
        if (!(ability instanceof Ability)) ability = Ability.parse(ability);
        return this.toString() === ability.toString();
    }

    toHTML = () => {
        const abilityElement = document.createElement("div");
        abilityElement.classList.add("kill-team-ability");
        const abilityName = document.createElement("b");
        abilityName.innerText = this.description.length ? `${this.name}: ` : this.name;
        abilityElement.appendChild(abilityName);
        this.description.forEach((row, i) => {
            if (i > 0) abilityElement.appendChild(document.createElement("br"));
            abilityElement.appendChild(replaceMarkup(row));
        });
        return abilityElement;
    }
}

class Action {
    constructor(name, cost = 1, description = []) {
        Object.defineProperty(this, "toString", { enumrable: false });
        Object.defineProperty(this, "equals", { enumrable: false });
        Object.defineProperty(this, "toHTML", { enumerable: false });
        cost = parseInt(cost);
        this.name = typeof name === 'string' ? name : "";
        this.cost = !isNaN(cost) && isFinite(cost) && cost >= 0 ? cost : 1;
        if (!Array.isArray(description)) description = [description];
        this.description = description.filter(x => typeof x === 'string');
    }

    static parse = (object) => {
        if (!(object instanceof Object)) return undefined;
        return new Action(
            object.name,
            object.cost,
            object.description
        );
    }

    toString = () => JSON.stringify({
        name: this.name,
        cost: this.cost,
        description: this.description
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

class Equipment {
    constructor(name, rare = false, value = [], limit = false, dedicated = null, description = [], { ability = null, action = null, weapon = null } = {}) {
        Object.defineProperty(this, "toString", { enumerable: false });
        Object.defineProperty(this, "equals", { enumerable: false });
        Object.defineProperty(this, "toHTML", { enumerable: false });
        this.name = typeof name === 'string' ? name : "";
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
                weapon: object.weapon ? Weapon.parse(object.weapon) : null
            }
        );
    }

    toString = () => {
        return JSON.stringify({
            name: this.name,
            rare: this.rare,
            value: this.value,
            limit: this.limit,
            dedicated: this.dedicated,
            description: this.description,
            ability: this.ability,
            action: this.action,
            weapon: this.weapon
        });
    }

    equals = (equipment) => {
        if (!(equipment instanceof Equipment)) equipment = Equipment.parse(equipment);
        return this.toString() === equipment.toString();
    }

    toHTML = (id) => {
        const itemElement = document.createElement("div");
        itemElement.classList.add("kill-team-item");
        if (id instanceof Id) itemElement.id = id.key;
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
        this.name = typeof name === 'string' ? name : "";
        this.type = typeof type === 'string' ? type : "";
        this.profiles = Array.isArray(profiles) ? profiles.filter(x => x instanceof WeaponProfile) : [];
    }

    static parse = (object) => {
        if (!(object instanceof Object)) return undefined;
        return new Weapon(
            object.name,
            object.type,
            object.profiles?.map(x => WeaponProfile.parse(x))
        );
    }

    static get tableHTMLWrapper() {
        //const weaponElement = document.createElement("div");
        const table = document.createElement("table");
        table.classList.add("kill-team-weaponList");
        //weaponElement.appendChild(table);
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
        damageNorm = 0,
        damageCrit = 0,
        specialRules = [],
        criticalEffects = [],
        {
            range = Infinity,
            ap = null,
            blast = null,
            torrent = null,
            lethal = null
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
        ap = parseInt(ap);
        blast = parseInt(blast);
        torrent = parseInt(torrent);
        lethal = parseInt(lethal);
        this.name = typeof name === 'string' ? name : "";
        this.attacks = !isNaN(attacks) && isFinite(attacks) && attacks > 0 ? attacks : 1;
        this.skill = !isNaN(skill) && skill > 1 && skill <= 6 ? skill : 6;
        this.damageNorm = !isNaN(damageNorm) && isFinite(damageNorm) && damageNorm >= 0 ? damageNorm : 0;
        this.damageCrit = !isNaN(damageCrit) && isFinite(damageCrit) && damageCrit >= 0 ? damageCrit : 0;
        this.specialRules = Array.isArray(specialRules) ? specialRules.filter(x => typeof x === 'string') : [];
        this.criticalEffects = Array.isArray(criticalEffects) ? criticalEffects.filter(x => typeof x === 'string') : [];
        this.range = !isNaN(range) && range > 0 ? range : Infinity;
        this.ap = !isNaN(ap) && isFinite(ap) && ap > 0 ? ap : null;
        this.blast = !isNaN(blast) && isFinite(blast) && blast > 0 ? blast : null;
        this.torrent = !isNaN(torrent) && isFinite(torrent) && torrent > 0 ? torrent : null;
        this.lethal = !isNaN(lethal) && isFinite(lethal) && lethal < 6 && lethal > 1 ? lethal : null;
    }

    get specialRulesFull() {
        const temp = [];
        if (isFinite(this.range)) temp.push(`Rng ((${this.range}))`);
        if (this.ap) temp.push(`AP${this.ap}`);
        if (this.blast) temp.push(`Blast ((${this.blast}))`);
        if (this.torrent) temp.push(`Torrent ((${this.torrent}))`);
        if (this.lethal) temp.push(`Lethal ${this.lethal}+`);
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
            object.specialRules,
            object.criticalEffects,
            {
                range: object.range,
                ap: object.ap,
                blast: object.blast,
                torrent: object.torrent,
                lethal: object.lethal
            }
        );
    }

    toString = () => {
        return JSON.stringify({
            name: this.name,
            attacks: this.attacks,
            skill: this.skill,
            damageNorm: this.damageNorm,
            damageCrit: this.damageCrit,
            specialRules: this.specialRules,
            criticalEffects: this.criticalEffects,
            range: this.range,
            ap: this.ap,
            blast: this.blast,
            torrent: this.torrent,
            lethal: this.lethal
        });
    }

    equals = (profile) => {
        if (!(profile instanceof WeaponProfile)) profile = WeaponProfile.parse(profile);
        return this.toString() === profile.toString();
    }

    toHTML = (name = null, type = null, profileHeader = false) => {
        let tableCell;
        const tableRow = document.createElement("tr");
        tableCell = document.createElement("td");
        tableCell.appendChild(replaceMarkup(type));
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

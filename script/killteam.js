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
        this.name = typeof name === 'string' ? name : "";
        this.stats = Array.isArray(stats) ? stats : [];
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

}

class Ability {
    constructor(name, description) {
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
        abilityElement.classList.add("ability");
        const abilityName = document.createElement("b");
        abilityName.innerText = this.description.length ? `${this.name}: ` : this.name;
        abilityElement.appendChild(abilityName);
        const abilityDescription = document.createElement("span");
        this.description.forEach((row, i) => {
            if (i > 0) abilityDescription.appendChild(document.createElement("br"));
            const rowElement = document.createElement("span");
            rowElement.innerText = row;
            abilityDescription.appendChild(rowElement);
        });
        abilityElement.appendChild(abilityDescription);
        return abilityElement;
    }
}

class Action {
    constructor(name, cost, description) {
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
            object.description
        );
    }

    toString = () => JSON.stringify({
        name: this.name,
        description: this.description
    });

    equals = (action) => {
        if (!(action instanceof Action)) action = Ability.parse(action);
        return this.toString() === action.toString();
    }

    toHTML = () => {
        const actionElement = document.createElement("div");
        actionElement.classList.add("action");
        const actionName = document.createElement("b");
        actionName.innerText = `${this.name} (${this.cost}AP)${this.description.length ? ": " : ""}`;
        actionElement.appendChild(actionName);
        const actionDescription = document.createElement("span");
        this.description.forEach((row, i) => {
            if (i > 0) actionDescription.appendChild(document.createElement("br"));
            const rowElement = document.createElement("span");
            rowElement.innerText = row;
            actionDescription.appendChild(rowElement);
        });
        actionElement.appendChild(actionDescription);
        return actionElement;
    }
}

class Equipment {
    constructor(name, description = []) {
        Object.defineProperty(this, "toString", { enumerable: false });
        Object.defineProperty(this, "equals", { enumerable: false });
        this.name = typeof name === 'string' ? name : "";
        this.description = Array.isArray(description) ? description.filter(x => typeof x === 'string') : [];
    }

    static parse = (object) => {
        if (!(object instanceof Object)) return undefined;
        return new Equipment(
            object.name,
            object.description
        );
    }

    toString = () => {
        return JSON.stringify({
            name: this.name,
            description: this.description
        });
    }

    equals = (equipment) => {
        if (!(equipment instanceof Equipment)) equipment = Equipment.parse(equipment);
        return this.toString() === equipment.toString();
    }
}

class Weapon extends Equipment {
    constructor(name, type, profiles = []) {
        super(name);
        Object.defineProperty(this, "toHTML", { enumerable: false });
        this.type = type;
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

    toHTML = () => {
        const weaponElement = document.createElement("div");
        const table = document.createElement("table");
        table.classList.add("weaponList");
        let tableRow;
        let tableHead;
        let tableHeadText;
        tableRow = document.createElement("tr");
        ["", "Name", "A", "BS/WS", "D", "Special Rules", "!"].forEach(column => {
            tableHead = document.createElement("th");
            tableHeadText = document.createElement("div");
            tableHeadText.innerText = column;
            tableHead.appendChild(tableHeadText);
            tableRow.appendChild(tableHead);
        });
        table.appendChild(tableRow);
        if (this.profiles.length) {
            tableRow = this.profiles[0].toHTML(this.name, this.type, this.profiles.length > 1);
            table.appendChild(tableRow);
            if (this.profiles.length > 1) {
                this.profiles.forEach(profile => {
                    table.appendChild(profile.toHTML());
                });
            }
        }
        weaponElement.appendChild(table);
        return table;
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
        console.log(this);
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
        tableCell.innerText = type && typeof type === 'string' ? type : "";
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
            if (this.specialRulesFull) tableCell.innerText = this.specialRulesFull.join(", ");
            else tableCell.innerText = "-";
            tableRow.appendChild(tableCell);
            tableCell = document.createElement("td");
            if (this.criticalEffects) tableCell.innerText = this.criticalEffects.join(", ");
            else tableCell.innerText = "-";
        }
        tableRow.appendChild(tableCell);
        return tableRow;
    }
}

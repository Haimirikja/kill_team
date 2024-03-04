
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
        table.classList.add("kill-team-weapons");
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
        this.attacks = isFinitePositive(attacks) ? attacks : 1;
        this.skill = !isNaN(skill) && skill > 1 && skill <= 6 ? skill : 6;
        this.damageNorm = isFinitePositive(damageNorm) ? damageNorm : 0;
        this.damageCrit = isFinitePositive(damageCrit) ? damageCrit : 0;
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
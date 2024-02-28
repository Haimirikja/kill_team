
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

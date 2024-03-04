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

class Datacard {
    constructor(
        operative,
        type = "",
        restedTally = 0,
        equipment = [],
        battleHonour = [],
        battleScars = [],
        specialism = Specialism.NONE,
        experiencePoints = 0
    ) {
        Object.defineProperty(this, "addExperience", { enumerable: false });
        Object.defineProperty(this, "addEquipment", { enumerable: false });
        Object.defineProperty(this, "removeEquipment", { enumerable: false });
        Object.defineProperty(this, "toString", { enumerable: false });
        this.operative = operative instanceof Operative ? operative : null;
        this.type = typeof type === 'string' ? type : "";
        this.restedTally = isFinitePositive(restedTally) ? restedTally : 0;
        this.equipment = Array.isArray(equipment) ? equipment.filter(x => x instanceof Equipment) : [];
        this.battleHonour = Array.isArray(battleHonour) ? battleHonour.filter(x => typeof x === 'string') : [];
        this.battleScars = Array.isArray(battleScars) ? battleScars.filter(x => typeof x === 'string') : [];
        this.specialism = Object.values(Specialism).find(x => x === specialism).length ? specialism : Specialism.NONE;
        this.experiencePoints = isFinitePositive(experiencePoints) ? experiencePoints : 0;
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
        if (object instanceof Object) return undefined;
        return new Datacard(
            Operative.parse(object.operative),
            object.type,
            object.restedTally,
            object.equipment?.map(x => Equipment.parse(x)),
            object.battleHonour,
            object.battleScars,
            object.specialism,
            object.experiencePoints,
        )
    }

    toString = () => JSON.stringify({
        operative: this.operative,
        type: this.type,
        restedTally: this.restedTally,
        equipment: this.equipment,
        battleHonour: this.battleHonour,
        battleScars: this.battleScars,
        specialism: this.specialism,
        experiencePoints: this.experiencePoints,
    })
    
}
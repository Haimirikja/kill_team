class Asset {
    constructor(name = "", description = [], { weapons = [] }) {
        Object.defineProperty(this, "toString", { enumerable: false });
        Object.defineProperty(this, "toHTML", { enumerable: false });
        this.name = typeof name === 'string' ? name : "";
        this.description = Array.isArray(description) ? description.filter(x => typeof x === 'string') : [];
        this.weapons = Array.isArray(weapons) ? weapons.filter(x => x instanceof Weapon) : [];
    }

    static parse = (object) => {
        if (!(object instanceof Object)) return undefined;
        return new Asset(
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

    equals = (asset) => {
        if (!(asset instanceof Asset)) asset = Asset.parse(asset);
        return asset && asset.toString() === this.toString();
    }

    toHTML = () => {
        const assetElement = document.createElement("div");
        return assetElement;
    }

}
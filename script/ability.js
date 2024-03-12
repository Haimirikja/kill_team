
class Ability {
    constructor(name, description = [], table = null, effects = []) {
        Object.defineProperty(this, "toString", { enumrable: false });
        Object.defineProperty(this, "equals", { enumrable: false });
        Object.defineProperty(this, "toHTML", { enumerable: false });
        this.name = name && typeof name === 'string' ? name : "";
        if (!Array.isArray(description)) description = [description];
        this.description = description.filter(x => typeof x === 'string');
        this.table = table instanceof Table ? table : null;
        this.effects = Array.isArray(effects) ? effects.filter(x => x instanceof Ploy) : [];
    }

    static parse = (object) => {
        if (!(object instanceof Object)) return undefined;
        return new Ability(
            object.name,
            object.description,
            Table.parse(object.table),
            object.effects?.map(x => x = Ploy.parse(x))
        );
    }

    toString = () => JSON.stringify({
        name: this.name,
        description: this.description,
        table: this.table,
        effects: this.effects,
    });

    equals = (ability) => {
        if (!(ability instanceof Ability)) ability = Ability.parse(ability);
        return ability && ability.toString() === this.toString();
    }

    toHTML = ({ headedTitle = false } = {}) => {
        const abilityElement = document.createElement("div");
        abilityElement.classList.add("ability");
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
                        cellElement.appendChild(replaceMarkup(cell.text));
                        rowElement.appendChild(cellElement);
                    });
                    if (i === 0) abilityTableHeader.appendChild(rowElement);
                    else abilityTableContent.appendChild(rowElement);
                });
                abilityTable.appendChild(abilityTableHeader);
                abilityTable.appendChild(abilityTableContent);
                abilityElement.appendChild(abilityTable);
            }
            if (this.effects.length) {
                this.effects.forEach(effect => {
                    abilityElement.appendChild(effect.toHTML());
                })
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

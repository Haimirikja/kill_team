class BattleManager {
    #RegisteredKillTeams = [
        { id: "corsair_voidscarred", debugRef: CORSAIR_VOIDSCARRED, fileName: "corsair_voidscarred.json" },
        { id: "craftworld", debugRef: CRAFTWORLD, fileName: "craftworld.json" },
        { id: "exaction_squad", debugRef: EXACTION_SQUAD, fileName: "exaction_squad.json" },
        { id: "veteran_guardsman", debugRef: VETERAN_GUARDSMAN, fileName: "veteran_guardsman.json" },
        { id: "void-dancer_troupe", debugRef: VOID_DANCER_TROUPE, fileName: "void-dancer_troupe.json" },
        { id: "wyrmblade", debugRef: WYRMBLADE, fileName: "wyrmblade.json" },
    ];
    
    #BattleManagerIdRef = {
        id: "BattleManagerArea",
        changeKillTeam: "KillTeamSelect",
        CommandPoints: {
            id: "CommandPointsList",
            add: "CommandPointAdd",
            remove: "CommandPointRemove",
        },
        VictoryPoints: {
            id: "VictoryPointsList",
            add: "VictoryPointAdd",
            remove: "VictoryPointRemove",
        },
        Dataslate: {
            id: "Dataslate",
            name: "DS_Name",
            killTeam: "DS_KillTeam",
            requisitionPoints: "DS_RP",
            assetCapacity: "DS_AssetCapacity",
            specOpsLog: "DS_SpecOpsLog",
            stash: "DS_Stash",
            assets: "DS_Assets",
            datacards: "DS_Datacards",
            change: "DS_Update",
        }
    }

    constructor() {
        document.getElementById(this.#BattleManagerIdRef.changeKillTeam).addEventListener('change', (e) => this.load(e.currentTarget.value));
        document.getElementById(this.#BattleManagerIdRef.CommandPoints.add).addEventListener('click', this.addCommandPoint);
        document.getElementById(this.#BattleManagerIdRef.CommandPoints.remove).addEventListener('click', this.removeCommandPoint);
        document.getElementById(this.#BattleManagerIdRef.VictoryPoints.add).addEventListener('click', this.addVictoryPoint);
        document.getElementById(this.#BattleManagerIdRef.VictoryPoints.remove).addEventListener('click', this.removeVictoryPoint);
        this.load();
    }

    #reset = () => {
        this.commandPoints = 3;
        this.victoryPoints = 0;
        this.killTeam = null;
        this.faction = null;
        this.dataslate = null;
        document.getElementById(this.#BattleManagerIdRef.id).removeAttribute("for");
        document.getElementById("Content").innerHTML = "";
    }
    
    load = (id) => {
        this.#reset();
        this.killTeam = typeof id !== 'undefined' && typeof id === 'string' ? id : null;
        if (!localStorage) return;
        const storage = JSON.parse(localStorage.getItem("BattleManager") ?? null);
        const lastKillTeam = storage?.find(x => this.killTeam ? x.killTeam === this.killTeam : x.isActive);
        if (lastKillTeam) {
            const commandPoints = parseInt(lastKillTeam.commandPoints);
            const victoryPoints = parseInt(lastKillTeam.victoryPoints);
            if (isFinitePositive(commandPoints)) this.commandPoints = commandPoints;
            if (isFinitePositive(victoryPoints)) this.victoryPoints = victoryPoints;
            this.killTeam = lastKillTeam.killTeam;
            document.getElementById("KillTeamSelect").value = this.killTeam;
            this.dataslate = Dataslate.parse(lastKillTeam.dataslate);
        } else {
            this.dataslate = new Dataslate(this.killTeam);
        }
        if (this.dataslate) {
            document.getElementById(this.#BattleManagerIdRef.Dataslate.name).innerText = this.dataslate.name;
            document.getElementById(this.#BattleManagerIdRef.Dataslate.killTeam).innerText = new Id(this.dataslate.killTeam).toName();
            document.getElementById(this.#BattleManagerIdRef.Dataslate.requisitionPoints).innerText = this.dataslate.requisitionPoints;
            document.getElementById(this.#BattleManagerIdRef.Dataslate.assetCapacity).innerText = this.dataslate.assetCapacity;
            const specOpsLogElement = document.getElementById(this.#BattleManagerIdRef.Dataslate.specOpsLog);
            let specOpElement;
            this.dataslate.specOpsLog.forEach(specOp => {
                specOpElement = document.createElement("div");
                specOpElement.classList.add("textAsInput");
                specOpElement.innerText = specOp;
                specOpsLogElement.appendChild(specOpElement);
            });
            const stashElement = document.getElementById(this.#BattleManagerIdRef.Dataslate.stash);
            let equipmentElement;
            this.dataslate.stash.forEach((equipment, i) => {
                equipmentElement = document.createElement("div");
                equipmentElement.innerText = equipment;
                if (i > 0) stashElement.appendChild(document.createElemnt("br"));
                stashElement.appendChild(equipmentElement);
            });
            const assetsElement = document.getElementById(this.#BattleManagerIdRef.Dataslate.assets);
            let assetElement;
            this.dataslate.strategicAssets.forEach((asset, i) => {
                assetElement = document.createElement("div");
                assetElement.innerText = asset;
                if (i > 0) assetsElement.appendChild(document.createElemnt("br"));
                assetsElement.appendChild(assetElement);
            });
        }
        this.loadKillTeamRules(this.killTeam, { mode: location.origin === 'file://' ? "debug" : "default" });
        this.updateCommandPoints(false);
        this.updateVictoryPoints(false);
        if (typeof id !== 'undefined') this.save();
    }
    
    loadKillTeamRules = (id = "", { mode = "default" }) => {
        let rules;
        if (mode === "debug") {
            rules = KillTeam.parse(this.#RegisteredKillTeams.find(x => x.id === id)?.debugRef);
            if (rules && rules instanceof KillTeam) {
                Id.cleanContext();
                this.faction = rules.faction.toLowerCase();
                document.getElementById(this.#BattleManagerIdRef.id).setAttribute("for", new Id(this.faction).value);
                document.getElementById("Content").appendChild(rules.toHTML());
            }
        }
        else {
            const fileName = this.#RegisteredKillTeams.find(x => x.id === id)?.fileName;
            if (!fileName) return undefined;
            fetch(`assets/data/${fileName}`)
                .then(response => {
                    if (!response.ok) throw response;
                    return response.json();
                })
                .then(json => {
                    rules = KillTeam.parse(json);
                    if (rules && rules instanceof KillTeam) {
                        Id.cleanContext();
                        this.faction = rules.faction.toLowerCase();
                        document.getElementById(this.#BattleManagerIdRef.id).setAttribute("for", new Id(this.faction).value);
                        document.getElementById("Content").appendChild(rules.toHTML());
                    }
                })
                .catch(e => console.error(e));
        }
    }

    addCommandPoint = () => {
        this.commandPoints += 1;
        this.updateCommandPoints();
    }

    removeCommandPoint = () => {
        if (this.commandPoints > 0) {
            this.commandPoints -= 1;
            this.updateCommandPoints();
        }
    }

    addVictoryPoint = () => {
        this.victoryPoints += 1;
        this.updateVictoryPoints();
    }

    removeVictoryPoint = () => {
        if (this.victoryPoints > 0) {
            this.victoryPoints -= 1;
            this.updateVictoryPoints();
        }
    }
    
    updateCommandPoints = (saveAfterUpdate = true) => {
        const targetCP = document.getElementById(this.#BattleManagerIdRef.CommandPoints.id);
        targetCP.innerHTML = "";
        for (let i = 0; i < this.commandPoints; i++) {
            const point = document.createElement("div");
            point.classList.add("point");
            targetCP.appendChild(point);
        }
        if (saveAfterUpdate) this.save();
    }

    updateVictoryPoints = (saveAfterUpdate = true) => {
        const targetVP = document.getElementById(this.#BattleManagerIdRef.VictoryPoints.id);
        targetVP.innerHTML = "";
        let dice;
        if (this.victoryPoints === 0) {
            dice = document.createElement("div");
            dice.classList.add("dice");
            targetVP.appendChild(dice);
        } else {
            let dices = Math.floor(this.victoryPoints / 6);
            const lastDieFace = this.victoryPoints % 6;
            for (; dices >= 0; dices--) {
                if (dices > 0 || lastDieFace > 0) {
                    dice = document.createElement("div");
                    dice.classList.add("dice");
                    dice.classList.add(`d6-${dices === 0 ? lastDieFace : 6}`);
                    targetVP.appendChild(dice);
                }
            }
        }
        if (saveAfterUpdate) this.save();
    }

    updateDataslate = () => {
        document.getElementById(this.#BattleManagerIdRef.Dataslate.name).innerText = this.dataslate.name;
        document.getElementById(this.#BattleManagerIdRef.Dataslate.killTeam).innerText = this.dataslate.killTeam;
        document.getElementById(this.#BattleManagerIdRef.Dataslate.requisitionPoints).innerText = this.dataslate.requisitionPoints;
        document.getElementById(this.#BattleManagerIdRef.Dataslate.assetCapacity).innerText = this.dataslate.assetCapacity;
        const specOpsLogTarget = document.getElementById(this.#BattleManagerIdRef.Dataslate.assetCapacity);
        let appendElement;
        this.dataslate.specOpsLog.forEach(specOp => {
            appendElement = document.createElement("div");
            appendElement.classList.add("textAsInput");
            appendElement.innerText = specOp;//specOp.name;
            specOpsLogTarget.appendChild(appendElement);
        });
        const stashTarget = document.getElementById(this.#BattleManagerIdRef.Dataslate.stash);
        this.dataslate.stash.forEach((equipment, i) => {
            if (i > 0) stashTarget.appendChild(document.createElement("br"));
            stashTarget.appendChild(document.createTextNode(equipment.name));
        });
        const assetsTarget = document.getElementById(this.#BattleManagerIdRef.Dataslate.assets);
        this.dataslate.strategicAssets.forEach((asset, i) => {
            if (i > 0) assetsTarget.appendChild(document.createElement("br"));
            assetsTarget.appendChild(document.createTextNode(asset.name));
        });
    }

    save = () => {
        if (!localStorage) return;
        const storage = JSON.parse(localStorage.getItem("BattleManager") ?? null) ?? [];
        storage.forEach(x => x.isActive = false);
        const lastKillTeam = storage?.find(x => x.killTeam === this.killTeam);
        if (lastKillTeam) {
            lastKillTeam.isActive = true;
            lastKillTeam.commandPoints = this.commandPoints;
            lastKillTeam.victoryPoints = this.victoryPoints;
            lastKillTeam.faction = this.faction;
            lastKillTeam.dataslate = this.dataslate;
        } else {
            storage.push({
                killTeam: this.killTeam,
                isActive: true,
                commandPoints: this.commandPoints,
                victoryPoints: this.victoryPoints,
                dataslate: this.dataslate,
            });
        }
        localStorage.setItem("BattleManager", JSON.stringify(storage));
    }

}

class BattleManager {
    #RegisteredKillTeams = [
        { id: "corsair_voidscarred", debugRef: CORSAIR_VOIDSCARRED, fileName: "corsair_voidscarred.json" },
        { id: "craftworld", debugRef: CRAFTWORLD, fileName: "craftworld.json" },
        { id: "exaction", debugRef: EXACTION, fileName: "exaction.json" },
        { id: "veteran_guardsman", debugRef: VETERAN_GUARDSMAN, fileName: "veteran_guardsman.json" },
        { id: "void-dancer_troupe", debugRef: VOID_DANCER_TROUPE, fileName: "void-dancer_troupe.json" },
        { id: "wyrmblade", debugRef: WYRMBLADE, fileName: "wyrmblade.json" },
    ];
    
    #BattleManagerRefList = {
        BattleManager: {
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
            }
        }
    }

    constructor() {
        document.getElementById(this.#BattleManagerRefList.BattleManager.changeKillTeam).addEventListener('change', (e) => this.load(e.currentTarget.value));
        document.getElementById(this.#BattleManagerRefList.BattleManager.CommandPoints.add).addEventListener('click', this.addCommandPoint);
        document.getElementById(this.#BattleManagerRefList.BattleManager.CommandPoints.remove).addEventListener('click', this.removeCommandPoint);
        document.getElementById(this.#BattleManagerRefList.BattleManager.VictoryPoints.add).addEventListener('click', this.addVictoryPoint);
        document.getElementById(this.#BattleManagerRefList.BattleManager.VictoryPoints.remove).addEventListener('click', this.removeVictoryPoint);
        this.load();
    }

    #reset = () => {
        this.commandPoints = 3;
        this.victoryPoints = 0;
        this.killTeam = null;
        this.faction = null;
        document.getElementById(this.#BattleManagerRefList.BattleManager.id).removeAttribute("for");
        document.getElementById("Content").innerHTML = "";
    }
    
    load = (id) => {
        this.#reset();
        this.killTeam = typeof id !== 'undefined' && typeof id === 'string' ? id : null;
        this.faction = null;
        if (!localStorage) return;
        const storage = JSON.parse(localStorage.getItem("BattleManager") ?? null);
        const lastKillTeam = storage?.find(x => this.killTeam ? x.killTeam === this.killTeam : x.isActive);
        if (lastKillTeam) {
            const commandPoints = parseInt(lastKillTeam.commandPoints);
            const victoryPoints = parseInt(lastKillTeam.victoryPoints);
            if (!isNaN(commandPoints) && isFinite(commandPoints) && commandPoints >= 0) this.commandPoints = commandPoints;
            if (!isNaN(victoryPoints) && isFinite(victoryPoints) && victoryPoints >= 0) this.victoryPoints = victoryPoints;
            this.killTeam = lastKillTeam.killTeam;
            document.getElementById("KillTeamSelect").value = this.killTeam;
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
                document.getElementById(this.#BattleManagerRefList.BattleManager.id).setAttribute("for", new Id(this.faction).key);
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
                        document.getElementById(this.#BattleManagerRefList.BattleManager.id).setAttribute("for", new Id(this.faction).key);
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
        const targetCP = document.getElementById(this.#BattleManagerRefList.BattleManager.CommandPoints.id);
        targetCP.innerHTML = "";
        for (let i = 0; i < this.commandPoints; i++) {
            const point = document.createElement("div");
            point.classList.add("point");
            targetCP.appendChild(point);
        }
        if (saveAfterUpdate) this.save();
    }

    updateVictoryPoints = (saveAfterUpdate = true) => {
        const targetVP = document.getElementById(this.#BattleManagerRefList.BattleManager.VictoryPoints.id);
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
            //lastKillTeam.fireTeams = this.fireTeams;
        } else {
            storage.push({
                killTeam: this.killTeam,
                isActive: true,
                commandPoints: this.commandPoints,
                victoryPoints: this.victoryPoints,
                //fireTeams: this.fireTeams,
            });
        }
        localStorage.setItem("BattleManager", JSON.stringify(storage));
    }

}

class BattleManager {
    #RegisteredKillTeams = [
        "corsair_voidscarred",
        "craftworld",
        "void-dancer_troupe",
        "fleet_hive",
        "legionary",
        "exaction",
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
        this.loadKillTeamRules({id: this.killTeam, mode: "debug"});
        this.updateCommandPoints(false);
        this.updateVictoryPoints(false);
        if (typeof id !== 'undefined') this.save();
    }
    
    loadKillTeamRules = ({id = "", mode = "debug"}) => {
        let rules;
        if (mode === "debug") {
            switch(id) {
                case "corsair_voidscarred":
                    rules = CORSAIR_VOIDSCARRED;
                    break;
                case "craftworld":
                    rules = CRAFTWORLD;
                    break;
                case "void-dancer_troupe":
                    rules = VOID_DANCER_TROUPE;
                    break;
                case "exaction":
                    rules = EXACTION;
                    break;
                default: return undefined;
            }
            rules = KillTeam.parse(rules);
        } else {
            const selectedIndex = registeredKillTeams.indexOf(id);
            fetch(`../assets/data/${this.#RegisteredKillTeams[selectedIndex]}.json`)
                .then(response => {
                    if (!response.ok) throw response
                    return response.json()
                })
                .then(json => rules = KillTeam.parse(json))
                .catch(e => console.error(e));
        }
        if (rules && rules instanceof KillTeam) {
            Id.cleanContext();
            this.faction = rules.faction.toLowerCase();
            document.getElementById(this.#BattleManagerRefList.BattleManager.id).setAttribute("for", this.faction);
            document.getElementById("Content").appendChild(rules.toHTML());
        }
    }

    addCommandPoint = () => {
        this.commandPoints += 1;
        this.updateCommandPoints();
    }

    removeCommandPoint = () => {
        if (this.commandPoints > 0) this.commandPoints -= 1;
        this.updateCommandPoints();
    }

    addVictoryPoint = () => {
        this.victoryPoints += 1;
        this.updateVictoryPoints();
    }

    removeVictoryPoint = () => {
        if (this.victoryPoints > 0) this.victoryPoints -= 1;
        this.updateVictoryPoints();
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
        let dices = Math.floor(this.victoryPoints / 6);
        const lastDieFace = this.victoryPoints % 6;
        if (this.victoryPoints === 0) {
            const dice = document.createElement("div");
            dice.classList.add("dice");
            dice.classList.add("d6-0");
            targetVP.appendChild(dice);
        } else {
            for (; dices >= 0; dices--) {
                if (dices > 0 || lastDieFace > 0) {
                    const dice = document.createElement("div");
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
                //fireTeams: this.fireTeame,
            });
        }
        localStorage.setItem("BattleManager", JSON.stringify(storage));
    }

}

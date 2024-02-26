class BattleManager {
    constructor(killTeam = new KillTeam(), commandPoints = 3, victoryPoints = 0) {
        commandPoints = parseInt(commandPoints);
        victoryPoints = parseInt(victoryPoints);
        this.killTeam = killTeam instanceof KillTeam ? killTeam : null;
        this.commandPoints = !isNaN(commandPoints) && isFinite(commandPoints) && commandPoints >= 0 ? commandPoints : 3;
        this.victoryPoints = !isNaN(victoryPoints) && isFinite(victoryPoints) && victoryPoints >= 0 ? victoryPoints : 0;
        this.init();
    }

    setCurrentKillTeam = (killTeam, commandPoints = 3, victoryPoints = 0) => {
        commandPoints = parseInt(commandPoints);
        victoryPoints = parseInt(victoryPoints);
        this.killTeam = killTeam instanceof KillTeam ? killTeam : null;
        this.commandPoints = !isNaN(commandPoints) && isFinite(commandPoints) && commandPoints >= 0 ? commandPoints : 3;
        this.victoryPoints = !isNaN(victoryPoints) && isFinite(victoryPoints) && victoryPoints >= 0 ? victoryPoints : 0;
        this.update();
    }

    addCommandPoint = () => {
        this.commandPoints += 1;
        this.updateCP();
    }

    removeCommandPoint = () => {
        if (this.commandPoints > 0) this.commandPoints -= 1;
        this.updateCP();
    }

    addVictoryPoint = () => {
        this.victoryPoints += 1;
        this.updateVP();
    }

    removeVictoryPoint = () => {
        if (this.victoryPoints > 0) this.victoryPoints -= 1;
        this.updateVP();
    }

    init = () => {
        this.BattleManagerArea = document.getElementById("BattleManagerArea");

        const saveBtn = document.getElementById("SaveKillTeam");
        saveBtn.addEventListener('click', this.save);

        const addCP = document.getElementById("CommandPointAdd");
        const removeCP = document.getElementById("CommandPointRemove");
        addCP.addEventListener('click', this.addCommandPoint);
        removeCP.addEventListener('click', this.removeCommandPoint);

        const addVP = document.getElementById("VictoryPointAdd");
        const removeVP = document.getElementById("VictoryPointRemove");
        addVP.addEventListener('click', this.addVictoryPoint);
        removeVP.addEventListener('click', this.removeVictoryPoint);
    }

    updateCP = () => {
        const targetCP = document.getElementById("CommandPointsList");
        targetCP.innerHTML = "";
        for (let i = 0; i < this.commandPoints; i++) {
            const point = document.createElement("div");
            point.classList.add("point");
            targetCP.appendChild(point);
        }
    }

    updateVP = () => {
        const targetVP = document.getElementById("VictoryPointsList");
        targetVP.innerHTML = "";
        let dices = Math.floor(this.victoryPoints / 6);
        const lastDieFace = this.victoryPoints % 6;
        for (; dices >= 0; dices--) {
            if (dices > 0 || lastDieFace > 0){
                const dice = document.createElement("div");
                dice.classList.add("dice");
                dice.classList.add(`d6-${dices === 0 ? lastDieFace : 6}`);
                targetVP.appendChild(dice);
            }
        }
    }

    update = () => {
        //console.log(this.killTeam);
        const target = this.BattleManagerArea;
        const faction = this.killTeam.faction.toLowerCase();
        const previousFaction = target.getAttribute("for");
        if (!faction || !previousFaction || previousFaction !== faction) target.removeAttribute("for");
        if (faction) target.setAttribute("for", faction);
        this.updateCP();
        this.updateVP();
    }

    save = () => {
        let storage;
        try {
            storage = JSON.parse(localStorage.getItem("killTeams")) ?? [];
        } catch (e) {
            storage = [];
        }
        storage.forEach(x => x.isActive = false);
        const lastKillTeam = storage?.find(x => x.id === new Id(this.killTeam.name).key);
        if (lastKillTeam) {
            lastKillTeam.isActive = true;
            lastKillTeam.commandPoints = this.commandPoints;
            lastKillTeam.victoryPoints = this.victoryPoints;
            lastKillTeam.fireTeams = this.fireTeams;
        } else {
            storage.push({
                id: new Id(this.killTeam.name).key,
                isActive: true,
                commandPoints: this.commandPoints,
                victoryPoints: this.victoryPoints,
                fireTeams: this.fireTeame,
            });
        }
        localStorage.setItem("killTeams", JSON.stringify(storage));
    }

    load = () => {
        let storage;
        try {
            storage = JSON.parse(localStorage.getItem("killTeams")) ?? [];
        } catch (e) {
            storage = [];
        }
        const lastKillTeam = storage.find(x => x.isActive);
        if (lastKillTeam) {
            document.getElementById("KillTeamSelect").value = lastKillTeam.id;
            loadKillTeam({id: lastKillTeam.id, mode: "debug", battleManager: this});
        }
    }
    
}

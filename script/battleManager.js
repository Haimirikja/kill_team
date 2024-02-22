class BattleManager {
    constructor(killTeam = new KillTeam(), commandPoints = 3, victoryPoints = 0) {
        commandPoints = parseInt(commandPoints);
        victoryPoints = parseInt(victoryPoints);
        this.killTeam = killTeam instanceof KillTeam ? killTeam : null;
        this.commandPoints = !isNaN(commandPoints) && isFinite(commandPoints) && commandPoints >= 0 ? commandPoints : 3;
        this.victoryPoints = !isNaN(commandPoints) && isFinite(commandPoints) && commandPoints >= 0 ? commandPoints : 0;
        this.init();
    }

    setCurrentKillTeam = (killTeam, commandPoints = 3, victoryPoints = 0) => {
        commandPoints = parseInt(commandPoints);
        victoryPoints = parseInt(victoryPoints);
        this.killTeam = killTeam instanceof KillTeam ? killTeam : null;
        this.commandPoints = !isNaN(commandPoints) && isFinite(commandPoints) && commandPoints >= 0 ? commandPoints : 3;
        this.victoryPoints = !isNaN(commandPoints) && isFinite(commandPoints) && commandPoints >= 0 ? commandPoints : 0;
        this.update();
    }

    addCommandPoint = () => {
        this.commandPoints += 1;
        this.update();
    }

    removeCommandPoint = () => {
        if (this.commandPoints > 0) this.commandPoints -= 1;
        this.update();
    }

    init = () => {
        this.CommandPointList = document.getElementById("CommandPointList");
        const addButton = document.getElementById("CommandPointAdd");
        const removeButton = document.getElementById("CommandPointRemove");
        addButton.addEventListener('click', this.addCommandPoint);
        removeButton.addEventListener('click', this.removeCommandPoint);
    }

    update = () => {
        console.log(this.killTeam);
        const target = this.CommandPointList;
        const faction = this.killTeam.faction.toLowerCase();
        if (!faction || !target.classList.contains(faction)) target.className = "";
        if (faction) target.classList.add(faction);
        target.innerHTML = "";
        for (let i = 0; i < this.commandPoints; i++) {
            const point = document.createElement("div");
            point.classList.add("point");
            target.appendChild(point);
        }
        /* save some redrawing */
        // const target = document.getElementById("CommandPointList");
        // const faction = this.killTeam.faction.toLowerCase();
        // if (!target.classList.contains(faction)) {
        //     target.className = "";
        //     target.classList.add(faction);
        // }
        // if (this.commandPoints === 0) target.innerHTML = "";
        // else {
        //     const list = target.querySelectorAll(".point");
        //     if (list.length === this.commandPoints) return;
        //     if (list.length > this.commandPoints) {
        //         list.forEach((x, i) => {
        //             console.log(i, x.innerText);
        //             if (i >= this.commandPoints) x.remove();
        //         });
        //     }
        //     else {
        //         for (let i = this.commandPoints - list.length; i > 0; i--) {
        //             const point = document.createElement("div");
        //             point.classList.add("point");
        //             target.appendChild(point);
        //         }
        //     }
        // }
    }
    
}
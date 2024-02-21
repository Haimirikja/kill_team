class BattelManager {
    constructor(killTeam = new KillTeam(), commandPoint) {
        commandPoint = parseInt(commandPoint);
        this.killTeam = killTeam instanceof KillTeam ? killTeam : null;
        this.commandPoints = !isNaN(commandPoint) && isFinite(commandPoint) && commandPoint >= 0 ? commandPoint : 3;
    }

    toHTML = () => {
        const target = document.getElementById("CommandPointList");
        const faction = this.killTeam.faction.toLowerCase();
        if (!target.classList.contains(faction)) {
            target.className = "";
            target.classList.add(faction);
        }
        if (this.commandPoints === 0) target.innerHTML = "";
        else {
            const list = target.querySelectorAll(".point");
            if (list.length === this.commandPoints) return;
            if (list.length > this.commandPoints) {
                list.forEach((x, i) => {
                    console.log(i, x.innerText);
                    if (i >= this.commandPoints) x.remove();
                });
            }
            else {
                for (let i = this.commandPoints - list.length; i > 0; i--) {
                    const point = document.createElement("div");
                    point.classList.add("point");
                    point.innerText = ".";
                    target.appendChild(point);
                }
            }
        }
    }
    
}
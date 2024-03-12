
class KillTeam {
    constructor(name = "", faction = "", abilities = [], strategicPloys = [], tacticalPloys = [], psychicPowers = [], fireTeams = []) {
        Object.defineProperty(this, "addOperative", { enumerable: false });
        Object.defineProperty(this, "removeOperative", { enumerable: false });
        Object.defineProperty(this, "toString", { enumerable: false });
        Object.defineProperty(this, "toHTML", { enumerable: false });
        this.name = name && typeof name === 'string' ? name : "";
        this.faction = faction && typeof faction === 'string' ? faction : "";
        this.abilities = Array.isArray(abilities) ? abilities.filter(x => x instanceof Ability) : [];
        this.strategicPloys = Array.isArray(strategicPloys) ? strategicPloys.filter(x => x instanceof StrategicPloy) : [];
        this.tacticalPloys = Array.isArray(tacticalPloys) ? tacticalPloys.filter(x => x instanceof TacticalPloy) : [];
        this.psychicPowers = Array.isArray(psychicPowers) ? psychicPowers.filter(x => x instanceof PsychicPower) : [];
        this.fireTeams = Array.isArray(fireTeams) ? fireTeams.filter(x => x instanceof FireTeam) : [];
    }

    addFireTeam = (fireTeam) => {
        if (fireTeam instanceof FireTeam) this.fireTeams.push(fireTeam);
        return this.fireTeams;
    }
    
    removeFireTeam = (fireTeam) => {
        if (fireTeam instanceof FireTeam) this.fireTeams.splice(this.fireTeams.indexOf(this.fireTeams.find(x => x.equals(fireTeam))), 1);
        return this.fireTeams;
    }

    static parse = (object) => {
        if (!(object instanceof Object)) return undefined;
        return new KillTeam(
            object.name,
            object.faction,
            object.abilities?.map(x => Ability.parse(x)),
            object.strategicPloys?.map(x => StrategicPloy.parse(x)),
            object.tacticalPloys?.map(x => TacticalPloy.parse(x)),
            object.psychicPowers?.map(x => PsychicPower.parse(x)),
            object.fireTeams?.map(x => FireTeam.parse(x)),
        )
    }

    toString = () => JSON.stringify({
        name: this.name,
        faction: this.faction,
        abilities: this.abilities,
        strategicPloy: this.strategicPloys,
        tacticalPloy: this.tacticalPloys,
        psychicPowers: this.psychicPowers,
        fireTeams: this.fireTeams
    });

    toHTML = () => {
        const killTeamElement = document.createElement("div");
        killTeamElement.id = new Id(`${this.name} kill team`, "kill_team").value;
        killTeamElement.classList.add("kill-team");

        const killTeamName = document.createElement("h1");
        killTeamName.classList.add("title");
        killTeamName.classList.add("toggle-show");
        killTeamName.innerText = `${this.name} Kill Team`+(this.faction ? ` (${this.faction})` : "");
        killTeamElement.appendChild(killTeamName);
        const killTeamContent = document.createElement("div");
        killTeamName.addEventListener('click', (e) => slideToggle(killTeamContent, { sender: e.currentTarget }));

        const fireTeamsList = document.createElement("div");
        fireTeamsList.classList.add("legend");
        const fireTeamsBlock = document.createElement("div");
        this.fireTeams.forEach(fireTeam => {
            const fireTeamLink = document.createElement("a");
            fireTeamLink.setAttribute("href", `#${new Id(fireTeam.name, "fire_team").value}`);
            fireTeamLink.innerText = `${fireTeam.name} Fire Team`;
            fireTeamsList.appendChild(fireTeamLink);
            fireTeamsBlock.appendChild(fireTeam.toHTML({ goBackRef: killTeamElement }));
        });
        killTeamContent.appendChild(fireTeamsList);
        if (this.abilities.length) {
            const abilitiesElement = document.createElement("div");
            const abilitiesTitle = document.createElement("h2");
            abilitiesTitle.classList.add("title");
            const abilitiesSubtitle = document.createElement("div");
            if (this.abilities.length === 1) {
                abilitiesTitle.innerText = "ABILITY";
                abilitiesSubtitle.innerText = `Below, you will find common abilities of the ${this.name} kill team.`;
            } else {
                abilitiesTitle.innerText = "ABILITIES";
                abilitiesSubtitle.innerText = `Below, you will find common abilities of the ${this.name} kill team.`;
            }
            abilitiesElement.appendChild(abilitiesTitle);
            abilitiesElement.appendChild(abilitiesSubtitle);
            this.abilities.forEach(ability => {
                abilitiesElement.appendChild(ability.toHTML({ headedTitle: true }));
            });
            killTeamContent.appendChild(abilitiesElement);
        }
        let ploysElement;
        let ploysTitle;
        if (this.strategicPloys.length) {
            ploysElement = document.createElement("div");
            ploysElement.classList.add("kill-team-strategic-ploys");
            ploysTitle = document.createElement("h2");
            ploysTitle.classList.add("title");
            ploysTitle.innerText = "STRATEGIC PLOYS";
            ploysElement.appendChild(ploysTitle);
            this.strategicPloys.forEach(ploy => {
                ploysElement.appendChild(ploy.toHTML());
            });
            killTeamContent.appendChild(ploysElement);
        }
        if (this.tacticalPloys.length) {
            ploysElement = document.createElement("div");
            ploysElement.classList.add("kill-team-tactical-ploys");
            ploysTitle = document.createElement("h2");
            ploysTitle.classList.add("title");
            ploysTitle.innerText = "TACTICAL PLOYS";
            ploysElement.appendChild(ploysTitle);
            this.tacticalPloys.forEach(ploy => {
                ploysElement.appendChild(ploy.toHTML());
            });
            killTeamContent.appendChild(ploysElement);
        }
        if (this.psychicPowers.length) {
            const killTeamPsychicPowers = document.createElement("div");
            const killTeamPsychicPowersTitle = document.createElement("h2");
            killTeamPsychicPowersTitle.classList.add("title");
            killTeamPsychicPowersTitle.innerText = "PSYCHIC POWERS";
            killTeamPsychicPowers.appendChild(killTeamPsychicPowersTitle);
            const killTeamPsychicPowersSubtitle = document.createElement("div");
            killTeamPsychicPowersSubtitle.innerText = `Each time a friendly ${this.name} operative performs the Manifest Psychic Power action, select one psychic power from the list below to be resolved. You can only select each psychic power a maximum of once per Turning Point.`
            killTeamPsychicPowers.appendChild(killTeamPsychicPowersSubtitle);
            this.psychicPowers.forEach(psychicPower => {
                killTeamPsychicPowers.appendChild(psychicPower.toHTML());
            });
            killTeamContent.appendChild(killTeamPsychicPowers);
        }
        killTeamContent.appendChild(fireTeamsBlock);
        killTeamElement.appendChild(killTeamContent);
        return killTeamElement;
    }
}

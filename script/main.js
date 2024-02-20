
const registeredKillTeams = [
    "corsair_voidscarred",
    "craftworld",
    "void-dancer_troupe",
    "fleet_hive",
    "legionary",
];
Object.freeze(registeredKillTeams);

function loadDebugKillTeam(id) {
    switch(id) {
        case "corsair_voidscarred": return CORSAIR_VOIDSCARRED;
        case "void-dancer_troupe": return VOID_DANCER_TROUPE;
        default: return undefined;
    }
}
function loadKillTeam(value, mode = "debug") {
    let killTeam;
    if (mode === "debug") {
        killTeam = loadDebugKillTeam(value);
    } else {
        const selectedIndex = registeredKillTeams.indexOf(value);
        fetch(`/assets/data/${registeredKillTeams[selectedIndex]}.json`)
            .then(response => {
                if (!response.ok) throw response
                return response.json()
            })
            .then(json => killTeam = json)
            .catch(e => console.error(e));
    }
    if (killTeam) {
        const target = document.getElementById("Content");
        target.innerHTML = "";
        killTeam.equipment.forEach(item => {
            //dedicated Id not passed
            const eq = Equipment.parse(item);
            target.appendChild(eq.toHTML(new Id(eq.name)));
        });
        killTeam.fireTeam[0].operatives.forEach(operative => {
            const op = Operative.parse(operative);
            target.appendChild(op.toHTML(new Id(op.name)));
        });
    }
}

window.onload = () => {
    
    document.getElementById("KillTeamSelect").addEventListener('change', e => {
        const sender = e.currentTarget;
        loadKillTeam(sender.value, "debug");
    });
    //CORSAIR_VOIDSCARRED
    

}
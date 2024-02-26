
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
function loadKillTeam({
    id,
    mode = "debug",
    battleManager = null
}) {
    let currentKillTeam;
    console.log(id);
    if (mode === "debug") {
        currentKillTeam = loadDebugKillTeam(id);
    } else {
        const selectedIndex = registeredKillTeams.indexOf(id);
        fetch(`../assets/data/${registeredKillTeams[selectedIndex]}.json`)
            .then(response => {
                if (!response.ok) throw response
                return response.json()
            })
            .then(json => currentKillTeam = json)
            .catch(e => console.error(e));
    }
    if (currentKillTeam) {
        currentKillTeam = KillTeam.parse(currentKillTeam);
        Id.cleanContext();
        const target = document.getElementById("Content");
        target.innerHTML = "";
        target.appendChild(currentKillTeam.toHTML());
        // killTeam.equipment.forEach(item => {
        //     const eq = Equipment.parse(item);
        //     target.appendChild(eq.toHTML());
        // });
        // killTeam.fireTeam[0].operatives.forEach(operative => {
        //     const op = Operative.parse(operative);
        //     target.appendChild(op.toHTML());
        // });
        battleManager.setCurrentKillTeam(currentKillTeam);
    }
}

window.onload = () => {
    
    const bm = new BattleManager();
    bm.load();

    document.getElementById("KillTeamSelect").addEventListener('change', e => {
        const sender = e.currentTarget;
        loadKillTeam({ id: sender.value, mode: "debug", battleManager: bm });
    });
    //CORSAIR_VOIDSCARRED

}
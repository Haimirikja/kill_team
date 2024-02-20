

window.onload = () => {
    const target = document.getElementById("Content");
    //CORSAIR_VOIDSCARRED
    VOIDDANCER_TROUPE.equipment.forEach(item => {
        //dedicated Id not passed
        const eq = Equipment.parse(item);
        target.appendChild(eq.toHTML(new Id(eq.name)));
    });
    VOIDDANCER_TROUPE.fireTeam[0].operatives.forEach(operative => {
        const op = Operative.parse(operative);
        target.appendChild(op.toHTML(new Id(op.name)));
    });

}
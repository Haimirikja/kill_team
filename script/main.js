

window.onload = () => {
    /*
    const kt = new KillTeam("Corsair Voidscarred", "Aeldari");
    const op = new Operative("Felarch", { experiencePoints: 6 });
    console.log(op);
    kt.addOperative(op);
    console.log(kt);
    kt.removeOperative(op);
    console.log(kt);
    */
    const target = document.getElementById("Content");
    VOIDDANCER_TROUPE.equipment.forEach(item => {
        // const id = new Id(name, "item");
        const eq = Equipment.parse(item);
        //target.appendChild(equip.dedicated ? equip.toHTML(new Id(equip.dedicated)) : equip.toHTML());
        target.appendChild(eq.toHTML(new Id(eq.name)));
    });
    VOIDDANCER_TROUPE.fireTeam[0].operatives.forEach(operative => {
        // const id = new Id(name, "item");
        const op = Operative.parse(operative);
        target.appendChild(op.toHTML(new Id(op.name)));
    });

}
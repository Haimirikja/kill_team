

function markupReplace(string) {
    const markupList = {
        '((R))': '<img src="assets/image/range.png" />',
        '((M))': '<img src="assets/image/melee.png" />',
        '((1))': '<img src="assets/image/dist1.png" />',
        '((2))': '<img src="assets/image/dist2.png" />',
        '((3))': '<img src="assets/image/dist3.png" />',
        '((6))': '<img src="assets/image/dist6.png" />',
    }

}

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
        target.appendChild(Equipment.parse(item).toHTML());
    });
    VOIDDANCER_TROUPE.fireTeam[0].operatives.forEach(operative => {
        // const id = new Id(name, "item");
        target.appendChild(Operative.parse(operative).toHTML());
    });
}
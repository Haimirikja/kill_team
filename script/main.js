

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
    //VOIDSCARRED_CORSAIR.equipment.forEach(item => {
        const name = item.name;
        const description = item.description;
        const value = item.value;
        const value2 = item.value2;
        const limit = item.limit;
        const dedicated = item.dedicated;
        const ability = item.ability;
        const action = item.action;
        const weapon = item.weapon;
        const id = new Id(name, "item");
        target.appendChild(itemElement);
    });
}
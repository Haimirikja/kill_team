
window.onload = () => {

    const querystring = new URLSearchParams(location.search);
    const currentKillTeam = querystring.get("kt");
    const target = document.getElementById("Content");
    const categories = [];
    const categoryFilters = document.createElement("div");
    categoryFilters.classList.add("legend");
    target.appendChild(categoryFilters);
    TAC_OPS.forEach(tacOp => {
        if (tacOp.killTeam && tacOp.killTeam !== currentKillTeam) return;
        if (!categories.includes(tacOp.category)) {
            categories.push(tacOp.category);
            const filterButton = document.createElement("div");
            filterButton.id = new Id(`${tacOp.category}`).value;
            filterButton.classList.add("category-legend");
            filterButton.classList.add("toggle-hide");
            filterButton.innerText = tacOp.category;
            filterButton.addEventListener('click', filterCategory);
            categoryFilters.appendChild(filterButton);
        }
        target.appendChild(TacOp.parse(tacOp).toHTML());
    });
    
}

function filterCategory(e) {
    const sender = e.currentTarget;
    const filterValue = sender.id;
    document.querySelectorAll(".category-legend").forEach(element => {
        element.classList.toggle("toggle-hide", false);
        element.classList.toggle("toggle-show", true);
    });
    sender.classList.toggle("toggle-hide", true);
    sender.classList.toggle("toggle-show", false);
    document.querySelectorAll(".tacop").forEach(element => element.classList.toggle("hide", true));
    document.querySelectorAll(".tacop").forEach(element => { if (element.getAttribute("for") === filterValue) element.classList.toggle("hide", false); });
    document.getElementById("")
}
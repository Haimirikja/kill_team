
window.onload = () => {

    load();
    
}

function init(currentKillTeam) {
    document.getElementById("Content").innerHTML = "";
    document.getElementById("ShuffleBoard").innerHTML = "";
    document.getElementById("SelectedTacOps").innerHTML = "";
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
        const currentTacOp = TacOp.parse(tacOp);
        target.appendChild(currentTacOp.toHTML({ callback_update: updateSelection }));
    });
    const shuffleButton = document.createElement("div");
    shuffleButton.id = "ShuffleTacOps";
    shuffleButton.classList.add("category-legend");
    shuffleButton.classList.add("button");
    const shuffleCount = document.createElement("span");
    shuffleCount.id = "ShuffleCount";
    shuffleCount.innerText = 0;
    shuffleButton.appendChild(document.createTextNode("Shuffle "));
    shuffleButton.appendChild(shuffleCount);
    shuffleButton.appendChild(document.createTextNode("/6"));
    shuffleButton.addEventListener('click', _ => {
        if (TacOp.pickedTacOps.length < 6) alert((6 - TacOp.pickedTacOps.length) + " missing Tac Ops");
		else {
			target.innerHTML = "";
			drawTacOps(currentKillTeam, TacOp.pickedTacOps);
		}
    });
    categoryFilters.appendChild(shuffleButton);
}

function filterCategory(e) {
    const sender = e.currentTarget;
    const filterValue = sender.id;
    document.querySelectorAll(".category-legend:not(.button)").forEach(element => {
        element.classList.toggle("toggle-hide", false);
        element.classList.toggle("toggle-show", true);
    });
    sender.classList.toggle("toggle-hide", true);
    sender.classList.toggle("toggle-show", false);
    document.querySelectorAll(".tacop").forEach(element => element.classList.toggle("hide", true));
    document.querySelectorAll(".tacop").forEach(element => { if (element.getAttribute("for") === filterValue) element.classList.toggle("hide", false); });
}

function updateSelection() {
    document.getElementById("ShuffleCount").innerText = TacOp.pickedTacOps.length;
}
async function timeout(ms) {
	return new Promise(result => setTimeout(result, ms));
}
async function pickTacOp() {
	while (choosen === false) await timeout(50);
}
async function drawTacOps(currentKillTeam, TacOpsDeck) {
    if (!(TacOpsDeck instanceof Deck)) return null;
    const shuffleBoard = document.getElementById("ShuffleBoard");
	//document.querySelectorAll(".board").forEach(board => { board.classList.toggle("hidden", false); });
	choosen = false;
	if (TacOpsDeck.length) {
		TacOpsDeck.shuffle();
		const draws = TacOpsDeck.draw(2, true);
		const batch = document.createElement("div");
		batch.classList.add("batch");
		draws.forEach((tacOp) => {
			const card = tacOp.toHTML({ mode: "CARD" });
			batch.appendChild(card);
			card.addEventListener('click', _ => {
				const selectedTarget = document.getElementById("SelectedTacOps");
                tacOp.save(currentKillTeam);
				selectedTarget.appendChild(tacOp.toHTML({ mode: "CARD" }));
				const batchTarget = card.closest(".batch");
				batchTarget.remove();
				choosen = true;
			});
		});
		shuffleBoard.appendChild(batch);
		await pickTacOp();
		drawTacOps(currentKillTeam, TacOpsDeck);
	} else {
        //if (TacOpsDeck.length === 0) console.log("COMPLETED");
		//shuffleBoard.closest(".board")?.classList.toggle("hidden", true);
		return false;
	}
}

function load() {
    if (!localStorage) return;
    const storage = JSON.parse(localStorage.getItem("TacOpsManager") ?? null) ?? [];
    const querystring = new URLSearchParams(location.search);
    const currentKillTeam = querystring.get("kt");
    const savedKillTeam = storage?.find(x => x.killTeam === currentKillTeam);
    if (savedKillTeam && savedKillTeam.tacOps.length > 0) {
        const selectedTarget = document.getElementById("SelectedTacOps");
        savedKillTeam.tacOps.forEach(tacOp => {
            selectedTarget.appendChild(TacOp.parse(tacOp).toHTML({ mode: "CARD" }));
        });
        const actionBar = document.createElement("div");
        const clearButton = document.createElement("div");
        clearButton.id = "ClearButton";
        clearButton.classList.add("button");
        clearButton.innerText = "CLEAR";
        clearButton.addEventListener('click', _ => {
            const currentStorage = JSON.parse(localStorage.getItem("TacOpsManager") ?? null) ?? [];
            const currentKillTeam = new URLSearchParams(location.search)?.get("kt");
            const newStorage = currentStorage.filter(x => x.killTeam !== currentKillTeam);
            localStorage.setItem("TacOpsManager", JSON.stringify(newStorage));
            location.reload();
        });
        actionBar.appendChild(clearButton);
        selectedTarget.appendChild(actionBar);
    } else init(currentKillTeam);
}

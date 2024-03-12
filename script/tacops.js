
window.onload = () => {

    const target = document.getElementById("Content");
    TAC_OPS.forEach(tacOp => {
        target.appendChild(TacOp.parse(tacOp).toHTML());
    });

}

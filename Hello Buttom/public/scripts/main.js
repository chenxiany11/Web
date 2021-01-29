var counter = 0;


function main() {
    console.log("Ready");

    document.querySelector("#db").onclick = (event) => {
        console.log("You pressed decrement!");
        counter --;
        updateView();
    };

    document.querySelector("#rb").onclick = (event) => {
        console.log("You pressed reset!");
        counter = 0;
        updateView();
    };

    document.querySelector("#ib").onclick = (event) => {
        console.log("You pressed reset!");
        counter ++;
        updateView();
    };
}

function updateView() {
    //document.querySelector("#counterText").innerHTML = "Counter = "+counter;
    document.querySelector("#counterText").innerHTML = `Counter = ${counter}`;
}

main();
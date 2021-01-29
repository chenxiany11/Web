/**
 * @fileoverview
 * Provides the JavaScript interactions for all pages.
 *
 * @author 
 * Sybil 
 */

/** namespace. */
var rhit = rhit || {};

var init = "#800000";
var counter = 0;


/** function and class syntax examples */
rhit.updateView = function () {
	/** function body */
	document.querySelector("#counter").innerHTML =  counter;
	const colorBox = document.querySelector("#favoriteColorBox");
	colorBox.innerHTML = init;
    colorBox.style.setProperty("background-color",init);
};


/* Main */
/** function and class syntax examples */
rhit.main = function () {
    document.querySelector("#decrement").onclick = (event) => {
        counter--;
        rhit.updateView();
    }
    document.querySelector("#reset").onclick = (event) => {
        counter=0;
        rhit.updateView();
    }
    document.querySelector("#increment").onclick = (event) => {
        counter++;
        rhit.updateView();
    }
    const btns = document.querySelectorAll("#lowerButtons button");
    for(const btn of btns){   
        btn.onclick = (event) => {
            init = btn.dataset.color;
            rhit.updateView();
        }
    }
};

rhit.main();

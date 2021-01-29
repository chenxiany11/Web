
var rhit = rhit || {};

/** globals */
rhit.counter = 0;

/** function and class syntax examples */

/* Main */
/** function and class syntax examples */
rhit.main = function () {
	console.log("Ready");
	//const buttons = document.querySelectorAll("#counterButtons button");
	// for (let i = 0; i < buttons.length; i++) {
	// 	const button = buttons[i];
	// 	// var button = buttons[i];
	// 	// let button = buttons[i];
	// 	// button = buttons[i];
	// 	button.onclick = (event) => {
	// 		console.log("Ready");
	// 		console.log(`You pressed`, button);
	// 	};
	// }

	// for (const button of buttons) {
	// 	button.onclick = (event) => {
	// 		const dataAmount = parseInt(button.dataset.amount);
	// 		const dataIsMultiplication = button.dataset.isMultiplication;
	// 		console.log(`Amount: ${dataAmount} isMult: ${dataIsMultiplication}`);
			// console.log(`Amount: ${typeof(dataAmount)} isMult: ${typeof(dataIsMultiplication)}`);

			// if (dataIsMultiplication) {
			// 	console.log("This IS Truthy. User multiplication.");
			// }else {
			// 	console.log("Not multiplication.");
			// }
		// 	rhit.updateCounter(dataAmount, dataIsMultiplication);
		// };
	//}

	// buttons.forEach((button) => {
	// 	button.onclick = (event) => {
	// 		console.log(`You pressed`, button);
	// 	};
	// });

	$("#counterButtons button").click((event) => {
		//console.log("Button", event.target);
		const dataAmount = $(event.target).data("amount");
		const dataIsMultiplication = !!$(event.target).data("isMultiplication");
		// console.log(`Amount: ${dataAmount} isMult: ${dataIsMultiplication}`);
		// console.log(`Amount: ${typeof(dataAmount)} isMult: ${typeof(dataIsMultiplication)}`);
		rhit.updateCounter(dataAmount, dataIsMultiplication);
	});

};

rhit.updateCounter = function (amount, isMultiplication) {
	if (isMultiplication) {
		rhit.counter = rhit.counter * amount;
	}else {
		rhit.counter = rhit.counter + amount;
	}
	//document.querySelector("#counterText").innerHTML = `Count = ${rhit.counter}`;
	$("#counterText").html(`Counter = ${rhit.counter}`)
};

rhit.main();

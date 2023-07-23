//function for returning to game screen
function resetGame() {
	let resetScreen = document.querySelector('.');
	container.innerHTML = `
	    <h1 id="introduction">After a long journey beset by hardships, your destination finally stands in front of you: the Tomb of the Four Kings.
        	None now remain who can retell their trials, their victories, or even their names. But one legend persists across time. Each king 
			kept secret a vast store of treasures; their covetousness exceeding even their mortal bounds, they demanded to be buried with them.
			<br>
			And here you stand, before the ruins and final remnant of their reign... Who knows how deep the delve will take to recover their treasure...
			And who knows what manner of creatures and arcane traps might have brought an end to travellers before you... You have only your nerve and
			four torches to guide you. 
			<br>
			Will you brave the depths below?
		</h1>
		<button id="startGame">Enter the tomb</button>
		</div>
	`
}

//function to show instructions
function instructions() {
	//allow the player to skip instructions
	let skipCheck = skip();
	if(skipCheck) {
		return
	}
}

//function to skip instructions
function skip() {
	return confirm("Would you like to see the instructions?");
}

//set event listener for start button
const startButton = document.getElementById("startGame");
startButton.addEventListener('click', startGame);

//function for starting game and setting initial divs
function startGame() {
	//call instruction function first
	instructions();	
	//delete container div's children
	let nextScreen = document.querySelector('.container');
	clearScreen(nextScreen);
	nextScreen.innerHTML = `
		<div class="torchRow"></div>
		<div class="delveRow"></div>
		<div class="playField">
			<div class="discardPile"></div>
			<div class="currentPlay">
				<div class="encounterImage"></div>
				<div class="encounterCardStack"></div>
			</div>
			<div class="playerHand">
				<div id="jacks"></div>
				<div id="treasure"></div>
				<div id="kingHoards"></div>
			</div>
		<div class="hpBar">
			<div id="currentHp"></div>
			<div id="lostHp"></div>
		</div>
	`
}

//helper function to clear container div
function clearScreen(div) {
	div.innerHTML = ''
}

//helper function to create new div for returnRow under delveRow
function returnRow() {
	const parentElement = document.querySelector('.container');
	const newRow = document.createElement('div');
	newRow.setAttribute('class', 'returnRow');
	parentElement.appendChild(newRow);
}
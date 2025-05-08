//function for returning to game screen
function resetGame() {
	let resetScreen = document.querySelector('.container');
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
		<div class="playGame">
			<button id="play">Draw a card</button>
		</div>
	`
	let newDeck = deckGen();
	for(let i = 0; i < 10; i++) {shuffle(newDeck)};
	inventory();
	let delveCheck = true;
	let level = 0;
	const playButton = document.getElementById("play");
	playButton.addEventListener('click', playRound(newDeck))
}

// function for beating the game
function success() {
	alert('You win!')
}

function failure() {
	alert('You lose!')
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

// definining the game logic

// generate a deck function CHECK
function deckGen() {
	const suits = ['s', 'c', 'd', 'h'];
	const ranks = ['J', 'Q', 'K', 'A', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
	let deck = [];
	for(let i =0; i<suits.length; i++) 
	{
		for(let j=0; j<ranks.length; j++)
		{
			deck.push(ranks[j]+suits[i])
		}
	}
	//remove numerical hearts!
	for(let k =0; k < 9; k++)
	{deck.pop()}
	return deck
}

//shuffle deck function CHECK
function shuffle(deck) {
	for(let i=0; i < deck.length; i++) 
	{
		let shuffPos = Math.floor(Math.random() * deck.length);
		[deck[i], deck[shuffPos]] = [deck[shuffPos], deck[i]]; 
	}
} 

// function for generating storage spaces
function inventory() {
	// Generate hpBar
	let playerHp = 9;
	let foundTreasure = [];
	let foundHoards = [];
	let skills = [];
	let torches = 4
}

//function to check decklength
function emptyDeck(deck) {
	return deck.length == 0
}

// Round of play
function playRound(deck) {
// - alter delve/return number on delving check (true or false?)
	if(delveCheck) {
		level -= 1
	} else {
		level += 1
	}
// - Begin monster turn
//		set wincheck == false
	let wincheck = false;
//		draw encounter card and remove from deck object:
	let encounter = [];
//		generate roundqqueue for encounter cards
	let monsterCheck = false;
	while(!monsterCheck) {
		let currentCard = deck.pop();
		let rank = currentCard[0];
		if(rank=='K') {
			encounter.push(currentCard)
		}
		if(rank=='Q') {
			wincheck = true
		}
		if(rank=='J') {
			skills.push(currentCard)
		}
		if(rank=='A') {
			torches -= 1;
			if(torches==0) {
				failure()
			}
		} else {
			encounter.push(currentCard);
			monsterCheck = true
		}
	}
// - if wincheck, endround();
// Player turn
	if(wincheck) {
		let topCard = encounter[encounter.length -1];
		if(topCard[1] == 'd') {
			foundTreasure.push()
		}
		foundTreasure.push(encounter.slice(0, encounter.length-1))
	}
	while(!wincheck) {
		let topCard = encounter[encounter.length -1];
		let playerCard = deck.pop(); 
		let rank = playerCard[0];
		if(rank=='K') {
			encounter.push(currentCard)
		}
		if(rank=='Q') {
			wincheck = true
		}
		if(rank=='J') {
			skills.push(currentCard)
		}
		if(rank=='A') {
			torches -= 1;
			if(torches==0) {
				failure()
			}
		} else {
			if(parseInt(rank) >= parseInt(topCard[0])) {
				if(topCard[1] == 'd') {
					foundTreasure.push()
				}
				foundTreasure.push(encounter.slice(0, encounter.length-1))
			} else {
				playerHp -= parseInt(topCard[0]) - parseInt(rank)
			}
			wincheck = true
		}
	}
// check if level == 0
	if(level==0) {
		success()
	}
}

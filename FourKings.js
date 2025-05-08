/*//function for returning to game screen
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
}*/

//CHATGPT SHIT 
// Game State
let deck = [];
let playerHp = 9;
let torches = 4;
let level = 0;
let delveCheck = true;
let foundTreasure = [];
let foundHoards = [];
let skills = [];

// Helper function to parse cards
function parseCard(card) {
  const match = card.match(/^([JQKA]|10|[2-9])([a-z])$/);
  return match ? { rank: match[1], suit: match[2] } : null;
}

// Clear screen
function clearScreen(div) {
  div.innerHTML = '';
}

// Generate deck
function deckGen() {
  const suits = ['s', 'c', 'd', 'h'];
  const ranks = ['J', 'Q', 'K', 'A', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  let deck = [];
  for (let suit of suits) {
    for (let rank of ranks) {
      deck.push(rank + suit);
    }
  }
  // Remove 2–10 of Hearts (for HP)
  return deck.filter(card => !(parseCard(card).suit === 'h' && !['J', 'Q', 'K', 'A'].includes(parseCard(card).rank)));
}

function shuffle(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

function instructions() {
  if (!confirm("Would you like to see the instructions?")) return;
  alert("Collect treasure, survive monsters, and escape the dungeon. Click 'Draw a card' to begin delving!");
}

function resetGame() {
  const container = document.querySelector('.container');
  clearScreen(container);
  container.innerHTML = `
    <h1 id="introduction">After a long journey beset by hardships, your destination finally stands before you...</h1>
    <button id="startGame">Enter the tomb</button>
  `;
}

function startGame() {
  instructions();
  const container = document.querySelector('.container');
  clearScreen(container);
  container.innerHTML = `
    <div class="torchRow">Torches: <span id="torchCount">4</span></div>
    <div class="playField">
      <div class="discardPile"></div>
      <div class="playerHand"></div>
      <div class="hpBar">HP: <span id="hpCount">9</span></div>
      <div><button id="play">Draw a card</button></div>
    </div>
  `;

  deck = deckGen();
  for (let i = 0; i < 10; i++) shuffle(deck);

  document.getElementById('play').addEventListener('click', () => playRound());
}

function playRound() {
  if (deck.length === 0) return alert("The deck is empty.");

  if (delveCheck) {
    level--;
  } else {
    level++;
  }

  let wincheck = false;
  let encounter = [];
  let monsterCheck = false;

  while (!monsterCheck && deck.length > 0) {
    let currentCard = deck.pop();
    let { rank, suit } = parseCard(currentCard);

    if (rank === 'K') foundHoards.push(currentCard);
    else if (rank === 'Q') wincheck = true;
    else if (rank === 'J') skills.push(currentCard);
    else if (rank === 'A') {
      torches--;
      updateTorchDisplay();
      if (torches === 0) return failure();
    } else {
      encounter.push(currentCard);
      monsterCheck = true;
    }
  }

  if (wincheck) {
    let topCard = parseCard(encounter[encounter.length - 1]);
    if (topCard && topCard.suit === 'd') foundTreasure.push(encounter.pop());
    updateDisplay();
    return;
  }

  while (!wincheck && deck.length > 0) {
    let playerCard = deck.pop();
    let { rank, suit } = parseCard(playerCard);

    if (rank === 'K') foundHoards.push(playerCard);
    else if (rank === 'Q') wincheck = true;
    else if (rank === 'J') skills.push(playerCard);
    else if (rank === 'A') {
      torches--;
      updateTorchDisplay();
      if (torches === 0) return failure();
    } else {
      let enemy = parseCard(encounter[encounter.length - 1]);
      if (parseInt(rank) >= parseInt(enemy.rank)) {
        if (enemy.suit === 'd') foundTreasure.push(encounter.pop());
      } else {
        playerHp -= (parseInt(enemy.rank) - parseInt(rank));
        updateHpDisplay();
        if (playerHp <= 0) return failure();
      }
      wincheck = true;
    }
  }

  if (level === 0) success();
  updateDisplay();
}

function updateDisplay() {
  updateHpDisplay();
  updateTorchDisplay();
  const handDiv = document.querySelector('.playerHand');
  handDiv.innerHTML = `Treasure: ${foundTreasure.join(', ')} | Hoards: ${foundHoards.join(', ')} | Skills: ${skills.join(', ')}`;
}

function updateHpDisplay() {
  document.getElementById('hpCount').innerText = playerHp;
}

function updateTorchDisplay() {
  document.getElementById('torchCount').innerText = torches;
}

function success() {
  alert("You found the treasure and made it out alive! Victory!");
  resetGame();
}

function failure() {
  alert("You have perished in the depths...");
  resetGame();
}

// Set up initial screen after DOM loads
document.addEventListener('DOMContentLoaded', () => {
  const container = document.createElement('div');
  container.className = 'container';
  document.body.appendChild(container);

  container.addEventListener('click', function (e) {
    if (e.target && e.target.id === 'startGame') {
      startGame();
    }
  });

  resetGame();
});

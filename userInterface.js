let characters = [];
let guessOrder = [];
let draggedIndex = null;
let guessCount = 0;


function displayCharacters() {
  const container = document.getElementById('game-container');
  container.innerHTML = ''; // Clear previous

  guessOrder.forEach((char, index) => {
    // Create a drop zone before each card
    const dropZone = document.createElement('div');
    dropZone.className = 'drop-zone';
    dropZone.dataset.dropIndex = index;
    container.appendChild(dropZone);

    const div = document.createElement('div');
    div.className = 'character-card';
    div.setAttribute('draggable', true);
    div.setAttribute('data-index', index); // for tracking drag index
    div.dataset.dropIndex = index;
    div.innerHTML = `
      <img src="${char.image}" alt="${char.name}">
      <p><strong>${char.name}</strong></p>
      <p>${char.anime}</p>
    `;

    // dynamically change background color according to past information

    // run over every hint and check if we should recoulor anything
    usedHintIndices.forEach((hint, i) => {
      let relevantHistory = null;
      if (hint == 0){
        relevantHistory = guessHistory0;
      }
      if (hint == 1){
        relevantHistory = guessHistory1;
      }
      
      if (relevantHistory != null){
      // check if character was at the current position in this specific previous hint
      let characterPositionInRelHistory = relevantHistory.findIndex(obj => obj.name === char.name);
      if (index == characterPositionInRelHistory){  // we are at the exact same position as in a previous hint!
        let hintType = relevantHistory[index].pastGuesses[index]
        if (usedHintType[i] == hintType){   // and we even used the right hint type!!!
        div.style.backgroundColor = guessColorMapping[hintType];
        }
      }
      }
    });

    if(correctRevealed[index] && char.pastGuesses[index] != 0){ // check if green was revealed at any position
      div.style.backgroundColor = guessColorMapping[2];   // guess is wrong -> red
    }
    
    // if real position is already guesses, also show green
    /* if (char.pastGuesses.includes(0) && realOrder.findIndex(character => character.name == char.name) != index){
      div.style.backgroundColor = guessColorMapping[2];
    } */
    container.appendChild(div);
  });

  // Add a final drop zone at the end
  const finalDropZone = document.createElement('div');
  finalDropZone.className = 'drop-zone';
  finalDropZone.dataset.dropIndex = guessOrder.length;
  container.appendChild(finalDropZone);

  addDragListeners();   // atach drag event after rendering
}

function addDragListeners() {
    const cards = document.querySelectorAll('.character-card');
    // let draggedIndex = null;
    const dropZones = document.querySelectorAll('.drop-zone');
  
    cards.forEach(card => {
        card.addEventListener('dragstart', () => {
          draggedIndex = parseInt(card.dataset.index);
          card.classList.add('dragging');
        });

        card.addEventListener('dragover', (e) => {
            e.preventDefault();
            card.classList.add('active-drop');
          });
    
        card.addEventListener('dragend', () => {
          card.classList.remove('dragging');
        });

        card.addEventListener('dragleave', () => {
          card.classList.remove('active-drop');
        });

        card.addEventListener('drop', () => {
            card.classList.remove('active-drop');
            const dropIndex = parseInt(card.dataset.dropIndex);
            if (draggedIndex !== null && draggedIndex !== dropIndex) {
                const oldItem = guessOrder[draggedIndex];
                guessOrder[draggedIndex] = guessOrder[dropIndex];
                guessOrder[dropIndex] = oldItem;
                displayCharacters();
            }
        });
      });
    
      dropZones.forEach(zone => {
        zone.addEventListener('dragover', (e) => {
          e.preventDefault();
          zone.classList.add('active-drop');
        });
    
        zone.addEventListener('dragleave', () => {
          zone.classList.remove('active-drop');
        });
    
        zone.addEventListener('drop', () => {
          zone.classList.remove('active-drop');
    
          const dropIndex = parseInt(zone.dataset.dropIndex);
          if (draggedIndex !== null && draggedIndex !== dropIndex) {
            const draggedItem = guessOrder[draggedIndex];
            guessOrder.splice(draggedIndex, 1);
            const insertAt = draggedIndex < dropIndex ? dropIndex - 1 : dropIndex;
            guessOrder.splice(insertAt, 0, draggedItem);
            displayCharacters();
          }
        });
      });
    }

function shuffle(array) {
  // Fisher–Yates shuffle
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

window.addEventListener('DOMContentLoaded', () => {
  // small visual fix for slider when refreshing page
  const slider = document.getElementById('slider');
  const sliderValue = document.getElementById('sliderValue');

  // Force slider and display to match your default (2)
  slider.value = 2;
  sliderValue.textContent = '2';
});


function setupStartButtons(){
    const content = document.getElementById("content");
    const startDaily = document.getElementById("startDaily");
    const startMale = document.getElementById("startMale");
    const startFemale = document.getElementById("startFemale");
    const hintCount = document.getElementById("hints");

    startDaily.addEventListener("click", function (){
        content.classList.remove("hidden");   // show the content
        startDaily.classList.add("hidden");    // hide the button again
        startMale.classList.add("hidden");    // hide the button again
        startFemale.classList.add("hidden");    // hide the button again
        hintCount.innerText = `Number of Hints: ${numberOfHints}`;
        document.getElementById('difficulty').style.display = 'none';
        loadCharacters("All");
    });

    startMale.addEventListener("click", function (){
        content.classList.remove("hidden");   // show the content
        startDaily.classList.add("hidden");    // hide the button again
        startMale.classList.add("hidden");    // hide the button again
        startFemale.classList.add("hidden");    // hide the button again
        hintCount.innerText = `Number of Hints: ${numberOfHints}`;
        document.getElementById('difficulty').style.display = 'none';
        loadCharacters("Male");
    });

    startFemale.addEventListener("click", function (){
        content.classList.remove("hidden");   // show the content
        startDaily.classList.add("hidden");    // hide the button again
        startMale.classList.add("hidden");    // hide the button again
        startFemale.classList.add("hidden");    // hide the button again
        hintCount.innerText = `Number of Hints: ${numberOfHints}`;
        document.getElementById('difficulty').style.display = 'none';
        loadCharacters("Female");
    });
}

function displayHistory(idx) {
  const historyContainer = document.getElementById(`guessHistory${idx}`);
  historyContainer.innerHTML = ''; // Clear previous

  guessOrder.forEach((char, index) => {
    const div = document.createElement('div');
    div.className = 'mini-card';
    div.setAttribute('data-index', index); // for tracking drag index
    div.dataset.dropIndex = index;
    div.innerHTML = `
      <img src="${char.image}" alt="${char.name}">
    `;
    historyContainer.appendChild(div);
  });

  // Add Counts of Right
  const button_right = document.createElement('button');
  button_right.className = 'hint-card';
  button_right.style.backgroundColor = guessColorMapping[0];
  button_right.innerHTML = `
      <p>${correctCount}</p>
    `;
  historyContainer.appendChild(button_right);

  // Add Counts of Close
  const button_close = document.createElement('button');
  button_close.className = 'hint-card';
  button_close.style.backgroundColor = guessColorMapping[1];
  button_close.innerHTML = `
      <p>${closeCount}</p>
    `;
  historyContainer.appendChild(button_close);

  // Add Counts of Wrong
  const button_wrong = document.createElement('button');
  button_wrong.className = 'hint-card';
  button_wrong.style.backgroundColor = guessColorMapping[2];

  button_wrong.innerHTML = `
      <p>${wrongCount}</p>
    `;
  historyContainer.appendChild(button_wrong);

  // disable buttons if no hints when revealing new history
  if (numberOfHints <= 0){
    document.querySelectorAll('.hint-card').forEach(card => {
      card.classList.add('disabled-hint');
    });
  }

  // Add functionality to Buttons
  const miniCards = historyContainer.querySelectorAll('.mini-card');
  let currentResultHistory = (idx == 0) ? guessHistoryResults0 : guessHistoryResults1;
  const hintCount = document.getElementById("hints");

  // Right Reveal Buttons
  button_right.addEventListener('click', () => {
    // hints left and would reveal something
    if (numberOfHints > 0 && parseInt(button_right.innerText) != 0){
    miniCards.forEach((card, i) => {
      if (currentResultHistory[i] == 0){
        card.style.backgroundColor = guessColorMapping[0];
        // write which history was used
        usedHintIndices[maxNumberOfHints-numberOfHints] = idx;
        usedHintType[maxNumberOfHints-numberOfHints] = 0;
        // this is used to know that any other guess is wrong at this position
        correctRevealed[i] = true;
      }
    });
    numberOfHints--;
    hintCount.innerText = `Number of Hints: ${numberOfHints}`;

    // disable button if it was already pressed
    button_right.classList.add('disabled-hint');

    // disable button if no more hints available
    if (numberOfHints <= 0){
      document.querySelectorAll('.hint-card').forEach(card => {
        card.classList.add('disabled-hint');
      });
    }
    displayCharacters();
    }
  });

  // Close Reveal Buttons
  button_close.addEventListener('click', () => {
    if (numberOfHints > 0 && parseInt(button_close.innerText) != 0){
    miniCards.forEach((card, i) => {
      if (currentResultHistory[i] == 1){
        card.style.backgroundColor = guessColorMapping[1];
        usedHintIndices[maxNumberOfHints-numberOfHints] = idx;
        usedHintType[maxNumberOfHints-numberOfHints] = 1;
      }
    });
    numberOfHints--;
    hintCount.innerText = `Number of Hints: ${numberOfHints}`;

    // disable button if it was already pressed
    button_close.classList.add('disabled-hint');
    // removed dotted lines if no more hints available
    if (numberOfHints <= 0){
      document.querySelectorAll('.hint-card').forEach(card => {
        card.classList.add('disabled-hint');
      });
    }
    displayCharacters();
    }
  });

  // Wrong Reveal Buttons
  button_wrong.addEventListener('click', () => {
    if (numberOfHints > 0 && parseInt(button_wrong.innerText) != 0){
    miniCards.forEach((card, i) => {
      if (currentResultHistory[i] == 2){
        card.style.backgroundColor = guessColorMapping[2];
        usedHintIndices[maxNumberOfHints-numberOfHints] = idx;
        usedHintType[maxNumberOfHints-numberOfHints] = 2;
      }
    });
    numberOfHints--;
    hintCount.innerText = `Number of Hints: ${numberOfHints}`;
    // disable button if it was already pressed
    button_wrong.classList.add('disabled-hint');
    // removed dotted lines if no more hints available
    if (numberOfHints <= 0){
      document.querySelectorAll('.hint-card').forEach(card => {
        card.classList.add('disabled-hint');
      });
    }
    displayCharacters();
    }
  });
}

const guessMapping = {
  0: '✅',
  1: '🟡',
  2: '❌',
  3: '❓'
};

const guessColorMapping = {
  0: '#a6dda8',
  1: '#e2df41b7',
  2: '#d63520b7',
  3: '#fff'
}

function pastGuessesToString(char){
  relevantGuesses = char.pastGuesses;
  guessString = relevantGuesses.map(num => guessMapping[num]).join("");
  return guessString;
}

function displayFinalScreen(wonFlag){
  const finalCharacterCards = Array.from(document.getElementsByClassName('character-card'));

  finalCharacterCards.forEach((card, i) => {
    // Create Age Texts
    const div = document.createElement('div');
    div.innerText = `Age: ${guessOrder[i].age}`;
    div.className = "ageText";
    card.appendChild(div);

    // Change background color according to position
    let currentGuessHistoryRes = guessHistoryResults0;
    if (guessCount == 0){
      currentGuessHistoryRes = guessHistoryResults0;
    }
    else if (guessCount == 1){
      currentGuessHistoryRes = guessHistoryResults1;
    }
    else if (guessCount == 2){
      currentGuessHistoryRes = finalGuessHistoryResults;
    }
    card.style.backgroundColor = guessColorMapping[currentGuessHistoryRes[i]];
  });

  // Disable all buttons
  const uiBlocker = document.createElement('div');
  uiBlocker.id = "ui-blocker";
  document.getElementById('game-container').appendChild(uiBlocker);

  const headerBlock = document.getElementById('header');
  headerBlock.innerText = wonFlag ? "You Won!!!" : "You Lost :("
}

setupStartButtons();
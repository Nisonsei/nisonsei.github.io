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
      <p id="pastGuesses">${pastGuessesToString(char)}<\p>
    `;
    // dynamically change background color according to past information
    div.style.backgroundColor = guessColorMapping[char.pastGuesses[index]];

    // if real position is already guesses, also show green
    if (char.pastGuesses.includes(0) && realOrder.findIndex(character => character.name == char.name) != index){
      div.style.backgroundColor = guessColorMapping[2];
    }
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


function setupStartButtons(){
    const content = document.getElementById("content");
    const startDaily = document.getElementById("startDaily");
    const startMale = document.getElementById("startMale");
    const startFemale = document.getElementById("startFemale");

    startDaily.addEventListener("click", function (){
        content.classList.remove("hidden");   // show the content
        startDaily.classList.add("hidden");    // hide the button again
        startMale.classList.add("hidden");    // hide the button again
        startFemale.classList.add("hidden");    // hide the button again
        loadCharacters("All");
    });

    startMale.addEventListener("click", function (){
        content.classList.remove("hidden");   // show the content
        startDaily.classList.add("hidden");    // hide the button again
        startMale.classList.add("hidden");    // hide the button again
        startFemale.classList.add("hidden");    // hide the button again
        loadCharacters("Male");
    });

    startFemale.addEventListener("click", function (){
        content.classList.remove("hidden");   // show the content
        startDaily.classList.add("hidden");    // hide the button again
        startMale.classList.add("hidden");    // hide the button again
        startFemale.classList.add("hidden");    // hide the button again
        loadCharacters("Female");
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

setupStartButtons();
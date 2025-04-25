let numCharacters = 8;
let closeThreshold = 1;
let maxGuesses = 2;
let correctCount = 0;
let closeCount = 0;
let wrongCount = 0;
let numberOfHints = 2;
let maxNumberOfHints = 2;

// TODO: Add third row of guesses and increase max Guesses to 3

// Results of History
let guessHistoryResults0 = new Array(numCharacters).fill(3);
let guessHistoryResults1 = new Array(numCharacters).fill(3);
// Actual History
let guessHistory0 = new Array(numCharacters).fill(3);
let guessHistory1 = new Array(numCharacters).fill(3);

// Flags for revealed Hints. Used to highlight colors when reordering after using a hint
// TODO: this is bugged: need to also track of which hint was taken
let correctRevealed = new Array(numCharacters).fill(false);

// In which history was which hint used
let usedHintIndices = new Array(maxNumberOfHints).fill(-1);
// Which type of hint was used (0: correct, 1: close, 2: wrong)
let usedHintType = new Array(maxNumberOfHints).fill(-1);

async function loadCharacters(gender) {
    const response = await fetch('data/filtered_characters.json');
    allCharacters = await response.json();

    if(gender == "Male"){
        allCharacters = allCharacters.filter(data => data.gender == "Male")
    }
    else if(gender == "Female"){
        allCharacters = allCharacters.filter(data => data.gender == "Female")
    }
  
    // Pick 5 characters at random  
    // TODO: add a better sampling logic (one or two harder characters and no duplicate ages!)
    // TODO: add daily mode basing seed on date
    characters = shuffle([...allCharacters]).slice(0, numCharacters);
    guessOrder = [...characters]; // initial order = random
    realOrder = characters.sort((a, b) => parseInt(a.age) - parseInt(b.age));

    // initialize past guesses
    // 0 is correct, 1 is close, 2 is wrong and 3 was never guessed
    guessOrder.forEach(obj => {
        obj.pastGuesses = new Array(numCharacters).fill(3);
    });
  
    displayCharacters();
  }

document.getElementById('shuffle-button').addEventListener('click', () => {
guessOrder = shuffle([...guessOrder]);
displayCharacters();
});

document.getElementById('guess-button').addEventListener('click', () => {
if (guessCount == maxGuesses){
    // TODO: add victory screen, real ages

    // show colors of results
    correctRevealed = new Array(numCharacters).fill(true);
}
evaluateGuesses(guessCount);
/* const correct = [...characters].sort((a, b) => a.age - b.age);
const feedback = guessOrder.map((char, i) => {
    const correctIndex = correct.findIndex(c => c.name === char.name);
    if (i === correctIndex) return '✅';
    else if (Math.abs(i - correctIndex) <= 2) return '🟡';
    else return '❌';
}); 
alert("Feedback:\n" + feedback.join(" "));
*/
// first guess
if (guessCount < maxGuesses) {
    displayHistory(guessCount);
}
// second guess
if (guessCount == maxGuesses-1){
    // Change Text from Guess to Final Guess
    document.getElementById('guess-button').innerText = "Final Guess";
}
guessCount++;
// const numOfGuesses = document.getElementById('numOfGuesses');
// numOfGuesses.textContent = "Number of Guesses: " + guessCount;
displayCharacters();

//reset counts
correctCount = 0;
closeCount = 0;
wrongCount = 0;
});

function evaluateGuesses(turn){
    let currentGuessResultHistory = new Array(numCharacters).fill(3);
    let currentGuessHistory = new Array(numCharacters).fill(3);
    guessOrder.forEach((char, index) => {
        const realIndex = realOrder.findIndex(character => character.name == char.name);

        // check how close guess is
        if(realIndex == index){
            // perfect Guess!
            char.pastGuesses[index] = 0;
            correctCount++;
            currentGuessResultHistory[index] = 0;
        }
        else if(Math.abs(realIndex - index) <= closeThreshold){
            // close Guess!
            char.pastGuesses[index] = 1;
            closeCount++;
            currentGuessResultHistory[index] = 1;
        }
        else{
            // Wrong Guess!
            char.pastGuesses[index] = 2;
            wrongCount++;
            currentGuessResultHistory[index] = 2;
        }

        // Track Char in History
        currentGuessHistory[index] = char;
    });

    if (turn == 0){
        guessHistoryResults0 = currentGuessResultHistory;
        guessHistory0 = currentGuessHistory;
    }
    else if (turn == 1){
        guessHistoryResults1 = currentGuessResultHistory;
        guessHistory1 = currentGuessHistory;
    }
}
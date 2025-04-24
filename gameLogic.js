let numCharacters = 8;
let closeThreshold = 0; // TODO: set to 0-3 for hard/easy mode

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
evaluateGuesses();
/* const correct = [...characters].sort((a, b) => a.age - b.age);
const feedback = guessOrder.map((char, i) => {
    const correctIndex = correct.findIndex(c => c.name === char.name);
    if (i === correctIndex) return '✅';
    else if (Math.abs(i - correctIndex) <= 2) return '🟡';
    else return '❌';
}); 
alert("Feedback:\n" + feedback.join(" "));
*/
guessCount++;
const numOfGuesses = document.getElementById('numOfGuesses');
numOfGuesses.textContent = "Number of Guesses: " + guessCount;
displayCharacters();
});

function evaluateGuesses(){
    guessOrder.forEach((char, index) => {
        const realIndex = realOrder.findIndex(character => character.name == char.name);

        // check how close guess is
        if(realIndex == index){
            // perfect Guess!
            char.pastGuesses[index] = 0;
        }
        else if(Math.abs(realIndex - index) <= closeThreshold){
            // close Guess!
            char.pastGuesses[index] = 1;
        }
        else{
            // Wrong Guess!
            char.pastGuesses[index] = 2;
        }
    });
}
async function loadCharacters(gender) {
    const response = await fetch('data/filtered_characters.json');
    allCharacters = await response.json();

    if(gender == "Male"){
        allCharacters = allCharacters.filter(data => data.gender == "Male")
    }
    else if(gender == "Female"){
        allCharacters = allCharacters.filter(data => data.gender == "Female")
    }
  
    // Pick 5 characters at random  TODO: add a better sampling logic (one or two harder characters and no duplicate ages!)
    characters = shuffle([...allCharacters]).slice(0, 7);
    guessOrder = [...characters]; // initial order = random
    realOrder = characters.sort((a, b) => parseInt(a.age) - parseInt(b.age));
  
    displayCharacters();
  }


document.getElementById('shuffle-button').addEventListener('click', () => {
guessOrder = shuffle([...guessOrder]);
displayCharacters();
});

document.getElementById('guess-button').addEventListener('click', () => {
const correct = [...characters].sort((a, b) => a.age - b.age);
const feedback = guessOrder.map((char, i) => {
    const correctIndex = correct.findIndex(c => c.name === char.name);
    if (i === correctIndex) return '✅';
    else if (Math.abs(i - correctIndex) <= 2) return '🟡';
    else return '❌';
});
guessCount++;
const numOfGuesses = document.getElementById('numOfGuesses');
numOfGuesses.textContent = "Number of Guesses: " + guessCount;
alert("Feedback:\n" + feedback.join(" "));
});
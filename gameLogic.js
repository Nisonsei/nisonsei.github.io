async function loadCharacters() {
    const response = await fetch('data/filtered_characters.json');
    const allCharacters = await response.json();
  
    // Pick 5 characters at random
    characters = shuffle([...allCharacters]).slice(0, 7);
    guessOrder = [...characters]; // initial order = random
  
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
alert("Feedback:\n" + feedback.join(" "));
});
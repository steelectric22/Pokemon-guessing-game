const genBounds = [
  0,     // unused (so gen 1 is at index 1)
  1,     // Gen 1 start dex number
  152,   // Gen 2 start dex number
  252,   // Gen 3 start dex number
  387,   // Gen 4 start dex number
  494,   // Gen 5 start dex number
  650,   // Gen 6 start dex number
  722,   // Gen 7 start dex number
  810,   // Gen 8 start dex number
  906,   // Gen 9 start dex number
  1025   // One past the last dex
];

let low, high, difficulty, mode;
let playing = false;
let currentPokemonIndex;
let numCorrect = 0;
let totalGuesses = 0;
let currentGuesses = new Set();

const infoDiv = document.getElementById("info");
const messageDiv = document.getElementById("message");
const accuracyDiv = document.getElementById("accuracy");
const guessInput = document.getElementById("guessInput");
const guessBtn = document.getElementById("guessBtn");
const startBtn = document.getElementById("startBtn");
const nexBtn = document.getElementById("nextBtn");
const endBtn = document.getElementById("endBtn");
const idkBtn = document.getElementById("idkBtn");
const backBtn = document.getElementById("backBtn");


backBtn.onclick = function(){
    window.location.href = "index.html";
}

startBtn.onclick = function(){
    const startGen = parseInt(document.getElementById("startGen").value);
    const endGen = parseInt(document.getElementById("endGen").value);
    difficulty = parseInt(document.getElementById("difficulty").value);
    mode = parseInt(document.getElementById("mode").value);
    document.getElementById("endBtn").style.display = "inline-block";

    // allow inputs
    guessInput.value = "";
    guessInput.style.display = "inline-block";
    guessBtn.style.display = "inline-block";
    guessInput.disabled = false;  
    guessBtn.disabled = false;       



    if (endGen < startGen){
        alert("End gen can't be before the starting gen!");
        return;
    }

    document.getElementById("startGen").disabled = true;
    document.getElementById("endGen").disabled = true;
    document.getElementById("difficulty").disabled = true;
    document.getElementById("mode").disabled = true;

    low = genBounds[startGen] - 1;
    high = genBounds[endGen + 1] - 2;

    playing = true;
    numCorrect = 0;
    totalGuesses = 0;
    messageDiv.textContent = "";
    accuracyDiv.textContent = "";
    guessInput.value = "";
    guessInput.style.display = "inline-block";
    guessBtn.style.display = "inline-block";

    if (mode === 2) {
        idkBtn.style.display = "inline-block"; // show give up button
    } 
    else {
        idkBtn.style.display = "none"; // hide in Mode 1
    }


    nextPokemon();
};
idkBtn.onclick = function(){
    const currentPokemon = allPokemon[currentPokemonIndex];
    messageDiv.textContent = `The correct answer was ${currentPokemon.name}`;
    updateAccuracy();
    guessInput.value = "";
    nextBtn.disabled = false;
    idkBtn.disabled = true;
    nextBtn.style.display = "inline-block";
    totalGuesses++;
    updateAccuracy();

};

function nextPokemon(){
    if (!playing){
        return;
    }
    currentGuesses.clear();
    currentPokemonIndex = Math.floor(Math.random() * (high - low + 1)) + low;

    
    const p = allPokemon[currentPokemonIndex];

    if (difficulty === 1){
        infoDiv.textContent = `Dex # ${p.dex} | Type(s): ${p.type}`;
    }
    if (difficulty === 2){
        infoDiv.textContent = `Dex # ${p.dex}`;
    }
    

    if (mode === 2){
        idkBtn.disabled = false;
    }

}

guessBtn.onclick = function(){
    if (!playing){
        return;
    }
    
    const guess = guessInput.value.trim();

    if (!guess){
        messageDiv.textContent = "Please enter a guess";
        return;
    }

    if (currentGuesses.has(guess)){
        messageDiv.textContent = "You already guessed that";
        guessInput.value = "";
        return;
    }

    currentGuesses.add(guess);

    const currentPokemon = allPokemon[currentPokemonIndex];
    const actualName = currentPokemon.name.toUpperCase();
    const userGuess = guess.toUpperCase();

    nextBtn.style.display = "inline-block";
    
    // one guess
    if (mode === 1){
        totalGuesses++;
        guessInput.disabled = true;
        guessBtn.disabled = true;
        if (userGuess == actualName){
            messageDiv.textContent = "Correct!";
            numCorrect++;
            updateAccuracy();
        }
        else{
            messageDiv.textContent = `Incorrect! Correct answer was ${currentPokemon.name}`;
            updateAccuracy();
        }
    }
    // guess until correct
    if (mode === 2){
        totalGuesses++;
        nextBtn.disabled = true;
        if (userGuess == actualName){
            messageDiv.textContent = "Correct!";
            numCorrect++;
            updateAccuracy();
            guessInput.disabled = true;
            guessBtn.disabled = true;
            idkBtn.disabled = true;
            nextBtn.disabled = false;
        }
        else{
            let guessDex = null;
            for (let p of allPokemon){
                if (p.name.toUpperCase() === userGuess){
                    guessDex = p.dex;
                    break;
                }
            }
            if (guessDex === null){
                messageDiv.textContent = "Incorrect and not a valid pokemon name";
            }
            else if (guessDex > currentPokemon.dex){
                messageDiv.textContent = "Too high!";
            }
            else if (guessDex < currentPokemon.dex){
                messageDiv.textContent = "Too low!";
            }
            else{
                messageDiv.textContent = "Incorrect!";
            }
            updateAccuracy();
        }
    }
    guessInput.value = "";
};
nextBtn.onclick = function(){
    // hide the next button
    nextBtn.style.display = "none";

    guessInput.disabled = false;
    guessBtn.disabled = false;
    idkBtn.disabled = false;
    
    messageDiv.textContent = ""; // clear message
    guessInput.value = "";       // clear input
    
    nextPokemon();  // pick next Pokémon and update infoDiv



};

guessInput.addEventListener("keydown", function(event){
    if (event.key === "Enter"){
        event.preventDefault();
        guessBtn.click();
    }
});

endBtn.onclick = function(){
    if (playing){
        endGame();
        endBtn.style.display = "none"; // hide the end game button after game ends
        startBtn.style.display = "inline-block"; // optionally show start button to restart
    }

};

function updateAccuracy(){
    accuracyDiv.textContent = `Accuracy: ${((numCorrect / totalGuesses) * 100).toFixed(1)}%`
}

function endGame(){
    playing = false;
    infoDiv.textContent = "";
    messageDiv.textContent = `Game ended! Final accuracy: ${((numCorrect / totalGuesses) * 100).toFixed(1)}%`;
    accuracyDiv.textContent = "";
    guessInput.style.display = "none";
    guessBtn.style.display = "none";

    document.getElementById("startGen").disabled = false;
    document.getElementById("endGen").disabled = false;
    document.getElementById("difficulty").disabled = false;
    document.getElementById("mode").disabled = false;
    document.getElementById("endBtn").style.display = "none";
    document.getElementById("nextBtn").style.display = "none";
    document.getElementById("idkBtn").style.display = "none";

    backBtn.style.display = "inline-block";
}

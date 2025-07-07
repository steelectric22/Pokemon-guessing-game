const letters = [
  0, // unused for 1-based indexing if you want
  "A","B","C","D","E","F","G","H","I","J","K","L","M",
  "N","O","P","Q","R","S","T","U","V","W","X","Y","Z"
];

const types = [
  0,
  "normal", "fire", "water", "grass", "electric", "ice", "fighting", 
  "poison", "ground", "flying", "psychic", "bug", "rock", "ghost", 
  "dragon", "dark", "steel", "fairy"
];

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
let gameType, gameMode;
let playing = false;
let numCorrect = 0;
let totalGuesses = 0;

let currentLetter = null;
let currentType = null;
let currentGen = null;
let correctPokemon = [];

const infoDiv = document.getElementById("info");
const messageDiv = document.getElementById("message");
const accuracyDiv = document.getElementById("accuracy");
const guessInput = document.getElementById("guessInput");
const guessBtn = document.getElementById("guessBtn");
const startBtn = document.getElementById("startBtn");
const idkBtn = document.getElementById("idkBtn");
const nextBtn = document.getElementById("nextBtn");
const endBtn = document.getElementById("endBtn");
const backBtn = document.getElementById("backBtn");


backBtn.onclick = function(){
    window.location.href = "index.html";
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function prepareChallenge() {
    guessInput.value = "";
    guessInput.disabled = false;
    guessBtn.disabled = false;
    messageDiv.textContent = "";
    nextBtn.style.display = "none";
    idkBtn.disabled = false;
    if (gameMode === 2){
        idkBtn.style.display = "inline-block";
    }
    else{
        idkBtn.style.display = "none";
    }

    
    currentLetter = letters[randomInt(1, 26)];

    // pick random type
    if (gameType === 1) {
        currentType = types[randomInt(1, 18)];
        // filter Pokémon matching letter + type
        correctPokemon = allPokemon.filter(p => 
        p.name[0].toUpperCase() === currentLetter && p.type.includes(currentType)
        ).map(p => p.name.toUpperCase());

        if (correctPokemon.length === 0){
            prepareChallenge();
            return;
        }
        infoDiv.textContent = `Guess Pokemon starting with "${currentLetter}" and type "${currentType}"`;
    } 
    //pick random gen
    else if (gameType === 2) {
        currentGen = randomInt(1, 9);
        // filter Pokémon matching letter + gen range
        correctPokemon = allPokemon.filter(p =>
        p.name[0].toUpperCase() === currentLetter &&
        p.dex >= genBounds[currentGen] &&
        p.dex < genBounds[currentGen + 1]
        ).map(p => p.name.toUpperCase());
        
        if (correctPokemon.length === 0){
            prepareChallenge();
            return;
        }

        infoDiv.textContent = `Guess Pokemon starting with "${currentLetter}" and in Gen ${currentGen}`;
     }

};

//get game ready
startBtn.onclick = function() {
    gameType = parseInt(document.getElementById("gameType").value);
    gameMode = parseInt(document.getElementById("gameMode").value);

    document.getElementById("gameType").disabled = true;
    document.getElementById("gameMode").disabled = true;
    startBtn.disabled = true;

    playing = true;
    numCorrect = 0;
    totalGuesses = 0;
    accuracyDiv.textContent = "";
    guessInput.style.display = "inline-block";
    guessBtn.style.display = "inline-block";
    
    if (gameMode === 2){
        idkBtn.style.display = "inline-block";
    }
    else{
        idkBtn.style.display = "none";
    }

    nextBtn.style.display = "none";
    endBtn.style.display = "inline-block";
    messageDiv.textContent = "";
    infoDiv.textContent = "";

    prepareChallenge();
};

guessBtn.onclick = function() {
    if (!playing) return;

    let guess = guessInput.value.trim().toUpperCase();
    
    if (!guess) {
        messageDiv.textContent = "Please enter a guess";
        return;
    }

    totalGuesses++;

    if (correctPokemon.includes(guess)) {
        messageDiv.textContent = "Correct!";
        numCorrect++;

        if (gameMode === 1) {
            // Show all correct answers after guess in mode 1
            messageDiv.textContent += ` The correct Pokémon were: ${correctPokemon.join(", ")}`;
            updateAccuracy();
            guessInput.disabled = true;
            guessBtn.disabled = true;
            idkBtn.disabled = true;
            nextBtn.style.display = "inline-block";
        } 
        else {
            // Remove guessed Pokémon for mode 2
             correctPokemon = correctPokemon.filter(p => p !== guess);
            updateAccuracy();
            messageDiv.textContent += ` Remaining Pokémon to guess: ${correctPokemon.length}`;
            if (correctPokemon.length === 0) {
                messageDiv.textContent += " You guessed all!";
                guessInput.disabled = true;
                guessBtn.disabled = true;
                idkBtn.disabled = true;
                nextBtn.style.display = "inline-block";
            }
        }
    } 
    else {
        messageDiv.textContent = "Incorrect";
        updateAccuracy();
    }
    guessInput.value = "";
};

idkBtn.onclick = function() {
    if (!playing || gameMode !== 2) return;

    messageDiv.textContent = `The correct Pokémon were: ${correctPokemon.join(", ")}`;
    totalGuesses += correctPokemon.length;
    correctPokemon = [];
    updateAccuracy();

    guessInput.disabled = true;
    guessBtn.disabled = true;
    idkBtn.disabled = true;
    nextBtn.style.display = "inline-block";
    };


nextBtn.onclick = function() {
    if (!playing) return;
    prepareChallenge();
};

guessInput.addEventListener("keydown", function(event){
    if (event.key === "Enter"){
        event.preventDefault();
        guessBtn.click();
    }
});

endBtn.onclick = function() {
    playing = false;
    infoDiv.textContent = "";
    messageDiv.textContent = `Game ended! Final accuracy: ${((numCorrect / totalGuesses) * 100).toFixed(1)}%`;
    accuracyDiv.textContent = "";
    guessInput.style.display = "none";
    guessBtn.style.display = "none";
    idkBtn.style.display = "none";
    nextBtn.style.display = "none";
    endBtn.style.display = "none";
    startBtn.disabled = false;
    document.getElementById("gameType").disabled = false;
    document.getElementById("gameMode").disabled = false;
    backBtn.style.display = "inline-block";
};

function updateAccuracy() {
    if (totalGuesses === 0) {
        accuracyDiv.textContent = "Accuracy: 0%";
    } else {
        accuracyDiv.textContent = `Accuracy: ${((numCorrect / totalGuesses) * 100).toFixed(1)}%`;
    }
}

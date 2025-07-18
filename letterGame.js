const letters = [
  0, 
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
let correctGuesses = new Set();

let letterIndex = 0;
let answersPerLetter = [];
let currentLetterAnswer = null;

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
const hintDiv = document.getElementById("hint");


backBtn.onclick = function(){
    window.location.href = "index.html";
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// disables the second dropdown if user wants to do A-z challenge
document.getElementById("gameType").addEventListener("change", function () {
    const selectedGameType = parseInt(this.value);
    const gameModeSelect = document.getElementById("gameMode");

    if (selectedGameType === 3) {
        gameModeSelect.innerHTML = '<option value="1">Guess One</option>';
        gameModeSelect.disabled = true;
    } else {
        gameModeSelect.innerHTML = 
            `<option value="1">Guess One</option>
            <option value="2">Keep Guessing</option>`;
        gameModeSelect.disabled = false;
    }
});

function prepareChallenge() {
    correctGuesses.clear();
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
        // filter Pokemon matching letter + type
        correctPokemon = allPokemon.filter(p => 
        p.name[0].toUpperCase() === currentLetter && p.type.includes(currentType));

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
        p.dex < genBounds[currentGen + 1]);
        
        if (correctPokemon.length === 0){
            prepareChallenge();
            return;
        }

        infoDiv.textContent = `Guess Pokemon starting with "${currentLetter}" and in Gen ${currentGen}`;
     }

};

function prepareAZChallenge(){
    letterIndex = 0;
    correctGuesses.clear();
    guessInput.value = "";
    guessInput.disabled = false;
    guessBtn.disabled = false;
    messageDiv.textContent = "";
    nextBtn.style.display = "none";
    idkBtn.disabled = false;
    idkBtn.style.display = "none";
    
    currentType = types[randomInt(1, 18)];
    answersPerLetter = [];
    
    loadAZChallenge();
};

function loadAZChallenge(){

    if (letterIndex > 26){
        messageDiv.textContent = "You’ve completed all letters!";
        endBtn.click();
        hintBtn.disabled = true;
        return;
    }
    
    messageDiv.textContent = "";
    currentLetter = letters[letterIndex];
    correctPokemon = allPokemon.filter(p => 
        p.name[0].toUpperCase() === currentLetter && p.type.includes(currentType));
    
    if (correctPokemon.length === 0){
      letterIndex++;
      loadAZChallenge();
      return;
    }
    
    infoDiv.textContent = `Type: ${currentType} | Guess a Pokemon starting with "${currentLetter}"`;
    guessInput.disabled = false;
    guessBtn.disabled = false;
    nextBtn.style.display = "none";
    guessInput.focus();
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
    hintBtn.style.display = "inline-block";
    
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
    
    if (gameType === 3){
        prepareAZChallenge();
    }
    else{
        prepareChallenge();
    }
    guessInput.focus();
};

hintBtn.onclick = function() {
    
    const unGuessed = correctPokemon.filter(p => !correctGuesses.has(p));
    
    if (unGuessed.length === 0){
      return;
    }
    else{
      const randomIndex = randomInt(0, unGuessed.length - 1);
      const hintPokemon = unGuessed[randomIndex];
      hintDiv.textContent = `A correct pokemon has the secondary type: ${hintPokemon.type}`;
  
    }
    
    

};

guessBtn.onclick = function() {
    if (!playing) return;

    let guess = guessInput.value.trim().toUpperCase();
    
    if (!guess) {
        messageDiv.textContent = "Please enter a guess";
        return;
    }
    
    if (correctGuesses.has(guess)){
        messageDiv.textContent = "You already guessed that";
        guessInput.value = "";
        return;
    }
    
    totalGuesses++;
    hintDiv.textContent = "";


      if (correctPokemon.some(p => p.name.toUpperCase() === guess)) {
          messageDiv.textContent = "Correct!";
          numCorrect++;
          
          correctGuesses.add(guess);
          
  
          if (gameMode === 1 || gameType === 3) {
              // Show all correct answers after guess in mode 1
              messageDiv.textContent = ` The correct Pokemon were: ${correctPokemon.map(p => p.name).join(", ")}`;
              updateAccuracy();
              guessInput.disabled = true;
              guessBtn.disabled = true;
              idkBtn.disabled = true;
              nextBtn.style.display = "inline-block";
          } 
          else {
              // Remove guessed Pokémon for mode 2
              correctPokemon = correctPokemon.filter(p => p.name.toUpperCase() !== guess);
              updateAccuracy();
              messageDiv.textContent += ` Remaining Pokemon to guess: ${correctPokemon.length}`;
              if (correctPokemon.length === 0) {
                  messageDiv.textContent += " You guessed all the possible Pokemon!";
                  guessInput.disabled = true;
                  guessBtn.disabled = true;
                  idkBtn.disabled = true;
                  nextBtn.style.display = "inline-block";
              }
          }
      } 
      else {
          if (gameMode === 1 || gameType === 3){
            messageDiv.textContent = `Incorrect. The correct Pokemon were: ${correctPokemon.map(p => p.name).join(", ")}`;
            updateAccuracy();
            
            guessInput.disabled = true;
            guessBtn.disabled = true;
            idkBtn.disabled = true;
            
            nextBtn.style.display = "inline-block";
          }
          else{
             messageDiv.textContent = "Incorrect.";
             updateAccuracy();
          }
      }

    guessInput.value = "";
};

idkBtn.onclick = function() {
    if (!playing || gameMode !== 2) return;

    messageDiv.textContent = `The correct Pokemon were: ${correctPokemon.map(p => p.name).join(", ")}`;
    totalGuesses += correctPokemon.length;
    correctPokemon = [];
    updateAccuracy();

    guessInput.disabled = true;
    guessBtn.disabled = true;
    idkBtn.disabled = true;
    nextBtn.style.display = "inline-block";

    guessInput.focus();
    };


nextBtn.onclick = function() {
    if (!playing) return;
    if (gameType === 3){
        letterIndex++;
        loadAZChallenge();
    }
    else{
      prepareChallenge();
    }
    guessInput.focus();
};

document.addEventListener("keydown", function(event){
    if (event.key === "Enter"){
        event.preventDefault();
        if (!guessInput.disabled && guessBtn.style.display !== "none") {
            guessBtn.click();
        } 
        else if (guessInput.disabled && !nextBtn.disabled && nextBtn.style.display !== "none") {
            nextBtn.click();
        }
         
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
    hintBtn.style.display = "none";
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

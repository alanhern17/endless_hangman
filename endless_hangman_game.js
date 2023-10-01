import { generate } from "/random_word_generator.js";

const emotes = ['img/Worried_Emoji.png', 'img/Anguished_Emoji.png', 'img/Sweat_Emoji.png',
    'img/Tired_Face.png', 'img/Weary_Face.png', 'img/Dizzy_Emoji.png'];

const hangman = document.getElementById('hangman');
const gameStatus = document.getElementById('gameStatus');
const guesses = document.getElementById('guesses');
const myStrikes = document.getElementById('myStrikes');
const myMultiplier = document.getElementById('myMultiplier');
const myScore = document.getElementById('myScore');
const myTyping = document.getElementById('myTyping');

let randWord = '';
let myWord = '';
let myString = ''
let gameStarted = false;
let strikes = 6;
let score = 0;
let multiplier = 1;
let wrongGuesses = '';
let hangmanIndex = 0;

export function startNewGame() {
    randWord = '';
    myWord = '';
    myString = ''
    gameStarted = true;
    strikes = 6;
    score = 0;
    multiplier = 1;
    wrongGuesses = '';
    guesses.innerText = "Wrong Guesses: ";
    myStrikes.innerText = 'Strikes left: ' + strikes;
    myMultiplier.innerText = "Multiplier: x" + multiplier;
    myScore.innerText = "Score: " + score;
    gameStatus.innerText = "Guess the Word!";
    generateWord();
    resetHangman();
}

function generateWord() {
    randWord = generate();
    //console.log(randWord);
    myWord = '';
    for (const l of randWord) {//Creates string of blanks of equal length as randWord for comparison
        myWord += '_';
        generateString();
    }
}

function generateString() { //creates string to display on screen based on letters guessed with blanks for unguessed letters
    myString = ''
    for (const s of myWord) {
        myString += s + ' ';
    }
    myTyping.innerText = "Your Word: " + myString;
}

function checkStrikes() {
    myStrikes.innerText = 'Strikes left: ' + strikes;
    if (strikes <= 0) {
        endGame();
    }
}

function updateScore() {
    score += Math.floor(randWord.length * multiplier);
    multiplier++;
    myMultiplier.innerText = "Multiplier: x" + multiplier;
    myScore.innerText = "Score: " + score;
    strikes = 6;
    myStrikes.innerText = 'Strikes left: ' + strikes;
    wrongGuesses = '';
    guesses.innerText = "Wrong Guesses: ";
}

function compareWords() {
    if (myWord === randWord) {
        gameStatus.innerText = `You guessed it, '${randWord}' was the word! Guess the next word.`;
        resetHangman();
        updateScore();
        generateWord();
    }
}

function resetHangman(){
    hangmanIndex = 0;
    for (let i = 0; i < hangman.childElementCount - 1; i++) {
        hangman.children[i].style.display = 'none';
    }
}

document.addEventListener('keydown', function (event) {
    if (event.key.length === 1 && event.key.match(/[a-z]/i) && gameStarted) { //Evaluate pressed key when game has started
        if (!randWord.includes(event.key) && !wrongGuesses.includes(event.key)) {//checks if the letter is not in randWord or in guessed letters
            strikes--;
            hangman.children[hangmanIndex].style.display = 'inline';
            hangman.firstElementChild.src = emotes[hangmanIndex];
            hangmanIndex++;
            wrongGuesses += event.key + ', ';
            guesses.innerText = "Wrong Guesses: " + wrongGuesses;
            checkStrikes();
            return;
        }
        for (let i = 0; i < randWord.length; i++) { //Check if random word contains letter
            if (randWord[i] === event.key) {
                myWord = myWord.replaceAt(i, event.key);
                generateString(myWord);
            }
        }
        myTyping.innerText = "Your Word: " + myString;
        compareWords();
    }
});

function endGame() {
    gameStatus.innerText = `Game Over! The word was '${randWord}'. Your score was ${score}. Press Start to begin.`;
    gameStarted = false;
}

String.prototype.replaceAt = function (index, replacement) {
    return this.substring(0, index) + replacement + this.substring(index + replacement.length);
}
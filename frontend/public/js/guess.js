let randomNumber;
let attempts;
let gameFinished;

const guessInput = document.getElementById("guessInput");
const guessBtn = document.getElementById("guessBtn");
const resetBtn = document.getElementById("resetBtn");
const message = document.getElementById("message");
const attemptsText = document.getElementById("attempts");

function startGame() {
  randomNumber = Math.floor(Math.random() * 100) + 1;
  attempts = 0;
  gameFinished = false;

  attemptsText.textContent = attempts;
  message.textContent = "";
  message.className = "message";

  guessInput.value = "";
  guessInput.disabled = false;
  guessBtn.disabled = false;
  guessInput.focus();
}

function showMessage(text, type) {
  message.textContent = text;
  message.className = `message ${type}`;
}

function handleGuess() {
  if (gameFinished) return;

  const userGuess = Number(guessInput.value);

  if (!userGuess) {
    showMessage("Please enter a number.", "error");
    return;
  }

  if (userGuess < 1 || userGuess > 100) {
    showMessage("Enter a number between 1 and 100.", "error");
    return;
  }

  attempts++;
  attemptsText.textContent = attempts;

  if (userGuess === randomNumber) {
    showMessage(`Correct! You guessed the number in ${attempts} attempts.`, "success");
    gameFinished = true;
    guessInput.disabled = true;
    guessBtn.disabled = true;
    return;
  }

  if (userGuess < randomNumber) {
    showMessage("Too low. Try again.", "info");
  } else {
    showMessage("Too high. Try again.", "info");
  }

  guessInput.value = "";
  guessInput.focus();
}

guessBtn.addEventListener("click", handleGuess);

guessInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    handleGuess();
  }
});

resetBtn.addEventListener("click", startGame);

startGame();
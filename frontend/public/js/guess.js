let randomNumber;
let attempts;
let gameFinished;

const guessInput = document.getElementById("guessInput");
const guessBtn = document.getElementById("guessBtn");
const resetBtn = document.getElementById("resetBtn");
const message = document.getElementById("message");
const attemptsText = document.getElementById("attempts");
const bestScoreText = document.getElementById("bestScore");

async function loadBestScore() {
  if (!currentUser) {
    bestScoreText.textContent = "--";
    return;
  }

  try {
    const response = await fetch("/best-score/guess");
    const data = await response.json();

    if (data.bestScore !== null && data.bestScore !== undefined) {
      bestScoreText.textContent = data.bestScore;
    } else {
      bestScoreText.textContent = "--";
    }
  } catch (error) {
    console.error("Error loading best score:", error);
    bestScoreText.textContent = "--";
  }
}

async function saveBestScore(finalAttempts) {
  if (!currentUser) {
    showMessage(`Correct! You guessed the number in ${finalAttempts} attempts. Log in to save your best score.`, "success");
    return;
  }

  try {
    const response = await fetch("/save-score", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        game: "guess",
        score: finalAttempts,
      }),
    });

    const data = await response.json();

    if (data.bestScore !== null && data.bestScore !== undefined) {
      bestScoreText.textContent = data.bestScore;
    }

    showMessage(`Correct! You guessed the number in ${finalAttempts} attempts. ${data.message}`, "success");
  } catch (error) {
    console.error("Error saving best score:", error);
    showMessage(`Correct! You guessed the number in ${finalAttempts} attempts. Could not save score.`, "success");
  }
}

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

  loadBestScore();
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
    gameFinished = true;
    guessInput.disabled = true;
    guessBtn.disabled = true;
    saveBestScore(attempts);
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
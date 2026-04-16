const timerDisplay = document.getElementById("timerDisplay");
const resultMessage = document.getElementById("resultMessage");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const resetBtn = document.getElementById("resetBtn");
const bestScoreText = document.getElementById("bestScore");

let startTime = 0;
let interval = null;
let running = false;
const targetTime = 5.0;

function updateTimer() {
  const currentTime = (Date.now() - startTime) / 1000;
  timerDisplay.textContent = currentTime.toFixed(2);
}

async function loadBestScore() {
  if (!currentUser) {
    bestScoreText.textContent = "--";
    return;
  }

  try {
    const response = await fetch("/best-score/timerchallenge");
    const data = await response.json();

    if (data.bestScore !== null && data.bestScore !== undefined) {
      bestScoreText.textContent = `${Number(data.bestScore).toFixed(2)} sec off`;
    } else {
      bestScoreText.textContent = "--";
    }
  } catch (error) {
    console.error("Error loading best score:", error);
    bestScoreText.textContent = "--";
  }
}

async function saveBestScore(difference, finalTime) {
  if (!currentUser) {
    resultMessage.textContent += " Log in to save your best score.";
    return;
  }

  try {
    const response = await fetch("/save-score", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        game: "timerchallenge",
        score: Number(difference.toFixed(2)),
      }),
    });

    const data = await response.json();

    if (data.bestScore !== null && data.bestScore !== undefined) {
      bestScoreText.textContent = `${Number(data.bestScore).toFixed(2)} sec off`;
    }

    if (data.message) {
      resultMessage.textContent += ` ${data.message}`;
    }
  } catch (error) {
    console.error("Error saving best score:", error);
    resultMessage.textContent += " Could not save score.";
  }
}

function showResult(finalTime, difference) {
  if (difference === 0) {
    resultMessage.textContent = `Perfect! You hit exactly ${finalTime.toFixed(2)} seconds!`;
  } else if (difference <= 0.10) {
    resultMessage.textContent = `So close! You stopped at ${finalTime.toFixed(2)} seconds. Only ${difference.toFixed(2)} seconds away.`;
  } else if (difference <= 0.30) {
    resultMessage.textContent = `Nice! You stopped at ${finalTime.toFixed(2)} seconds. You were ${difference.toFixed(2)} seconds away.`;
  } else {
    resultMessage.textContent = `Too far! You stopped at ${finalTime.toFixed(2)} seconds. You were ${difference.toFixed(2)} seconds away.`;
  }
}

startBtn.addEventListener("click", () => {
  if (running) return;

  running = true;
  resultMessage.textContent = "";
  startTime = Date.now();
  timerDisplay.textContent = "0.00";

  interval = setInterval(updateTimer, 10);
});

stopBtn.addEventListener("click", () => {
  if (!running) return;

  running = false;
  clearInterval(interval);

  const finalTime = parseFloat(timerDisplay.textContent);
  const difference = Math.abs(finalTime - targetTime);

  showResult(finalTime, difference);
  saveBestScore(difference, finalTime);
});

resetBtn.addEventListener("click", () => {
  running = false;
  clearInterval(interval);
  timerDisplay.textContent = "0.00";
  resultMessage.textContent = "";
  loadBestScore();
});

loadBestScore();
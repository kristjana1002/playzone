const timerDisplay = document.getElementById("timerDisplay");
const resultMessage = document.getElementById("resultMessage");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const resetBtn = document.getElementById("resetBtn");

let startTime = 0;
let interval = null;
let running = false;
const targetTime = 5.0;

function updateTimer() {
  const currentTime = (Date.now() - startTime) / 1000;
  timerDisplay.textContent = currentTime.toFixed(2);
}

startBtn.addEventListener("click", () => {
  if (running) return;

  running = true;
  resultMessage.textContent = "";
  startTime = Date.now();

  interval = setInterval(updateTimer, 10);
});

stopBtn.addEventListener("click", () => {
  if (!running) return;

  running = false;
  clearInterval(interval);

  const finalTime = parseFloat(timerDisplay.textContent);
  const difference = Math.abs(finalTime - targetTime);

  if (difference === 0) {
    resultMessage.textContent = `Perfect! You hit exactly ${finalTime.toFixed(2)} seconds!`;
  } else if (difference <= 0.10) {
    resultMessage.textContent = `So close! You stopped at ${finalTime.toFixed(2)} seconds.`;
  } else if (difference <= 0.30) {
    resultMessage.textContent = `Nice! You stopped at ${finalTime.toFixed(2)} seconds.`;
  } else {
    resultMessage.textContent = `Too far! You stopped at ${finalTime.toFixed(2)} seconds.`;
  }
});

resetBtn.addEventListener("click", () => {
  running = false;
  clearInterval(interval);
  timerDisplay.textContent = "0.00";
  resultMessage.textContent = "";
});
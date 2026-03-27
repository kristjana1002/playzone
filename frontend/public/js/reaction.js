const reactionBox = document.getElementById("reactionBox");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const message = document.getElementById("message");
const bestTimeText = document.getElementById("bestTime");

let startTime = 0;
let timeoutId = null;
let gameState = "idle";
let bestTime = null;

function setMessage(text, type = "") {
  message.textContent = text;
  message.className = `message ${type}`.trim();
}

function resetBox() {
  reactionBox.className = "reaction-box waiting";
  reactionBox.textContent = "Click Start to Begin";
}

function startGame() {
  clearTimeout(timeoutId);

  gameState = "waiting";
  setMessage("Wait for the green color, then click fast.", "info");
  reactionBox.className = "reaction-box ready";
  reactionBox.textContent = "Wait...";

  const randomDelay = Math.floor(Math.random() * 3000) + 2000;

  timeoutId = setTimeout(() => {
    gameState = "click";
    startTime = Date.now();
    reactionBox.className = "reaction-box click";
    reactionBox.textContent = "CLICK NOW!";
    setMessage("CLICK!", "good");
  }, randomDelay);
}

function handleBoxClick() {
  if (gameState === "idle") {
    setMessage("Press Start first.", "info");
    return;
  }

  if (gameState === "waiting") {
    clearTimeout(timeoutId);
    gameState = "idle";
    resetBox();
    setMessage("Too early! You clicked before the color changed.", "bad");
    return;
  }

  if (gameState === "click") {
    const reactionTime = Date.now() - startTime;
    gameState = "idle";

    reactionBox.className = "reaction-box waiting";
    reactionBox.textContent = `${reactionTime} ms`;

    setMessage(`Your reaction time was ${reactionTime} ms.`, "good");

    if (bestTime === null || reactionTime < bestTime) {
      bestTime = reactionTime;
      bestTimeText.textContent = `${bestTime} ms`;
    }
  }
}

function resetGame() {
  clearTimeout(timeoutId);
  gameState = "idle";
  bestTime = null;
  bestTimeText.textContent = "--";
  setMessage("");
  resetBox();
}

startBtn.addEventListener("click", startGame);
resetBtn.addEventListener("click", resetGame);
reactionBox.addEventListener("click", handleBoxClick);

resetGame();
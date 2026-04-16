const board = document.getElementById("memoryBoard");
const movesText = document.getElementById("moves");
const matchesText = document.getElementById("matches");
const bestScoreText = document.getElementById("bestScore");
const message = document.getElementById("message");
const restartBtn = document.getElementById("restartBtn");

const symbols = ["🍎", "🍌", "🍇", "🍒", "🍉", "🍓", "🥝", "🍍"];

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;
let matches = 0;

async function loadBestScore() {
  if (!currentUser) {
    bestScoreText.textContent = "--";
    return;
  }

  try {
    const response = await fetch("/best-score/memory");
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

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function createBoard() {
  board.innerHTML = "";
  moves = 0;
  matches = 0;
  firstCard = null;
  secondCard = null;
  lockBoard = false;
  message.textContent = "";

  movesText.textContent = "0";
  matchesText.textContent = "0";

  const gameSymbols = shuffle([...symbols, ...symbols]);

  gameSymbols.forEach((symbol, index) => {
    const button = document.createElement("button");
    button.classList.add("memory-card-item");
    button.dataset.symbol = symbol;
    button.dataset.index = index;
    button.textContent = symbol;

    button.addEventListener("click", () => flipCard(button));
    board.appendChild(button);
  });
}

function flipCard(card) {
  if (
    lockBoard ||
    card.classList.contains("flipped") ||
    card.classList.contains("matched")
  ) {
    return;
  }

  card.classList.add("flipped");

  if (!firstCard) {
    firstCard = card;
    return;
  }

  secondCard = card;
  moves++;
  movesText.textContent = moves;

  checkMatch();
}

function checkMatch() {
  const isMatch = firstCard.dataset.symbol === secondCard.dataset.symbol;

  if (isMatch) {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");

    matches++;
    matchesText.textContent = matches;
    message.textContent = "Nice match.";

    resetTurn();

    if (matches === symbols.length) {
      handleWin();
    }
  } else {
    lockBoard = true;
    message.textContent = "Not a match. Try again.";

    setTimeout(() => {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      resetTurn();
    }, 900);
  }
}

function resetTurn() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

async function handleWin() {
  message.textContent = `You won in ${moves} moves!`;

  if (!currentUser) {
    message.textContent += " Log in to save your best score.";
    return;
  }

  try {
    const response = await fetch("/save-score", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        game: "memory",
        score: moves,
      }),
    });

    const data = await response.json();

    if (data.bestScore !== null && data.bestScore !== undefined) {
      bestScoreText.textContent = data.bestScore;
    }

    if (data.message) {
      message.textContent += " " + data.message;
    }
  } catch (error) {
    console.error("Error saving score:", error);
    message.textContent += " Could not save score.";
  }
}

restartBtn.addEventListener("click", createBoard);

createBoard();
loadBestScore();
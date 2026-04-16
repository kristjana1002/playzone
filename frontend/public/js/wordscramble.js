const scrambledWordEl = document.getElementById("scrambledWord");
const hintTextEl = document.getElementById("hintText");
const scoreTextEl = document.getElementById("scoreText");
const resultMessageEl = document.getElementById("resultMessage");
const wordInput = document.getElementById("wordInput");
const scrambleForm = document.getElementById("scrambleForm");
const hintBtn = document.getElementById("hintBtn");
const nextBtn = document.getElementById("nextBtn");
const resetBtn = document.getElementById("resetBtn");

let words = [];
let currentWord = "";
let currentHint = "";
let score = 0;

async function loadWords() {
  try {
    const response = await fetch("/api/words");
    const data = await response.json();
    words = data;
    loadNewWord(); 
  } catch (error) {
    console.error("Failed to load words:", error);


    words = [
      { word: "planet", hint: "orbits a star" },
      { word: "oxygen", hint: "we breathe this" },
      { word: "engine", hint: "powers a car" },
      { word: "island", hint: "land surrounded by water" },
      { word: "artist", hint: "creates paintings" },
      { word: "library", hint: "place full of books" },
      { word: "volcano", hint: "erupts with lava" },
      { word: "keyboard", hint: "used to type on a computer" },
      { word: "bicycle", hint: "two-wheeled transport" },
      { word: "rainbow", hint: "colorful arc in the sky after rain" }
    ];

    loadNewWord();
  }
}

function shuffleWord(word) {
  let letters = word.split("");

  for (let i = letters.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [letters[i], letters[j]] = [letters[j], letters[i]];
  }

  return letters.join("");
}

function loadNewWord() {
  if (!words.length) return;

  resultMessageEl.textContent = "";
  wordInput.value = "";
  hintTextEl.textContent = "Hint: ---";

  const randomItem = words[Math.floor(Math.random() * words.length)];
  currentWord = randomItem.word.toLowerCase();
  currentHint = randomItem.hint;

  let scrambled = shuffleWord(currentWord);

  while (scrambled === currentWord) {
    scrambled = shuffleWord(currentWord);
  }

  scrambledWordEl.textContent = scrambled;
}

scrambleForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const userAnswer = wordInput.value.trim().toLowerCase();

  if (userAnswer === currentWord) {
    score++;
    scoreTextEl.textContent = `Score: ${score}`;
    resultMessageEl.textContent = "Correct! Nice job.";
    loadNewWord();
  } else {
    resultMessageEl.textContent = "Wrong answer. Try again.";
  }
});

hintBtn.addEventListener("click", function () {
  hintTextEl.textContent = `Hint: ${currentHint}`;
});

nextBtn.addEventListener("click", function () {
  loadNewWord();
});

resetBtn.addEventListener("click", function () {
  score = 0;
  scoreTextEl.textContent = "Score: 0";
  loadNewWord();
});


loadWords();
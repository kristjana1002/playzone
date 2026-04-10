const scrambledWordEl = document.getElementById("scrambledWord");
const hintTextEl = document.getElementById("hintText");
const scoreTextEl = document.getElementById("scoreText");
const resultMessageEl = document.getElementById("resultMessage");
const wordInput = document.getElementById("wordInput");
const scrambleForm = document.getElementById("scrambleForm");
const hintBtn = document.getElementById("hintBtn");
const nextBtn = document.getElementById("nextBtn");
const resetBtn = document.getElementById("resetBtn");

const words = [
  { word: "apple", hint: "A common fruit" },
  { word: "tiger", hint: "A big wild cat" },
  { word: "school", hint: "A place where students learn" },
  { word: "banana", hint: "A yellow fruit" },
  { word: "planet", hint: "Earth is one of these" },
  { word: "pencil", hint: "Used for writing" },
  { word: "window", hint: "You look through it" },
  { word: "summer", hint: "A warm season" },
  { word: "garden", hint: "A place with flowers or plants" },
  { word: "bottle", hint: "Used to hold water or drinks" }
];

let currentWord = "";
let currentHint = "";
let score = 0;

function shuffleWord(word) {
  let letters = word.split("");

  for (let i = letters.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [letters[i], letters[j]] = [letters[j], letters[i]];
  }

  return letters.join("");
}

function loadNewWord() {
  resultMessageEl.textContent = "";
  wordInput.value = "";
  hintTextEl.textContent = "Hint: ---";

  const randomItem = words[Math.floor(Math.random() * words.length)];
  currentWord = randomItem.word;
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

loadNewWord();
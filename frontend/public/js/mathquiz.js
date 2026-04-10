const questionEl = document.getElementById("question");
const scoreEl = document.getElementById("score");
const resultMessage = document.getElementById("resultMessage");
const answerInput = document.getElementById("answerInput");
const mathForm = document.getElementById("mathForm");
const nextBtn = document.getElementById("nextBtn");
const resetBtn = document.getElementById("resetBtn");

let num1;
let num2;
let operator;
let correctAnswer;
let score = 0;
let answered = false;

function generateQuestion() {
  answered = false;
  resultMessage.textContent = "";
  answerInput.value = "";

  const operators = ["+", "-", "*"];
  operator = operators[Math.floor(Math.random() * operators.length)];

  num1 = Math.floor(Math.random() * 20) + 1;
  num2 = Math.floor(Math.random() * 20) + 1;

  if (operator === "-") {
    if (num2 > num1) {
      [num1, num2] = [num2, num1];
    }
    correctAnswer = num1 - num2;
  } else if (operator === "+") {
    correctAnswer = num1 + num2;
  } else if (operator === "*") {
    correctAnswer = num1 * num2;
  }

  questionEl.textContent = `${num1} ${operator} ${num2} = ?`;
}

mathForm.addEventListener("submit", function (e) {
  e.preventDefault();

  if (answered) return;

  const userAnswer = Number(answerInput.value);

  if (userAnswer === correctAnswer) {
    score++;
    scoreEl.textContent = `Score: ${score}`;
    resultMessage.textContent = "Correct!";
  } else {
    resultMessage.textContent = `Wrong! The correct answer was ${correctAnswer}`;
  }

  answered = true;
});

nextBtn.addEventListener("click", function () {
  generateQuestion();
});

resetBtn.addEventListener("click", function () {
  score = 0;
  scoreEl.textContent = "Score: 0";
  generateQuestion();
});

generateQuestion();
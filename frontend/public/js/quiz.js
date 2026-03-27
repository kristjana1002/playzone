const questions = [
  {
    question: "What does HTML stand for?",
    answers: [
      { text: "Hyper Text Markup Language", correct: true },
      { text: "High Transfer Machine Language", correct: false },
      { text: "Home Tool Markup Language", correct: false },
      { text: "Hyperlink Text Main Language", correct: false }
    ]
  },
  {
    question: "Which language is used for styling web pages?",
    answers: [
      { text: "Python", correct: false },
      { text: "CSS", correct: true },
      { text: "C++", correct: false },
      { text: "SQL", correct: false }
    ]
  },
  {
    question: "Which of these is used for JavaScript runtime on the backend?",
    answers: [
      { text: "Node.js", correct: true },
      { text: "SQLite", correct: false },
      { text: "EJS", correct: false },
      { text: "Figma", correct: false }
    ]
  },
  {
    question: "What symbol is used for IDs in CSS?",
    answers: [
      { text: ".", correct: false },
      { text: "#", correct: true },
      { text: "*", correct: false },
      { text: "&", correct: false }
    ]
  },
  {
    question: "Which company developed JavaScript?",
    answers: [
      { text: "Microsoft", correct: false },
      { text: "Netscape", correct: true },
      { text: "Google", correct: false },
      { text: "Apple", correct: false }
    ]
  }
];

const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answerButtons");
const nextBtn = document.getElementById("nextBtn");
const restartBtn = document.getElementById("restartBtn");
const resultMessage = document.getElementById("resultMessage");
const scoreText = document.getElementById("score");
const questionNumberText = document.getElementById("questionNumber");

let currentQuestionIndex = 0;
let score = 0;
let answered = false;

function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  answered = false;

  scoreText.textContent = score;
  nextBtn.style.display = "none";
  restartBtn.style.display = "none";
  resultMessage.textContent = "";

  showQuestion();
}

function showQuestion() {
  resetState();

  const currentQuestion = questions[currentQuestionIndex];
  questionNumberText.textContent = currentQuestionIndex + 1;
  questionElement.textContent = currentQuestion.question;

  currentQuestion.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.textContent = answer.text;
    button.classList.add("answer-btn");
    button.dataset.correct = answer.correct;
    button.addEventListener("click", selectAnswer);
    answerButtons.appendChild(button);
  });
}

function resetState() {
  answered = false;
  nextBtn.style.display = "none";
  resultMessage.textContent = "";

  while (answerButtons.firstChild) {
    answerButtons.removeChild(answerButtons.firstChild);
  }
}

function selectAnswer(event) {
  if (answered) return;

  answered = true;
  const selectedButton = event.target;
  const isCorrect = selectedButton.dataset.correct === "true";

  if (isCorrect) {
    score++;
    scoreText.textContent = score;
    resultMessage.textContent = "Correct!";
  } else {
    resultMessage.textContent = "Wrong answer!";
  }

  Array.from(answerButtons.children).forEach((button) => {
    if (button.dataset.correct === "true") {
      button.classList.add("correct");
    } else if (button === selectedButton) {
      button.classList.add("wrong");
    }

    button.disabled = true;
  });

  nextBtn.style.display = "inline-block";
}

function showFinalScreen() {
  resetState();
  questionNumberText.textContent = questions.length;
  questionElement.textContent = `Quiz finished! Your final score is ${score} out of ${questions.length}.`;
  resultMessage.textContent = score === questions.length
    ? "Perfect score!"
    : score >= 3
    ? "Nice job!"
    : "Good try!";

  restartBtn.style.display = "inline-block";
}

function handleNextQuestion() {
  currentQuestionIndex++;

  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    showFinalScreen();
  }
}

nextBtn.addEventListener("click", handleNextQuestion);
restartBtn.addEventListener("click", startQuiz);

startQuiz();
let questions = [];

async function loadQuestions() {
  try {
    const response = await fetch("/api/quiz");
    const data = await response.json();
    questions = data;
    startQuiz();
  } catch (error) {
    console.error("Failed to load AI questions:", error);
    questionElement.textContent = "Could not load quiz questions.";
  }
}

const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answerButtons");
const nextBtn = document.getElementById("nextBtn");
const restartBtn = document.getElementById("restartBtn");
const resultMessage = document.getElementById("resultMessage");
const scoreText = document.getElementById("score");
const questionNumberText = document.getElementById("questionNumber");
const bestScoreText = document.getElementById("bestScore");

let currentQuestionIndex = 0;
let score = 0;
let answered = false;

async function loadBestScore() {
  if (!currentUser) {
    bestScoreText.textContent = "--";
    return;
  }

  try {
    const response = await fetch("/best-score/quiz");
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

async function saveBestScore(finalScore) {
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
        game: "quiz",
        score: finalScore,
      }),
    });

    const data = await response.json();

    if (data.bestScore !== null && data.bestScore !== undefined) {
      bestScoreText.textContent = data.bestScore;
    }

    if (data.message) {
      resultMessage.textContent += ` ${data.message}`;
    }
  } catch (error) {
    console.error("Error saving best score:", error);
    resultMessage.textContent += " Could not save score.";
  }
}

function startQuiz() {
  if (!questions.length) {
    questionElement.textContent = "No questions available.";
    return;
  }

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
    button.textContent = answer;
    button.classList.add("answer-btn");
    button.dataset.correct = answer === currentQuestion.correctAnswer;
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

  resultMessage.textContent =
    score === questions.length
      ? "Perfect score!"
      : score >= 3
      ? "Nice job!"
      : "Good try!";

  saveBestScore(score);
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
restartBtn.addEventListener("click", loadQuestions);

loadBestScore();
loadQuestions();
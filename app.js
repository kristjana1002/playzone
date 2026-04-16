require("dotenv").config();

const express = require("express");
const path = require("path");
const session = require("express-session");
const bcrypt = require("bcrypt");
const fs = require("fs");
const db = require("./backend/config/db");
const { GoogleGenAI } = require("@google/genai");

const app = express();
const PORT = 3000;

const sql = fs.readFileSync("./database/script.sql", "utf8");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

db.exec(sql, (err) => {
  if (err) {
    console.error("Error running SQL script:", err.message);
  } else {
    console.log("Database tables ready.");
  }
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: "playzone-secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

app.use(express.static(path.join(__dirname, "frontend/public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "frontend/views"));

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.get("/tictactoe", (req, res) => {
  res.render("tictactoe");
});

app.get("/quiz", (req, res) => {
  res.render("quiz");
});

app.get("/guess", (req, res) => {
  res.render("guess");
});

app.get("/reaction", (req, res) => {
  res.render("reaction");
});

app.get("/memory", (req, res) => {
  res.render("memory");
});

app.get("/mathquiz", (req, res) => {
  res.render("mathquiz");
});

app.get("/timerchallenge", (req, res) => {
  res.render("timerchallenge");
});

app.get("/wordscramble", (req, res) => {
  res.render("wordscramble");
});

app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.send("Please fill in all fields.");
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const insertSql = `
      INSERT INTO users (username, email, password)
      VALUES (?, ?, ?)
    `;

    db.run(insertSql, [username, email, hashedPassword], function (err) {
      if (err) {
        console.error("Signup DB error:", err.message);

        if (err.message.includes("UNIQUE")) {
          return res.send("Email already exists.");
        }

        return res.send("Error creating account.");
      }

      req.session.user = {
        id: this.lastID,
        username,
        email,
      };

      res.redirect("/");
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.send("Server error during signup.");
  }
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.send("Please fill in all fields.");
  }

  const selectSql = `SELECT * FROM users WHERE email = ?`;

  db.get(selectSql, [email], async (err, user) => {
    if (err) {
      console.error("Login DB error:", err.message);
      return res.send("Server error.");
    }

    if (!user) {
      return res.send("Invalid email or password.");
    }

    try {
      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        return res.send("Invalid email or password.");
      }

      req.session.user = {
        id: user.id,
        username: user.username,
        email: user.email,
      };

      res.redirect("/");
    } catch (error) {
      console.error("Login error:", error);
      res.send("Server error during login.");
    }
  });
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err.message);
      return res.send("Could not log out.");
    }

    res.redirect("/login");
  });
});

app.post("/save-score", (req, res) => {
  const user = req.session.user;
  const { game, score } = req.body;

  if (!user) {
    return res.status(401).json({ message: "Login required." });
  }

  if (!game || score === undefined) {
    return res.status(400).json({ message: "Missing game or score." });
  }

  const numericScore = Number(score);

  if (Number.isNaN(numericScore)) {
    return res.status(400).json({ message: "Score must be a number." });
  }

  const lowerIsBetterGames = ["memory", "reaction", "guess", "timerchallenge"];
  const higherIsBetterGames = ["quiz", "mathquiz", "wordscramble"];

  let scoreType = null;

  if (lowerIsBetterGames.includes(game)) {
    scoreType = "lower";
  } else if (higherIsBetterGames.includes(game)) {
    scoreType = "higher";
  } else {
    return res.status(400).json({ message: "Unknown game." });
  }

  const checkSql = `SELECT * FROM best_scores WHERE user_id = ? AND game = ?`;

  db.get(checkSql, [user.id, game], (err, existingScore) => {
    if (err) {
      console.error("Check score error:", err.message);
      return res.status(500).json({ message: "Server error." });
    }

    if (!existingScore) {
      const insertSql = `
        INSERT INTO best_scores (user_id, game, score)
        VALUES (?, ?, ?)
      `;

      db.run(insertSql, [user.id, game, numericScore], function (err) {
        if (err) {
          console.error("Insert score error:", err.message);
          return res.status(500).json({ message: "Could not save score." });
        }

        return res.json({
          message: "Best score saved.",
          bestScore: numericScore,
        });
      });
    } else {
      const isBetter =
        (scoreType === "lower" && numericScore < existingScore.score) ||
        (scoreType === "higher" && numericScore > existingScore.score);

      if (isBetter) {
        const updateSql = `
          UPDATE best_scores
          SET score = ?, created_at = CURRENT_TIMESTAMP
          WHERE user_id = ? AND game = ?
        `;

        db.run(updateSql, [numericScore, user.id, game], function (err) {
          if (err) {
            console.error("Update score error:", err.message);
            return res.status(500).json({ message: "Could not update score." });
          }

          return res.json({
            message: "New best score!",
            bestScore: numericScore,
          });
        });
      } else {
        return res.json({
          message: "Score not better than current best.",
          bestScore: existingScore.score,
        });
      }
    }
  });
});

app.get("/best-score/:game", (req, res) => {
  const user = req.session.user;
  const game = req.params.game;

  if (!user) {
    return res.json({ bestScore: null });
  }

  const sql = `SELECT score FROM best_scores WHERE user_id = ? AND game = ?`;

  db.get(sql, [user.id, game], (err, row) => {
    if (err) {
      console.error("Fetch best score error:", err.message);
      return res.status(500).json({ message: "Server error." });
    }

    res.json({
      bestScore: row ? row.score : null,
    });
  });
});

app.get("/api/quiz", async (req, res) => {
  const prompt = `
Generate 10 multiple choice quiz questions.

Rules:
- 4 answers per question
- only 1 correct answer
- return ONLY valid JSON
- no explanations

Format:
[
  {
    "question": "string",
    "answers": ["a", "b", "c", "d"],
    "correctAnswer": "string"
  }
]
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    let text = response.text;

  
    text = text.replace(/```json|```/g, "").trim();

    const questions = JSON.parse(text);

    res.json(questions);
  } catch (error) {
    console.error("AI error:", error);

  
    res.json([
      {
        "question": "What is the capital of France?",
        "answers": ["Paris", "London", "Berlin", "Rome"],
        "correctAnswer": "Paris"
      },
      {
        "question": "Which planet is known as the Red Planet?",
        "answers": ["Mars", "Venus", "Jupiter", "Saturn"],
        "correctAnswer": "Mars"
      },
      {
        "question": "Who wrote 'Romeo and Juliet'?",
        "answers": ["William Shakespeare", "Charles Dickens", "Jane Austen", "Mark Twain"],
        "correctAnswer": "William Shakespeare"
      },
      {
        "question": "What is the largest ocean on Earth?",
        "answers": ["Pacific Ocean", "Atlantic Ocean", "Indian Ocean", "Arctic Ocean"],
        "correctAnswer": "Pacific Ocean"
      },
      {
        "question": "Which country is known for the pyramids?",
        "answers": ["Egypt", "Mexico", "India", "China"],
        "correctAnswer": "Egypt"
      },
      {
        "question": "What is the chemical symbol for water?",
        "answers": ["H2O", "O2", "CO2", "NaCl"],
        "correctAnswer": "H2O"
      },
      {
        "question": "How many continents are there on Earth?",
        "answers": ["7", "5", "6", "8"],
        "correctAnswer": "7"
      },
      {
        "question": "Which animal is known as the King of the Jungle?",
        "answers": ["Lion", "Tiger", "Elephant", "Bear"],
        "correctAnswer": "Lion"
      },
      {
        "question": "What is the fastest land animal?",
        "answers": ["Cheetah", "Lion", "Horse", "Leopard"],
        "correctAnswer": "Cheetah"
      },
      {
        "question": "Which language is primarily spoken in Brazil?",
        "answers": ["Portuguese", "Spanish", "English", "French"],
        "correctAnswer": "Portuguese"
      }
    ]);
  }
});



app.get("/api/mathquiz", async (req, res) => {
  const prompt = `
Generate 10 multiple choice math quiz questions.

Rules:
- difficulty should be easy to medium
- use arithmetic, basic algebra, percentages, or simple geometry
- 4 answers per question
- only 1 correct answer
- return ONLY valid JSON
- no explanations

Format:
[
  {
    "question": "string",
    "answers": ["a", "b", "c", "d"],
    "correctAnswer": "string"
  }
]
`;

  let attempts = 3;

  while (attempts > 0) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      let text = response.text;
      text = text.replace(/```json|```/g, "").trim();

      const questions = JSON.parse(text);
      return res.json(questions);
    } catch (error) {
      attempts--;

      if (attempts === 0) {
        console.error("Math quiz AI failed:", error);

        return res.json([
          {
            question: "What is 12 × 8?",
            answers: ["96", "88", "108", "86"],
            correctAnswer: "96"
          },
          {
            question: "What is 25% of 200?",
            answers: ["25", "50", "75", "100"],
            correctAnswer: "50"
          },
          {
            question: "What is 9 + 14?",
            answers: ["21", "22", "23", "24"],
            correctAnswer: "23"
          },
          {
            question: "What is 49 ÷ 7?",
            answers: ["5", "6", "7", "8"],
            correctAnswer: "7"
          },
          {
            question: "What is the value of x in x + 6 = 10?",
            answers: ["2", "3", "4", "5"],
            correctAnswer: "4"
          },
          {
            question: "What is 15 × 3?",
            answers: ["30", "45", "60", "50"],
            correctAnswer: "45"
          },
          {
            question: "What is 10% of 90?",
            answers: ["9", "10", "8", "7"],
            correctAnswer: "9"
          },
          {
            question: "What is 36 ÷ 6?",
            answers: ["5", "6", "7", "8"],
            correctAnswer: "6"
          },
          {
            question: "What is 7²?",
            answers: ["42", "48", "49", "56"],
            correctAnswer: "49"
          },
          {
            question: "What is x if 2x = 14?",
            answers: ["5", "6", "7", "8"],
            correctAnswer: "7"
          }
        ]);
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
});

app.get("/api/words", async (req, res) => {
  const prompt = `
Generate 10 random English words for a word scramble game.

Rules:
- words should be medium difficulty
- no spaces or special characters
- return ONLY valid JSON
- include a hint for each word

Format:
[
  {
    "word": "example",
    "hint": "a short description"
  }
]
`;

  let attempts = 3;

  while (attempts > 0) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      let text = response.text;
      text = text.replace(/```json|```/g, "").trim();

      const words = JSON.parse(text);
      return res.json(words);

    } catch (error) {
      attempts--;

      if (attempts === 0) {
        console.error("Word AI failed:", error);

        return res.json([
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
        ]);
      }

      await new Promise(r => setTimeout(r, 1000));
    }
  }
});

app.listen(PORT, () => {
  console.log(`Play Zone running on http://localhost:${PORT}`);
});
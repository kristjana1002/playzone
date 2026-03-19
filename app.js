const express = require("express");
const path = require("path");
const session = require("express-session");
const db = require("./backend/config/db");
const fs = require("fs");

const app = express();

const sql = fs.readFileSync("./database/script.sql").toString();

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
    saveUninitialized: false
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

app.post("/signup", (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.send("Please fill in all fields.");
  }

  const sql = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;

  db.run(sql, [username, email, password], function (err) {
    if (err) {
      console.error(err.message);

      if (err.message.includes("UNIQUE")) {
        return res.send("Email already exists.");
      }

      return res.send("Error creating account.");
    }

    res.redirect("/login");
  });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.send("Please fill in all fields.");
  }

  const sql = `SELECT * FROM users WHERE email = ? AND password = ?`;

  db.get(sql, [email, password], (err, user) => {
    if (err) {
      console.error(err.message);
      return res.send("Server error.");
    }

    if (!user) {
      return res.send("Invalid email or password.");
    }

    req.session.user = {
      id: user.id,
      username: user.username,
      email: user.email
    };

    res.redirect("/");
  });
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err.message);
      return res.send("Could not log out.");
    }

    res.redirect("/login");
  });
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Play Zone running on http://localhost:${PORT}`);
});
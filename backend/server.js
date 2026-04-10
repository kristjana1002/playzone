const express = require("express");
const path = require("path");
const session = require("express-session");

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: "playzone_secret_key",
    resave: false,
    saveUninitialized: false,
  })
);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../frontend/views"));

app.use(express.static(path.join(__dirname, "../frontend/public")));

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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
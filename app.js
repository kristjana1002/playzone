const express = require("express");
const path = require("path");
const session = require("express-session");
const db = require("./backend/config/db");


const app = express();

const fs = require("fs");

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

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Play Zone running on http://localhost:${PORT}`);
});
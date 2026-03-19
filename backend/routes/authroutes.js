const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../config/db");

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.send("Please fill in all fields.");
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;

    db.run(sql, [username, email, hashedPassword], function (err) {
      if (err) {
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
    console.error(error);
    res.send("Server error during signup.");
  }
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.send("Please fill in all fields.");
  }

  const sql = `SELECT * FROM users WHERE email = ?`;

  db.get(sql, [email], async (err, user) => {
    if (err) {
      return res.send("Server error.");
    }

    if (!user) {
      return res.send("Invalid email or password.");
    }

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
  });
});

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.send("Could not log out.");
    }
    res.redirect("/login");
  });
});

module.exports = router;
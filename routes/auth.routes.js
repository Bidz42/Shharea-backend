const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const { isAuthenticated } = require("../middleware/jwt.middleware");
const User = require("../models/User.model");
const nodemailer = require("nodemailer");

router.post("/signup", (req, res) => {
  const { name, username, email, password, image } = req.body;
  console.log(req.body);

  const RegexTest = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!RegexTest.test(email)) {
    res.status(400).json({ message: "Enter a valid email." });
    return;
  }
  const RegexPasswordTest = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!RegexPasswordTest.test(password)) {
    res
      .status(400)
      .json({
        message:
          "Password must contain 6 characters with lowercase, uppercase and numbers",
      });
    return;
  }
  if (name === "" || username === "" || email === "" || password === "") {
    res
      .status(400)
      .json({
        message: "Please enter your name, username, email and password",
      });
    return;
  }
  User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        res.status(400).json({ message: "User exists." });
        return;
      }
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, salt);
      return User.create({
        name,
        username,
        email,
        password: hashedPassword,
        image,
      });
    })
    .then((createdUser) => {
      const { name, username, email, _id } = createdUser;
      const user = { name, username, email, _id };
      res.status(201).json({ user: user });
    })
    .catch((err) => {
      console.log(err);
      res
        .status(500)
        .json({ message: "Internal Server Error, Please Investigate" });
    })
    .then(async () => {
      let transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: "shharea.contact@gmail.com",
          pass: process.env.pass,
        },
      });
      let details = {
        from: "shharea.contact@gmail.com",
        to: email,
        subject: "Welcome to SHH-AREA", 
        amp: `<!doctype html>
        <html ⚡4email>
          <head>
            <meta charset="utf-8">
            <style amp4email-boilerplate>body{visibility:hidden}</style>
            <script async src="https://cdn.ampproject.org/v0.js"></script>
            <script async custom-element="amp-anim" src="https://cdn.ampproject.org/v0/amp-anim-0.1.js"></script>
          </head>
          <body>
            <p>Image: <amp-img src="https://cldup.com/P0b1bUmEet.png" width="16" height="16"/></p>
            <p>GIF (requires "amp-anim" script in header):<br/>
              <amp-anim src="https://cldup.com/D72zpdwI-i.gif" width="500" height="350"/></p>
          </body>
        </html>`



      };
      transporter.sendMail(details, (err) => {
        if (err) {
          console.log("There was an error sending email", err);
        } else {
          console.log("Email has been sent");
        }
      });
    })
    .catch((error) => console.log(error));
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email === "" || password === "") {
    res.status(400).json({ message: "Provide an email and password" });
    return;
  }

  User.findOne({ email })
    .then((loginUser) => {
      if (!loginUser) {
        res.status(400).json({ message: "User not found." });
        return;
      }
      const passedPassword = bcrypt.compareSync(password, loginUser.password);
      if (passedPassword) {
        const { _id, name, email } = loginUser;
        const payload = { _id, name, email };
        const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
          algorithm: "HS256",
          expiresIn: "2h",
        });
        res.status(200).json({ authToken: authToken });
      } else {
        res.status(401).json({ message: "Cannot authenticate the user" });
      }
    })
    .catch((err) =>
      res.status(500).json({ message: "Server Error" })
    );
});

router.get("/verify", isAuthenticated, (req, res) => {
  res.status(200).json(req.payload);
});

module.exports = router;

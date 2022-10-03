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

  const mailer = () =>{
      console.log("Sending Mail Now" )
      console.log("Mail Selected: ", email )

      let transporter =  nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: "shharea.contact@gmail.com",
          pass: "udaonhodxwhktmyw",
        },
      });

      let details =  {
        from: "shharea.contact@gmail.com",
        to: email,
        subject: "Welcome to SHH-AREA", 
        html: `

        <div style="
          display: flex; 
          flex-direction: column; 
          background-color:#4c4a4a;
          color: white; 
          padding: 0% 20%;
    
          "
         >

          <h1 style="color: #0CD3FC; text-align:center;">WELCOME</h1>
          <p style="font-size: 22px;">We're excited to have you here. We know you need an area to share, so, welcome to SHH-AREA </p>
          <button style="border: none; border-radius: 5%; background-color:#F06FCB; padding: 3%; margin: 0 auto;"> <a href='https://shh-area.netlify.app/' target="_blank" style="text-decoration: none; ">Take me There!</a></button>

          <p style="font-style:italic; text-align: center;">If that doesn't work, copy and paste the following link in your browser: </p>
          <p style="color: #F06FCB; text-align: center;">https://shh-area.netlify.app</p>

          <p>If you have any questions, just reply to this email -- we're always happy to help out.</p>

          <p style="font-weight: 800;">Cheers, The SHH-AREA team</p>

        </div>
        
        `

      };

      transporter.sendMail(details, (err) => {
      if (err) {
        console.log("There was an error sending email", err);
      } else {
        console.log("Email has been sent");
      }
    });


    console.log("Mail Function End")
    }




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
      console.log("Here is the New Created User ", createdUser)
      const { name, username, email, _id } = createdUser;
      const user = { name, username, email, _id };
      mailer();
      res.status(201).json({ user: user });
    })
    .catch(err => console.log(err))



    

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

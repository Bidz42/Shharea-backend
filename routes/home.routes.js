const express = require("express");
const router = express.Router();
const path = require("path");
const { isAuthenticated } = require("../middleware/jwt.middleware");
const User = require("../models/User.model");
const Upload = require("../models/Upload.model");
const uploadCloud = require("../config/cloudinary.config");


router.post("/upload", uploadCloud.single("imageUrl"), (req, res, next) => {
    const {owner, name} = req.body;
    const tags = JSON.parse(req.body.tags);
    const imageUrl = req.file.path;
    console.log(owner, name, tags, imageUrl)

    if (!req.file) {
      next(new Error("No file uploaded!"));
      return;
    }
    Upload.create({name, imageUrl, tags, owner})
    .then( (response) => {
        console.log(response)
         res.status(200).json({message: 'image uploaded'})
    })
    .catch(err => console.error(err))
});

router.get("/images", (req, res) => {
    Upload.find()
    .populate('owner')
    .then((response) => res.status(200).json(response))
    .catch((err) => console.log(err))
})






module.exports = router;

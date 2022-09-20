const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const Upload = require("../models/Upload.model");
const Comment = require("../models/Comment.model");
const uploadCloud = require("../config/cloudinary.config");
const { isAuthenticated } = require("../middleware/jwt.middleware");


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

router.get("/image/:id", (req, res) => {
    const {id} = req.params
    Upload.findById(id)
    .populate("owner likes")
    .populate({
        path: "comments",
        populate: {
            path: "owner", 
            model: "User",
        }
        })
    .then((response) => res.status(200).json(response))
    .catch((err) => console.log(err))
})

router.post(`/image/comment`, (req, res) =>{
    const {comment, owner, imageId} = req.body;
    Comment.create({comment, owner})
        .then(response => { return Upload.updateOne( {_id : imageId}, {$push: {comments : [response._id]}})})
        .then(response => {res.status(200).json(response)})
        .catch((err) => console.log(err));
});

router.post(`/image/like`, (req, res) =>{
    const {userId, imageId} = req.body;
    
    Upload.updateOne( {_id : imageId}, {$push: {likes : [userId]}})
    .then((response) => {res.status(200).json(response)})
    .catch((err) => console.log(err))




    // Upload.create({comment, owner})
    //     .then(response => { return Upload.updateOne( {_id : imageId}, {$push: {comments : [response._id]}})})
    //     .then(response => {res.status(200).json(response)})
    //     .catch((err) => console.log(err));
});

module.exports = router;

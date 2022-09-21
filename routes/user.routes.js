const express = require("express");
const Upload = require("../models/Upload.model");
const router = express.Router();
const User = require("../models/User.model");
// const Upload = require("../models/Upload.model");
// const Comment = require("../models/Comment.model");
// const uploadCloud = require("../config/cloudinary.config");
// const { isAuthenticated } = require("../middleware/jwt.middleware");

router.get("/profile/:id", (req,res) => {
    const {id} = req.params;
    Upload.find()
        .populate("comments likes")
        .then(response => response.filter(item => item.owner.toString() === id))
        .then(response => res.status(200).json(response) )
        .catch(err=> console.log(err));
})

router.post("/profile", (req,res) => {
    const {userId, location, info} = req.body
    User.updateOne({ _id : userId }, {$set: { location: location, info: info}})
    .then((response) => {return User.findById(userId) })
    .then((response) => res.status(200).json(response))
    .catch((err) => console.log(err))
})

router.get("/details", (req,res) => {
    const {id} = req.body
    User.findById(id)
    .then((response) => res.status(200).json(response))
    .catch((err) => console.log(err))
 })


 
//     const {id} = req.body
//     console.log('hello', id)
//     User.findById(id)
//     .then((response) => {
//         console.log('resp', response)
//         res.status(200).json(response)})
//     .catch((err) => console.log(err))
// })


module.exports = router;
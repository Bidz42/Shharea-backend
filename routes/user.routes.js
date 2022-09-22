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
        .populate([
            {path: "comments", model: "Comment",
            populate:{
                path:"owner", model:"User"
            }
            },
            {path: "likes", model:"User"}
        ])
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

router.get("/:id/details", (req,res) => {
    console.log("We can See User Details");
    const {id} = req.params
    User.findById(id)
    .then(response => res.status(200).json(response))
    .catch((err) => console.log(err));  
})

router.post("/:id/friends", (req,res) => {
    console.log("processing friendship")
    const {userId} = req.body
    const {id} = req.params
    let counter = 0; 
    console.log("counter ", counter)
    User.findById(id)
        .then(response =>{
            console.log("the user that is found ", response)
            response?.friends.forEach(friend =>{ 
                console.log("friend ,", friend, "counter ,", counter)
                friend?._id.toString() === userId ? counter++ : counter })
            if(counter >0){return res.status(400).json("message: already liked")}
            else{
                User.updateOne({ _id : id }, {$push: {friends: [userId]}})
                .then((response) => res.status(200).json(response))
                .catch((err) => console.log(err));  
            }
            })
        })

module.exports = router;
const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const Upload = require("../models/Upload.model");
const Comment = require("../models/Comment.model");
const uploadCloud = require("../config/cloudinary.config");
const { isAuthenticated } = require("../middleware/jwt.middleware");

router.get("/profile/:id", (req,res) => {

})



module.exports = router;
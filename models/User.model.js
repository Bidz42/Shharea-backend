const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    name: {type: String, required: true, trim: true},
    username: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    image: String,
    location: String,
    info: String,
    friends: [{ type: Schema.Types.ObjectId, ref: "User"}],
  },
  {
    timestamps: true
  }
);

const User = model("User", userSchema);

module.exports = User;

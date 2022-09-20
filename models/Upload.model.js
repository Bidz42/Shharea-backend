const { Schema, model } = require("mongoose");

const uploadSchema = new Schema(
  {
    name: String,
    imageUrl: String,
    owner: { type: Schema.Types.ObjectId, ref: "User"},
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment"}],
    tags: []
  },
  {
    timestamps: true,
  }
);

const Upload = model("Upload", uploadSchema);

module.exports = Upload;
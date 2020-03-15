const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PhotoSchema = new Schema(
  {
    ImageData: { type: String },
    ImageName: { type: String },
    ImageRenditions: { type: Array }
  },
  {
    timestamps: true
  }
);

const Photo = mongoose.model("Photo", PhotoSchema);
module.exports = Photo;

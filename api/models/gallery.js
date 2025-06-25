const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema(
  {
    img: {
      fieldname: String,
      originalname: String,
      encoding: String,
      mimetype: String,
      buffer: Buffer,
      size: Number,
    },
    title: { type: String, required: true },
    description: { type: String },
    alignno: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Gallery", gallerySchema);

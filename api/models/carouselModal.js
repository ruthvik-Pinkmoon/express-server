const mongoose = require("mongoose");

const carouselSchema = new mongoose.Schema(
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

    alignno: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Carousel", carouselSchema);

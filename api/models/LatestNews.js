const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  isImportant: { type: Boolean, default: false, required: true },
  date: { type: Date, required: true },
  file: {
    data: Buffer, // This will store the file's binary data
    contentType: String,
    fileName: String, // This will store the file's MIME type (like 'image/png', 'application/pdf')
  },
});

module.exports = mongoose.model("news", newsSchema, "news");

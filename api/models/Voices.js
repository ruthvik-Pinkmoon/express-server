const mongoose = require("mongoose");

const voiceSchema = new mongoose.Schema({
  Name: { type: String, required: true },
  branch: { type: String, required: true },
  description: { type: String, required: true },
  city: { type: String, required: true },
  date: { type: Date, required: true },
});

module.exports = mongoose.model("voice", voiceSchema, "voice");

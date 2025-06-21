// models/chatWithUs.js
const mongoose = require("mongoose");

const chatWithUsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    office: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    countryCode: {
      type: String,
      default: "+91",
    },
    phone: {
      type: String,
      required: true,
    },

    aadhaar: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      default: null, // Optional field
    },
    subDepartment: {
      type: String,
      default: null, // Optional field
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ChatWithUs", chatWithUsSchema, "ChatWithUs");

const mongoose = require("mongoose");

const addisomFormSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  countryCode: { type: String, default: "+91" },
  phone: { type: String, required: true },
  fatherName: { type: String, required: true },
  aadhaar: { type: String, required: true },
  gender: { type: String, default: "Male" },
  dob: { type: String, required: true },
  qualification: { type: String, required: true },
  preferredCourse: { type: String, required: true },
  preferredCampus: { type: String, required: true },
  decision: { type: String, default:"pending"},
  message: { type: String }
});

module.exports = mongoose.model("addisomForm", addisomFormSchema, "addisomForm");

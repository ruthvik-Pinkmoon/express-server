const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
  RegisterNumber: { type: String, required: true },
  StudentName: { type: String, required: true },
  CourseName: { type: String, required: true },
  Semester: { type: String, required: true },
  SubjectName: { type: String, required: true },
  Grade: { type: String, required: true },
  Note: { type: String, required: true },
  Level: { type: String, required: true },
  ResultTitle: { type: String, required: true },
  ResultDate: { type: Date, required: true },
  meta: { type: mongoose.Schema.Types.Mixed }, // 👈 all extra fields go here
}, { timestamps: true });

resultSchema.index({
  RegisterNumber: 1,
  CourseName: 1,
  Semester: 1,
  SubjectName: 1
}, { unique: true });

module.exports = mongoose.model("Result", resultSchema);

const mongoose = require('mongoose');

const programSchema = new mongoose.Schema({
  campus: { type: String, required: true },
  programType: { type: String, required: true }, // ug, pg, other
  specialization: { type: String, required: true },
  name: { type: String, required: true },
  abbreviation: { type: String, required: true },
  duration: { type: String, required: true },

  // Example: ["10+2 with PCM"]
  eligibility: { type: [String], required: true },

  // Example: "ug", "pg", "other"
  programLevel: { type: String, required: true },

  // Example: ["Must pass 10+2", "Minimum 60% marks"]
  detailedEligibility: { type: [String], default: [] },

  // Example: ["Semester based", "Annual", "CBCS"]
  examPattern: { type: [String], default: [] },

  // Example: ["Mechanics", "Thermodynamics", "Optics"]
  syllabus: { type: [String], default: [] },

  fees: { type: String, required: true },

  semester1Fees: { type: String, default: null },
  semester2Fees: { type: String, default: null },

  note: { type: String, default: "" }
}, { timestamps: true });

module.exports = mongoose.model('Program', programSchema);

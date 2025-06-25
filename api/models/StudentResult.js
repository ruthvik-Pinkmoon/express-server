const mongoose = require('mongoose');

const studentResultSchema = new mongoose.Schema({
  hallticket: { type: String, required: true },
  sname: { type: String, required: true },
  resultBatch: { type: mongoose.Schema.Types.ObjectId, ref: 'ResultBatch', required: true },
  semesters: {
    type: Map,
    of: Map, // e.g., sem1: { English: 40, Math: 50 }
    default: {},
  },
});

studentResultSchema.index({ hallticket: 1, resultBatch: 1 }, { unique: true }); // avoid duplicate students in same batch

module.exports = mongoose.model('StudentResult', studentResultSchema);

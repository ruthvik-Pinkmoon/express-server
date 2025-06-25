const mongoose = require('mongoose');

const resultBatchSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true }, // e.g., "B.Tech Results - Mar 2025"
  level: { type: String, enum: ['UG', 'PG', 'Other'], required: true },
  resultDate: { type: Date, required: true },
});

module.exports = mongoose.model('ResultBatch', resultBatchSchema);

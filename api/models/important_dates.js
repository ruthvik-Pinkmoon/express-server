const mongoose = require('mongoose');

const importantDateSchema = new mongoose.Schema({
  color: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
   title: {
    type: String,
    required: true
  },
   program: {
    type: String,
    required: true
  },

  
  description: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('ImportantDate', importantDateSchema);

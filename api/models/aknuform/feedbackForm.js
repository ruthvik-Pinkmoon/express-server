const mongoose = require('mongoose');

const feedbackFormSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  rating: { type: Number, required: true },
  feedback: { type: String, required: true },
  contact: { type: Boolean, required: true } // If the user wants to be contacted
});

module.exports = mongoose.model('FeedbackForm', feedbackFormSchema,'FeedbackForm');

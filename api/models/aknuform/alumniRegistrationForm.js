const mongoose = require('mongoose');

const alumniRegistrationFormSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  passOutYear: { type: Number, required: true },
  branch: { type: String, required: true },
  email: { type: String, required: true },
  currentOccupation: { type: String, required: true }
});

module.exports = mongoose.model('AlumniRegistrationForm', alumniRegistrationFormSchema,"AlumniRegistrationForm");

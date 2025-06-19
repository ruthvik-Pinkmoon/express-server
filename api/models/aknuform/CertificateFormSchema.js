const mongoose = require('mongoose');

const applyCertificateFormSchema = new mongoose.Schema({
  registrationNumber: { type: String, required: true },
  selectCourse: { type: String, required: true },
  monthOfPassing: { type: String, required: true },
  admittedYear: { type: String, required: true },
  applicationPurpose: { type: String, required: true },
  fullAddress: { type: String, required: true },
  eMail: { type: String, required: true },
  nameSSC: { type: String, required: true },
  selectCollege: { type: String, required: true },
  yearOfPassing: { type: String, required: true },
  dateOfBirth: { type: String, required: true },
  applicationType: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  uploadDocuments: {
    data: Buffer,
    contentType: String,
    fileName: String
  },
  termsAccepted: { type: Boolean, required: true }
});

module.exports = mongoose.model('ApplyCertificateForm', applyCertificateFormSchema,'ApplyCertificateForm');

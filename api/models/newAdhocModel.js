const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema({
  data: Buffer,
  contentType: String,
  fileName: String,
});

// For Degrees with percentage and year
const DegreeDetailsSchema = new mongoose.Schema({
  degree: String,
  percentage: String,
  yearOfPassing: String,
  university: String,
});

// For Patents
const PatentSchema = new mongoose.Schema({
  name: String,
  series: String,
  year: String,
  status: String,
  type: String, // National or International
});

// Main Form Schema
const FormSchema = new mongoose.Schema({
  department: String,
  specialization: String,
  name: String,
  gender: String,
  phCategory: String,
  religion: String,
  dob: String,
  mphil: String,
  netORSetORSLET: String,
  fatherName: String,
  motherName: String,
  nationality: String,
  caste: String,
  subCaste: String,
  mobileNumber: String,
  alternateMobileNumber: String,
  email: String,
  address: String,
  sscPercentage: String,
  sscYearOfPassing: String,
  intermediatePercentage: String,
  intermediateYearOfPassing: String,
  graduationDegrees: [DegreeDetailsSchema],
  postGraduationDegrees: [DegreeDetailsSchema],
  additionalDegrees: [DegreeDetailsSchema],
  phdPassedYear: String,
  phdTopic: String,
  phdTopicPapers: String,
  phdTopicPapersInternational: String,
  PublicationsNational: String,
  PublicationsInternational: String,
  PatentsAndPublications242025: String,
  conferencesAndSeminarsNationalOrganized: String,
  conferencesAndSeminarsInterNationalAttended: String,
  conferencesAndSeminarsInterNationalOrganized: String,
  conferencesAndSeminarsInterNationalPresented: String,
  conferencesAndSeminarsNationalPresented: String,
  conferencesAndSeminarsNational: String,
  nptelORswayamORmoocs: String,
  membersInternational: String,
  membersNational: String,
  best3Articles: [String],
  awardsIfAny: [String],
  experienceInHOD: String,
  totalTeachingExperience: String,
  Contribution: String,
  anyOtherConsideration: String,
  postGraduationUniversity: String,
  netQualified: String,
  netSubject: String,
  netYear: String,
  setQualified: String,
  setSubject: String,
  setYear: String,
  hasFIR :String,
  firDescription :String,
  otherQualification: String,
  workExperience: String,
  experienceDetails: String,
  publications: String,
  aadharNumber: String,
  panNumber: String,

  // Patent entries
  nationalPatents: [PatentSchema],
  internationalPatents: [PatentSchema],

  // Files (stored as Buffers)
  aadhaar: FileSchema,
  pan: FileSchema,
  ssc: FileSchema,
  intermediate: FileSchema,
  graduation: [FileSchema],
  postGraduation: [FileSchema],
  additionalDegree: [FileSchema],
  phdGraduation: FileSchema,
  netORsetORslet: FileSchema,
  mphil: FileSchema,
  med: FileSchema,
  bed: FileSchema,
  set: FileSchema,
  experience: FileSchema,
  publication: FileSchema,
  patentsProof: FileSchema,
  photo: FileSchema,
  signature: FileSchema,
  additional: [FileSchema],
});

module.exports = mongoose.model("FormSubmission", FormSchema);

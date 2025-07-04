const mongoose = require("mongoose");

const adhocFacultySchema = new mongoose.Schema(
  {
    department: String,
    specialization: String,
    name: String,
    gender: String,
    phCategory: String,
    religion: String,
    dob: Date,
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
    sscYearOfPassing: Date,
    sscBoard: String,
    intermediatePercentage: String,
    intermediateYearOfPassing: Date,
    intermediateBoard: String,
    graduationDegree: String,
    graduationPercentage: String,
    graduationYearOfPassing: Date,
    graduationUniversity: String,
    postGraduationDegree: String,
    postGraduationPercentage: String,
    postGraduationYearOfPassing: Date,
    postGraduationUniversity: String,
    phdPassedYear: Date,
    mPhil: String,
    mEd: String,
    bEd: String,
    phdTopic: String,
    phdTopicPapersInternational: String,
    PublicationsNational: String,
    PublicationsInternational: String,
    PatentsAndPublications242025: String,
    conferencesAndSeminarsNationalOrganized: String,
    conferencesAndSeminarsInterNationalAttended: String,
    nptelORswayamORmoocs: String,
    membersInternational: String,
    membersNational: String,
    best3Articles: String,
    awardsIfAny: String,
    experienceInHOD: String,
    totalTeachingExperience: String,
    Contribution: String,
    anyOtherConsideration: String,
    conferencesAndSeminarsInterNationalOrganized: String,
    conferencesAndSeminarsInterNationalPresented: String,
    conferencesAndSeminarsNationalPresented: String,
    conferencesAndSeminarsNational: String,
    PatentsAndPublicationsInter242025: String,
    phdTopicPapers: String,
    ResearchPublications: String,
    netQualified: String,
    netSubject: String,
    netYear: String,
    setQualified: String,
    setSubject: String,
    setYear: String,
    otherQualification: String,
    workExperience: String,
    experienceDetails: String,
    publications: String,
    aadharNumber: String,
    panNumber: String,
    files: mongoose.Schema.Types.Mixed, // Use Mixed for flexible file storage
  },
  { timestamps: true }
);

module.exports = mongoose.model("AdhocFaculty", adhocFacultySchema);
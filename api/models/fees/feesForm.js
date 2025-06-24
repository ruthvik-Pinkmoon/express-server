const mongoose = require("mongoose");

const feesFormSchema = new mongoose.Schema(
  {
    registrationNumber: { type: String, required: true },
    nameSSC: { type: String, required: true },
    selectCourse: { type: String, required: true },
    selectCollege: { type: String, required: true },
    semesterYear: { type: String, required: true },
    feeType: { type: String, required: true },
    totalFee: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    eMail: { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "Paid", "Not Paid"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FeesForm", feesFormSchema);

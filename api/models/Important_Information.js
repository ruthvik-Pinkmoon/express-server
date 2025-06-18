// models/platformResources.js
const mongoose = require("mongoose");

const commonSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            maxlength: 500,
        },
        date: {
            type: Date,
        },
        file: {
            fieldname: String,
            originalname: String,
            encoding: String,
            mimetype: String,
            buffer: mongoose.Schema.Types.Buffer,
            size: Number,
        },
        link: {
            type: String,
        },
    },
    { timestamps: true }
);

const Model_Results = mongoose.model(
    "Model_Results",
    commonSchema,
    "Model_Results"
);
const Model_Circulars = mongoose.model(
    "Model_Circulars",
    commonSchema,
    "Model_Circulars"
);
const Model_Jobs = mongoose.model("Model_Jobs", commonSchema, "Model_Jobs");
const Model_Tenders = mongoose.model(
    "Model_Tenders",
    commonSchema,
    "Model_Tenders"
);
const Model_ExamApplications = mongoose.model(
    "Model_ExamApplications",
    commonSchema,
    "Model_ExamApplications"
);
const Model_ExamNotifications = mongoose.model(
    "Model_ExamNotifications",
    commonSchema,
    "Model_ExamNotifications"
);
const Model_ExamTimeTables = mongoose.model(
    "Model_ExamTimeTables",
    commonSchema,
    "Model_ExamTimeTables"
);
const Model_ExamJumblingCenters = mongoose.model(
    "Model_ExamJumblingCenters",
    commonSchema,
    "Model_ExamJumblingCenters"
);

module.exports = {
    Model_Results,
    Model_Circulars,
    Model_Jobs,
    Model_Tenders,
    Model_ExamApplications,
    Model_ExamNotifications,
    Model_ExamTimeTables,
    Model_ExamJumblingCenters,
};

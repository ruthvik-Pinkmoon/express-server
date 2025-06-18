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

const Model_Result = mongoose.model(
    "Model_Result",
    commonSchema,
    "Model_Result"
);
const Model_Circular = mongoose.model(
    "Model_Circular",
    commonSchema,
    "Model_Circular"
);
const Model_Job = mongoose.model("Model_Job", commonSchema, "Model_Job");
const Model_Tenders = mongoose.model(
    "Model_Tenders",
    commonSchema,
    "Model_Tenders"
);
const Model_ExamApplication = mongoose.model(
    "Model_ExamApplication",
    commonSchema,
    "Model_ExamApplication"
);
const Model_ExamNotification = mongoose.model(
    "Model_ExamNotification",
    commonSchema,
    "Model_ExamNotification"
);
const Model_ExamTimeTable = mongoose.model(
    "Model_ExamTimeTable",
    commonSchema,
    "Model_ExamTimeTable"
);
const Model_ExamJumblingCenter = mongoose.model(
    "Model_ExamJumblingCenter",
    commonSchema,
    "Model_ExamJumblingCenter"
);

module.exports = {
    Model_Result,
    Model_Circular,
    Model_Job,
    Model_Tenders,
    Model_ExamApplication,
    Model_ExamNotification,
    Model_ExamTimeTable,
    Model_ExamJumblingCenter,
};

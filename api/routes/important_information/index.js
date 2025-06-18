const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_DB);

const resultsRouter = require("./1_Results");
const circularRouter = require("./2_Circular");
const jobsRouter = require("./3_Jobs");
const tendersRouter = require("./4_Tenders");
const examApplicationsRouter = require("./5_Exam_Applications");
const examNotificationsRouter = require("./5_Exam_Notifications");
const examTimeTableRouter = require("./5_Exam_TimeTable");
const examJumblingCentersRouter = require("./5_Exam_JumblingCenters");

const resourceNames = [
    "results",
    "circular",
    "jobs",
    "tenders",
    "exam_applications",
    "exam_jumblingcenters",
    "exam_notifications",
    "exam_timetable",
]

// Mount all under /info
router.use("/", resultsRouter);
router.use("/", circularRouter);
router.use("/", jobsRouter);
router.use("/", tendersRouter);
router.use("/", examApplicationsRouter);
router.use("/", examNotificationsRouter);
router.use("/", examTimeTableRouter);
router.use("/", examJumblingCentersRouter);
router.get("/", (req, res) => {
    console.log("Important_Information---GET");
    res.json({ message: "This is Important Inforamation" });
});

module.exports = router;
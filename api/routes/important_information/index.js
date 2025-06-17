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

// Mount all under /info
router.use("/info", resultsRouter);
router.use("/info", circularRouter);
router.use("/info", jobsRouter);
router.use("/info", tendersRouter);
router.use("/info", examApplicationsRouter);
router.use("/info", examNotificationsRouter);
router.use("/info", examTimeTableRouter);
router.use("/info", examJumblingCentersRouter);
router.get("/info", (req, res) => {
    console.log("Important_Information---GET");
    res.json({ message: "This is Important Inforamation" });
});

module.exports = router;

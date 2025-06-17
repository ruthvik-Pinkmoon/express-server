const express = require("express");
const router = express.Router();
const { Model_ExamNotifications } = require("../../models/Important_Information");

router.get("/exam_notifications/all", async (req, res) => {
  console.log("Info-Exam_Notifications::All-GET");
  try {
    const data = await Model_ExamNotifications.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/exam_notifications/recent/:n", async (req, res) => {
  console.log("Info-Exam_Notifications::Recent-GET");
  try {
    const n = parseInt(req.params.n) || 5;
    const data = await Model_ExamNotifications.find().sort({ createdAt: -1 }).limit(n);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/exam_notifications", async (req, res) => {
  console.log("Info-Exam_Notifications-POST");
  try {
    const created = await new Model_ExamNotifications(req.body).save();
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.patch("/exam_notifications/:dbid", async (req, res) => {
  console.log("Info-Exam_Notifications-PATCH");
  try {
    const updated = await Model_ExamNotifications.findByIdAndUpdate(req.params.dbid, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/exam_notifications/:dbid", async (req, res) => {
  console.log("Info-Exam_Notifications-DELETE");
  try {
    await Model_ExamNotifications.findByIdAndDelete(req.params.dbid);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;

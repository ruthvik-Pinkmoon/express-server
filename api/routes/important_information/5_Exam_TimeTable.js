const express = require("express");
const router = express.Router();
const { Model_ExamTimeTable } = require("../../models/Important_Information");

router.get("/exam_timetable/all", async (req, res) => {
  console.log("Info-Exam_TimeTable::All-GET");
  try {
    const data = await Model_ExamTimeTable.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/exam_timetable/recent/:n", async (req, res) => {
  console.log("Info-Exam_TimeTable::Recent-GET");
  try {
    const n = parseInt(req.params.n) || 5;
    const data = await Model_ExamTimeTable.find().sort({ createdAt: -1 }).limit(n);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/exam_timetable", async (req, res) => {
  console.log("Info-Exam_TimeTable-POST");
  try {
    const created = await new Model_ExamTimeTable(req.body).save();
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.patch("/exam_timetable/:dbid", async (req, res) => {
  console.log("Info-Exam_TimeTable-PATCH");
  try {
    const updated = await Model_ExamTimeTable.findByIdAndUpdate(req.params.dbid, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/exam_timetable/:dbid", async (req, res) => {
  console.log("Info-Exam_TimeTable-DELETE");
  try {
    await Model_ExamTimeTable.findByIdAndDelete(req.params.dbid);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const { Model_ExamApplications } = require("../../models/Important_Information");

router.get("/exam_applications/all", async (req, res) => {
  console.log("Info-Exam_Applications::All-GET");
  try {
    const data = await Model_ExamApplications.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/exam_applications/recent/:n", async (req, res) => {
  console.log("Info-Exam_Applications::Recent-GET");
  try {
    const n = parseInt(req.params.n) || 5;
    const data = await Model_ExamApplications.find().sort({ createdAt: -1 }).limit(n);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/exam_applications", async (req, res) => {
  console.log("Info-Exam_Applications-POST");
  try {
    const created = await new Model_ExamApplications(req.body).save();
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.patch("/exam_applications/:dbid", async (req, res) => {
  console.log("Info-Exam_Applications-PATCH");
  try {
    const updated = await Model_ExamApplications.findByIdAndUpdate(req.params.dbid, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/exam_applications/:dbid", async (req, res) => {
  console.log("Info-Exam_Applications-DELETE");
  try {
    await Model_ExamApplications.findByIdAndDelete(req.params.dbid);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;

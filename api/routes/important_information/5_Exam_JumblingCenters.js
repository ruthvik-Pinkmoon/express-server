const express = require("express");
const router = express.Router();
const { Model_ExamJumblingCenters } = require("../../models/Important_Information");

router.get("/exam_jumblingcenters/all", async (req, res) => {
  console.log("Info-Exam_JumblingCenters::All-GET");
  try {
    const data = await Model_ExamJumblingCenters.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/exam_jumblingcenters/recent/:n", async (req, res) => {
  console.log("Info-Exam_JumblingCenters::Recent-GET");
  try {
    const n = parseInt(req.params.n) || 5;
    const data = await Model_ExamJumblingCenters.find().sort({ createdAt: -1 }).limit(n);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/exam_jumblingcenters", async (req, res) => {
  console.log("Info-Exam_JumblingCenters-POST");
  try {
    const created = await new Model_ExamJumblingCenters(req.body).save();
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.patch("/exam_jumblingcenters/:dbid", async (req, res) => {
  console.log("Info-Exam_JumblingCenters-PATCH");
  try {
    const updated = await Model_ExamJumblingCenters.findByIdAndUpdate(req.params.dbid, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/exam_jumblingcenters/:dbid", async (req, res) => {
  console.log("Info-Exam_JumblingCenters-DELETE");
  try {
    await Model_ExamJumblingCenters.findByIdAndDelete(req.params.dbid);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;

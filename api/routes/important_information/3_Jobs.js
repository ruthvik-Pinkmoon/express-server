const express = require("express");
const router = express.Router();
const { Model_Jobs } = require("../../models/Important_Information");

router.get("/jobs/all", async (req, res) => {
  console.log("Info-Jobs::All-GET");
  try {
    const data = await Model_Jobs.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/jobs/recent/:n", async (req, res) => {
  console.log("Info-Jobs::Recent-GET");
  try {
    const n = parseInt(req.params.n) || 5;
    const data = await Model_Jobs.find().sort({ createdAt: -1 }).limit(n);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/jobs", async (req, res) => {
  console.log("Info-Jobs-POST");
  try {
    const created = await new Model_Jobs(req.body).save();
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.patch("/jobs/:dbid", async (req, res) => {
  console.log("Info-Jobs-PATCH");
  try {
    const updated = await Model_Jobs.findByIdAndUpdate(req.params.dbid, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/jobs/:dbid", async (req, res) => {
  console.log("Info-Jobs-DELETE");
  try {
    await Model_Jobs.findByIdAndDelete(req.params.dbid);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;

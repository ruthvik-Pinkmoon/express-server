const express = require("express");
const router = express.Router();
const { Model_Circular } = require("../../models/Important_Information");

router.get("/circular/all", async (req, res) => {
  console.log("Info-Circular::All-GET");
  try {
    const data = await Model_Circular.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/circular/recent/:n", async (req, res) => {
  console.log("Info-Circular::Recent-GET");
  try {
    const n = parseInt(req.params.n) || 5;
    const data = await Model_Circular.find().sort({ createdAt: -1 }).limit(n);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/circular", async (req, res) => {
  console.log("Info-Circular-POST");
  try {
    const created = await new Model_Circular(req.body).save();
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.patch("/circular/:dbid", async (req, res) => {
  console.log("Info-Circular-PATCH");
  try {
    const updated = await Model_Circular.findByIdAndUpdate(req.params.dbid, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/circular/:dbid", async (req, res) => {
  console.log("Info-Circular-DELETE");
  try {
    await Model_Circular.findByIdAndDelete(req.params.dbid);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;

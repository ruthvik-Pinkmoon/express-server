const express = require("express");
const router = express.Router();
const { Model_Result } = require("../../models/Important_Information.js");

// GET all results
router.get("/results/all", async (req, res) => {
    console.log("Info-Results::All-GET");
    try {
        const results = await Model_Result.find();
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET recent n results
router.get("/results/recent/:n", async (req, res) => {
    console.log("Info-Results::Recent-GET");
    try {
        const n = parseInt(req.params.n) || 5;
        const results = await Model_Result.find()
            .sort({ createdAt: -1 })
            .limit(n);
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST new result
router.post("/results", async (req, res) => {
    console.log("Info-Results-POST");
    try {
        const result = new Model_Result(req.body);
        const saved = await result.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PATCH update result by ID
router.patch("/results/:dbid", async (req, res) => {
    console.log("Info-Results-PATCH");
    try {
        const updated = await Model_Result.findByIdAndUpdate(
            req.params.dbid,
            req.body,
            { new: true }
        );
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.delete("/results/:dbid", async (req, res) => {
    console.log("Info-Results-DELETE");
    try {
        await Model_Result.findByIdAndDelete(req.params.dbid);
        res.json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;

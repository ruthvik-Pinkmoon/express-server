const express = require("express");
const router = express.Router();
const { Model_Result } = require("../../models/Important_Information.js");

router.get("/results/file/view/:dbid", async (req, res) => {
    try {
        const fileDoc = await Model_Result.findById(req.params.dbid).select({
            file: 1,
        });

        if (!fileDoc || !fileDoc.file || !fileDoc.file.buffer) {
            return res.status(404).send("File not found");
        }

        const buffer = fileDoc.file.buffer; // ✅ real Buffer from Mongoose

        const { mimetype, originalname } = fileDoc.file;

        res.setHeader("Content-Type", mimetype || "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `inline; filename="${originalname}"`
        );
        res.setHeader("Content-Length", buffer.length);

        return res.send(buffer);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
});

router.get("/results/file/download/:dbid", async (req, res) => {
    try {
        const fileDoc = await Model_Result.findById(req.params.dbid).select({
            file: 1,
        }); // no .lean()

        if (!fileDoc || !fileDoc.file || !fileDoc.file.buffer) {
            return res.status(404).send("File not found");
        }

        const buffer = fileDoc.file.buffer;
        const { mimetype, originalname } = fileDoc.file;

        res.setHeader("Content-Type", mimetype || "application/octet-stream");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${originalname}"`
        );
        res.setHeader("Content-Length", buffer.length);

        return res.send(buffer);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
});

// GET all results
router.get("/results/all", async (req, res) => {
    console.log("Info-Results::All-GET");
    try {
        const results = await Model_Result.find().select({
            _id: 1,
            title: 1,
            date: 1,
            "file.originalname": 1,
        });
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
        const fields = {};
        for (const key in req.body) fields[key] = req.body[key];
        if (req?.files?.length) fields.file = req?.files[0];
        const result = new Model_Result(fields);
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

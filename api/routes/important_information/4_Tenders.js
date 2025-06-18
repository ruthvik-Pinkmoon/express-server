const express = require("express");
const router = express.Router();
const { Model_Tenders } = require("../../models/Important_Information");

router.get("/tenders/file/view/:dbid", async (req, res) => {
    try {
        const fileDoc = await Model_Jobs.findById(req.params.dbid).select({
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

router.get("/tenders/file/download/:dbid", async (req, res) => {
    try {
        const fileDoc = await Model_Jobs.findById(req.params.dbid).select({
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


router.get("/tenders/all", async (req, res) => {
  console.log("Info-Tenders::All-GET");
  try {
    const data = await Model_Tenders.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/tenders/recent/:n", async (req, res) => {
  console.log("Info-Tenders::Recent-GET");
  try {
    const n = parseInt(req.params.n) || 5;
    const data = await Model_Tenders.find().sort({ createdAt: -1 }).limit(n);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/tenders", async (req, res) => {
  console.log("Info-Tenders-POST");
  try {
    const created = await new Model_Tenders(req.body).save();
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.patch("/tenders/:dbid", async (req, res) => {
  console.log("Info-Tenders-PATCH");
  try {
    const updated = await Model_Tenders.findByIdAndUpdate(req.params.dbid, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/tenders/:dbid", async (req, res) => {
  console.log("Info-Tenders-DELETE");
  try {
    await Model_Tenders.findByIdAndDelete(req.params.dbid);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;

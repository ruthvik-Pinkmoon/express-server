const express = require("express");
const router = express.Router();
const {
    Model_ExamNotifications,
} = require("../../models/Important_Information");

router.get("/exam_notifications/file/view/:dbid", async (req, res) => {
    try {
        const fileDoc = await Model_ExamNotifications.findById(
            req.params.dbid
        ).select({
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

router.get("/exam_notifications/file/download/:dbid", async (req, res) => {
    try {
        const fileDoc = await Model_ExamNotifications.findById(
            req.params.dbid
        ).select({
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

router.get("/exam_notifications/all", async (req, res) => {
    console.log("Info-Exam_Notifications::All-GET");
    try {
        const data = await Model_ExamNotifications.find().select({
            _id: 1,
            title: 1,
            date: 1,
            "file.originalname": 1,
        });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/exam_notifications/recent/:n", async (req, res) => {
    console.log("Info-Exam_Notifications::Recent-GET");
    try {
        const n = parseInt(req.params.n) || 5;
        const data = await Model_ExamNotifications.find()
            .select({
                _id: 1,
                title: 1,
                date: 1,
                "file.originalname": 1,
            })
            .sort({ createdAt: -1 })
            .limit(n);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/exam_notifications", async (req, res) => {
    console.log("Info-Exam_Notifications-POST");
    try {
        const fields = {};
        for (const key in req.body) fields[key] = req.body[key];
        if (req?.files?.length) fields.file = req?.files[0];
        const result = new Model_ExamNotifications(fields);
        const saved = await result.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.patch("/exam_notifications/:dbid", async (req, res) => {
    console.log("Info-Exam_Notifications-PATCH");
    try {
        const fields = {};
        for (const key in req.body) fields[key] = req.body[key];
        if (req?.files?.length) fields.file = req?.files[0];
        if (fields?.file && !fields?.file?.originalname) {
            delete fields.file;
        }
        const updated = await Model_ExamNotifications.findByIdAndUpdate(
            req.params.dbid,
            { $set: fields },
            { new: true }
        );
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

const express = require("express");
const voiceRoute = express.Router();
const voiceSchema = require("../models/Voices.js");
const authenticationMiddleware = require("../middlewares/authentication.js");

// CREATE – Add a new voice
voiceRoute.post("/create-new-voice",authenticationMiddleware, async (req, res) => {
    try {
        const newVoice = new voiceSchema(req.body);
        const savedVoice = await newVoice.save();
        res.status(201).json({ success: true, data: savedVoice });
    } catch (err) {
        console.error("Create Error:", err);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

// READ – Get all voices
voiceRoute.get("/", async (req, res) => {
    try {
        const voices = await voiceSchema.find().sort({ date: -1 });
        res.status(200).json({ success: true, data: voices });
    } catch (err) {
        console.error("Fetch Error:", err);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

// READ – Get voice by ID
voiceRoute.get("/:id", async (req, res) => {
    try {
        const voice = await voiceSchema.findById(req.params.id);
        if (!voice) return res.status(404).json({ success: false, error: "Voice not found" });

        res.status(200).json({ success: true, data: voice });
    } catch (err) {
        console.error("Fetch By ID Error:", err);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

// UPDATE – Update voice by ID
voiceRoute.put("/update-new-voice/:id",authenticationMiddleware ,async (req, res) => {
    try {
        const updatedVoice = await voiceSchema.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedVoice) return res.status(404).json({ success: false, error: "Voice not found" });

        res.status(200).json({ success: true, data: updatedVoice });
    } catch (err) {
        console.error("Update Error:", err);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

// DELETE – Delete voice by ID
voiceRoute.delete("/delete-new-voice/:id", authenticationMiddleware,async (req, res) => {
    try {
        const deletedVoice = await voiceSchema.findByIdAndDelete(req.params.id);
        if (!deletedVoice) return res.status(404).json({ success: false, error: "Voice not found" });

        res.status(200).json({ success: true, message: "Voice deleted successfully" });
    } catch (err) {
        console.error("Delete Error:", err);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

module.exports = voiceRoute;

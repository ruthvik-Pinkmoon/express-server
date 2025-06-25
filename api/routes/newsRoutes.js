const express = require("express");
const multer = require("multer");
const newsSchema = require("../models/LatestNews.js");
const authenticationMiddleware = require("../middlewares/authentication.js");

const newsRoute = express.Router();

// Multer configuration
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png"];

    if (file.mimetype === "image/gif") {
      return cb(new Error("GIF format is not allowed."), false);
    }

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPG, and PNG are allowed."), false);
    }
  },
});

// GET all newss
newsRoute.get("/" ,async (req, res) => {
  try {
    const newss = await newsSchema.find().sort({ date: -1 });
    res.status(200).json({ success: true, data: newss });
  } catch (err) {
    console.error("Fetch Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
newsRoute.get("/file/:id", async (req, res) => {
  try {
    const notification = await newsSchema.findById(req.params.id);

    if (!notification || !notification.file) {
      return res.status(404).json({ error: "File not found." });
    }

    res.set("Content-Type", notification.file.contentType);
    res.send(notification.file.data);
  } catch (err) {
    console.error("File Fetch Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// CREATE new news (already done, here for reference)
newsRoute.post("/create-new-news", authenticationMiddleware,upload.single("file"), async (req, res) => {
  try {
    const { title, description, isImportant, date } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    const newnews = new newsSchema({
      title,
      isImportant,
      description,
      date: new Date(date),
      file: {
        data: req.file.buffer,
        contentType: req.file.mimetype,
        fileName: req.file.originalname,
      },
    });

    await newnews.save();

    res
      .status(201)
      .json({ success: true, message: "news created successfully." });
  } catch (err) {
    console.error("Save Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// UPDATE news
newsRoute.put("/update-news/:id",authenticationMiddleware ,upload.single("file"), async (req, res) => {
  try {
    const { title, isImportant, description, date } = req.body;

    const updateData = {
      title,
      isImportant,
      description,
      date: new Date(date),
    };

    if (req.file) {
      // Only if new file is uploaded
      updateData.file = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
        fileName: req.file.originalname,
      };
    }

    const updatednews = await newsSchema.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatednews) {
      return res.status(404).json({ error: "news not found." });
    }

    res.status(200).json({
      success: true,
      message: "news updated successfully.",
      data: updatednews,
    });
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// DELETE news
newsRoute.delete("/delete-news/:id", authenticationMiddleware,async (req, res) => {
  try {
    const deletednews = await newsSchema.findByIdAndDelete(req.params.id);

    if (!deletednews) {
      return res.status(404).json({ error: "news not found." });
    }

    res
      .status(200)
      .json({ success: true, message: "news deleted successfully." });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Multer error handler
newsRoute.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ error: "File size should not exceed 5MB." });
    }
  } else if (
    err.message.includes("Invalid file type") ||
    err.message.includes("GIF format is not allowed")
  ) {
    return res.status(400).json({ error: err.message });
  }
  next(err);
});

module.exports = newsRoute;

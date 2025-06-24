const express = require("express");
const multer = require("multer");
const notificationSchema = require("../models/Notifications.js");
const authenticationMiddleware = require("../middlewares/authentication.js");


const notificationrouter = express.Router();

// Multer configuration
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
      "image/jpeg",
      "image/png",
    ];

    if (file.mimetype === "image/gif") {
      return cb(new Error("GIF format is not allowed."), false);
    }

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only PDF, Word, Text, JPG, and PNG are allowed."), false);
    }
  },
});

// GET all notifications
notificationrouter.get("/",authenticationMiddleware,async (req, res) => {
  try {
    const notifications = await notificationSchema.find().sort({ date: -1 });
    res.status(200).json({ success: true, data: notifications });
  } catch (err) {
    console.error("Fetch Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
notificationrouter.get("/file/:id", async (req, res) => {
  try {
    const notification = await notificationSchema.findById(req.params.id);

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
// CREATE new notification (already done, here for reference)
notificationrouter.post("/create-new-notification", upload.single("file"), async (req, res) => {
  try {
    const { title, description, date } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    const newNotification = new notificationSchema({
      title,
      description,
      date: new Date(date),
      file: {
        data: req.file.buffer,
        contentType: req.file.mimetype,
        fileName: req.file.originalname, // ✅ store file name
      },
    });

    await newNotification.save();

    res.status(201).json({ success: true, message: "Notification created successfully." });
  } catch (err) {
    console.error("Save Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// UPDATE notification
notificationrouter.put("/update-notification/:id", upload.single("file"), async (req, res) => {
  try {
    const { title, description, date } = req.body;

    const updateData = { title, description, date };

    if (req.file) { 
      updateData.file = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
        fileName: req.file.originalname, // ✅ store file name
      };
    }

    const updatedNotification = await notificationSchema.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedNotification) {
      return res.status(404).json({ error: "Notification not found." });
    }

    res.status(200).json({ success: true, message: "Notification updated successfully.", data: updatedNotification });
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});




// DELETE notification
notificationrouter.delete("/delete-notification/:id", async (req, res) => {
  try {
    const deletedNotification = await notificationSchema.findByIdAndDelete(req.params.id);

    if (!deletedNotification) {
      return res.status(404).json({ error: "Notification not found." });
    }

    res.status(200).json({ success: true, message: "Notification deleted successfully." });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Multer error handler
notificationrouter.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "File size should not exceed 5MB." });
    }
  } else if (err.message.includes("Invalid file type") || err.message.includes("GIF format is not allowed")) {
    return res.status(400).json({ error: err.message });
  }
  next(err);
});

module.exports = notificationrouter;

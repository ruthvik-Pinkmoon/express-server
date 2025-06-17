const express = require("express");
const multer = require("multer");
const eventSchema = require("../models/LatestEvents.js");

const eventRoute = express.Router();

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

// GET all events
eventRoute.get("/", async (req, res) => {
  try {
    const events = await eventSchema.find().sort({ date: -1 });
    res.status(200).json({ success: true, data: events });
  } catch (err) {
    console.error("Fetch Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// CREATE new event (already done, here for reference)
eventRoute.post("/create-new-event", upload.single("file"), async (req, res) => {
  try {
    const { title, description ,date} = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    const newEvent = new eventSchema({
      title,
      description,
      date: new Date(date),
      file: {
        data: req.file.buffer,
        contentType: req.file.mimetype,
        fileName: req.file.originalname, 
      },
    });

    await newEvent.save();

    res.status(201).json({ success: true, message: "event created successfully." });
  } catch (err) {
    console.error("Save Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// UPDATE event
eventRoute.put("/update-event/:id", upload.single("file"), async (req, res) => {
  try {
    const { title, description,date } = req.body;

    const updateData = { title, description, date: new Date(date)  };

    if (req.file) {  // Only if new file is uploaded
      updateData.file = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
        fileName: req.file.originalname, 
      };
    }

    const updatedevent = await eventSchema.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedevent) {
      return res.status(404).json({ error: "event not found." });
    }
    

    res.status(200).json({ success: true, message: "event updated successfully.", data: updatedevent });
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



// DELETE event
eventRoute.delete("/delete-event/:id", async (req, res) => {
  try {
    const deletedevent = await eventSchema.findByIdAndDelete(req.params.id);

    if (!deletedevent) {
      return res.status(404).json({ error: "event not found." });
    }

    res.status(200).json({ success: true, message: "event deleted successfully." });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Multer error handler
eventRoute.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "File size should not exceed 5MB." });
    }
  } else if (err.message.includes("Invalid file type") || err.message.includes("GIF format is not allowed")) {
    return res.status(400).json({ error: err.message });
  }
  next(err);
});

module.exports = eventRoute;

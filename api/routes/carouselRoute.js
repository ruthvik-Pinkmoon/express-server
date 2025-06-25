const express = require("express");
const multer = require("multer");
const Carousel = require("../models/carouselModal");
const authenticationMiddleware = require("../middlewares/authentication");

const carouselRouter = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// POST: Add a new carousel item (with file upload)
carouselRouter.post("/", authenticationMiddleware,upload.single("img"), async (req, res) => {
  try {
    const { title, alignno } = req.body;
    // Check for duplicate alignno
    const exists = await Carousel.findOne({ alignno });
    if (exists) {
      return res
        .status(400)
        .json({ success: false, error: "alignno already exists" });
    }
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, error: "Image file is required" });
    }
    const img = req.file;
    const newItem = new Carousel({ img, title, alignno });
    const saved = await newItem.save();
    res.status(201).json({ success: true, data: saved });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// GET: Get all carousel items sorted by alignno
carouselRouter.get("/", async (req, res) => {
  try {
    const items = await Carousel.find().sort({ alignno: 1 });
    res.status(200).json({ success: true, data: items });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT: Update a carousel item by id (with optional file upload)
carouselRouter.put("/:id",authenticationMiddleware, upload.single("img"), async (req, res) => {
  try {
    const { title, alignno } = req.body;
    // Check for duplicate alignno (excluding self)
    const exists = await Carousel.findOne({
      alignno,
      _id: { $ne: req.params.id },
    });
    if (exists) {
      return res
        .status(400)
        .json({ success: false, error: "alignno already exists" });
    }
    const updateData = { title, alignno };
    if (req.file) {
      updateData.img = req.file;
    }
    const updated = await Carousel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// DELETE: Delete a carousel item by id and re-align others
carouselRouter.delete("/:id",authenticationMiddleware, async (req, res) => {
  try {
    const toDelete = await Carousel.findById(req.params.id);
    if (!toDelete)
      return res.status(404).json({ success: false, error: "Not found" });
    const deletedAlignno = toDelete.alignno;
    await Carousel.findByIdAndDelete(req.params.id);
    // Decrement alignno for all items with alignno > deletedAlignno
    await Carousel.updateMany(
      { alignno: { $gt: deletedAlignno } },
      { $inc: { alignno: -1 } }
    );
    res.status(200).json({ success: true, message: "Deleted and realigned" });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// GET: Serve image buffer for a carousel item by id
carouselRouter.get("/image/:id", async (req, res) => {
  try {
    const item = await Carousel.findById(req.params.id);
    if (!item || !item.img || !item.img.buffer) {
      return res.status(404).json({ success: false, error: "Image not found" });
    }
    res.setHeader("Content-Type", item.img.mimetype || "image/jpeg");
    res.setHeader(
      "Content-Disposition",
      `inline; filename=\"${item.img.originalname || "image"}\"`
    );
    res.send(item.img.buffer);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

module.exports = carouselRouter;

const express = require("express");
const multer = require("multer");
const Gallery = require("../models/gallery");
const authenticationMiddleware = require("../middlewares/authentication");

const galleryRouter = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// POST route to create a new gallery entry (with file upload and alignno logic)
galleryRouter.post(
  "/",
 authenticationMiddleware,
  upload.single("img"),
  async (req, res) => {
    try {
      const { title, description, alignno } = req.body;
      // Validate required fields
      if (!title || !alignno || !req.file) {
        return res
          .status(400)
          .json({
            success: false,
            error: "Title, alignno, and image are required",
          });
      }
      // Check for duplicate alignno
      const exists = await Gallery.findOne({ alignno });
      if (exists) {
        return res
          .status(400)
          .json({ success: false, error: "alignno already exists" });
      }
      const img = req.file;
      const newGalleryItem = new Gallery({
        title,
        description,
        alignno,
        img,
      });
      const savedGalleryItem = await newGalleryItem.save();
      res.status(201).json({ success: true, data: savedGalleryItem });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  }
);

// GET route to fetch all gallery entries sorted by alignno
galleryRouter.get("/", async (req, res) => {
  try {
    const galleryItems = await Gallery.find().sort({ alignno: 1 });
    res.status(200).json({ success: true, data: galleryItems });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT route to update a gallery entry by ID (with alignno logic)
galleryRouter.put(
  "/:id",
  authenticationMiddleware,
  upload.single("img"),
  async (req, res) => {
    try {
      const { title, description, alignno } = req.body;
      // Validate required fields
      if (!title || !alignno) {
        return res
          .status(400)
          .json({ success: false, error: "Title and alignno are required" });
      }
      // Check for duplicate alignno (excluding self)
      const exists = await Gallery.findOne({
        alignno,
        _id: { $ne: req.params.id },
      });
      if (exists) {
        return res
          .status(400)
          .json({ success: false, error: "alignno already exists" });
      }
      const updateData = { title, description, alignno };
      if (req.file) {
        updateData.img = req.file;
      }
      const updatedGalleryItem = await Gallery.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );
      if (!updatedGalleryItem) {
        return res
          .status(404)
          .json({ success: false, error: "Gallery item not found" });
      }
      res.status(200).json({ success: true, data: updatedGalleryItem });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  }
);

// DELETE route to delete a gallery entry by ID and re-align others
galleryRouter.delete("/:id", authenticationMiddleware, async (req, res) => {
  try {
    const toDelete = await Gallery.findById(req.params.id);
    if (!toDelete)
      return res
        .status(404)
        .json({ success: false, error: "Gallery item not found" });
    const deletedAlignno = toDelete.alignno;
    await Gallery.findByIdAndDelete(req.params.id);
    // Decrement alignno for all items with alignno > deletedAlignno
    await Gallery.updateMany(
      { alignno: { $gt: deletedAlignno } },
      { $inc: { alignno: -1 } }
    );
    res.status(200).json({ success: true, message: "Deleted and realigned" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET: Serve image buffer for a gallery item by id
galleryRouter.get("/image/:id", async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
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

module.exports = galleryRouter;

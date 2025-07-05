// routes/formRoutes.js
const express = require("express");
const adhocRoute = express.Router();
const FormSubmission = require("../../models/newAdhocModel"); // The schema we just made
const upload = require("../../middlewares/multerConfig"); // Multer config

// Helper to convert file object to schema format
const bufferify = (file) => {
  if (!file) return null;
  return {
    data: file.buffer,
    contentType: file.mimetype,
    fileName: file.originalname,
  };
};

adhocRoute.post("/", upload.fields([
  { name: "aadhaar" },
  { name: "pan" },
  { name: "ssc" },
  { name: "intermediate" },
  { name: "phdGraduation" },
  { name: "netORsetORslet" },
  { name: "mphil" },
  { name: "med" },
  { name: "bed" },
  { name: "set" },
  { name: "experience" },
  { name: "publication" },
  { name: "patentsProof" },
  { name: "photo" },
  { name: "signature" },
  { name: "graduation" },
  { name: "postGraduation" }, 
  { name: "additionalDegree" },
  { name: "additional" },
   { name: "publicationProof", maxCount: 1 },
]), async (req, res) => {
  try {
    const body = req.body;

    // ✅ Parse stringified arrays
    body.graduationDegrees = JSON.parse(body.graduationDegrees || "[]");
    body.postGraduationDegrees = JSON.parse(body.postGraduationDegrees || "[]");
    body.additionalDegrees = JSON.parse(body.additionalDegrees || "[]");
    body.nationalPatents = JSON.parse(body.nationalPatents || "[]");
    body.internationalPatents = JSON.parse(body.internationalPatents || "[]");

    // ✅ NEW: Parse these two array fields
    body.best3Articles = JSON.parse(body.best3Articles || "[]");
    body.awardsIfAny = JSON.parse(body.awardsIfAny || "[]");

    // 🧠 Attach files
    const files = req.files;

    const doc = new FormSubmission({
      ...body,
      aadhaar: bufferify(files?.aadhaar?.[0]),
      pan: bufferify(files?.pan?.[0]),
      ssc: bufferify(files?.ssc?.[0]),
      intermediate: bufferify(files?.intermediate?.[0]),
      phdGraduation: bufferify(files?.phdGraduation?.[0]),
      netORsetORslet: bufferify(files?.netORsetORslet?.[0]),
      mphil: bufferify(files?.mphil?.[0]),
      med: bufferify(files?.med?.[0]),
      bed: bufferify(files?.bed?.[0]),
      set: bufferify(files?.set?.[0]),
      experience: bufferify(files?.experience?.[0]),
      publication: bufferify(files?.publication?.[0]),
      patentsProof: bufferify(files?.patentsProof?.[0]),
      photo: bufferify(files?.photo?.[0]),
      signature: bufferify(files?.signature?.[0]),
      graduation: files?.graduation?.map(bufferify) || [],
      postGraduation: files?.postGraduation?.map(bufferify) || [],
      additionalDegree: files?.additionalDegree?.map(bufferify) || [],
      additional: files?.additional?.map(bufferify) || [],
    });

    const saved = await doc.save();
    res.status(201).json({ message: "Form submitted successfully", id: saved._id });
  } catch (err) {
    console.error("❌ Submission Error:", err);
    res.status(500).json({ error: "Form submission failed" });
  }
});


// 📌 GET: Fetch one form by ID
adhocRoute.get("/:id", async (req, res) => {
  try {
    const form = await FormSubmission.findById(req.params.id);
    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }
    res.status(200).json(form);
  } catch (err) {
    console.error("Get Form Error:", err);
    res.status(500).json({ error: "Failed to fetch form" });
  }
});

module.exports = adhocRoute;

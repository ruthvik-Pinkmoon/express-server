const express = require("express");
const mongoose = require("mongoose");
const AdmissionFees = require("../../models/fees/AdmissionFeesModal");
const authenticationMiddleware = require("../../middlewares/authentication");

const admissionFeesRouter = express.Router();

// CREATE
admissionFeesRouter.post("/", async (req, res) => {
  try {
    const newProgram = new AdmissionFees(req.body);
    const savedProgram = await newProgram.save();
    res.status(201).json({ success: true, data: savedProgram });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// READ ALL
// admissionFeesRouter.get('/',authenticationMiddleware, async (req, res) => {
//   try {
//     const programs = await AdmissionFees.find().sort({ createdAt: -1 });
//     res.status(200).json({ success: true, data: programs });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// });
admissionFeesRouter.get("/", async (req, res) => {
  try {
    const programs = await AdmissionFees.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: programs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});


// READ ONE
admissionFeesRouter.get("/:id", async (req, res) => {
  try {
    const program = await AdmissionFees.findById(req.params.id);
    if (!program)
      return res
        .status(404)
        .json({ success: false, error: "Program not found" });
    res.status(200).json({ success: true, data: program });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// UPDATE
admissionFeesRouter.put("/:id", authenticationMiddleware, async (req, res) => {
  try {
    const updatedProgram = await AdmissionFees.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedProgram)
      return res
        .status(404)
        .json({ success: false, error: "Program not found" });
    res.status(200).json({ success: true, data: updatedProgram });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// DELETE
admissionFeesRouter.delete(
  "/:id",
  authenticationMiddleware,
  async (req, res) => {
    try {
      const deletedProgram = await AdmissionFees.findByIdAndDelete(
        req.params.id
      );
      if (!deletedProgram)
        return res
          .status(404)
          .json({ success: false, error: "Program not found" });
      res.status(200).json({ success: true, data: deletedProgram });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
);

module.exports = admissionFeesRouter;

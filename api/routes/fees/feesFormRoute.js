const express = require("express");
const mongoose = require("mongoose");
const FeesForm = require("../../models/fees/feesForm");
const authenticationMiddleware = require("../../middlewares/authentication");

const feesRouter = express.Router();

// POST route to create a new fees form entry
feesRouter.post("/", async (req, res) => {
  try {
    const newForm = new FeesForm(req.body);
    const savedForm = await newForm.save();
    res.status(201).json({ success: true, data: savedForm });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// GET route to fetch all fees form entries
feesRouter.get("/",authenticationMiddleware, async (req, res) => {
  try {
    const forms = await FeesForm.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: forms });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = feesRouter;

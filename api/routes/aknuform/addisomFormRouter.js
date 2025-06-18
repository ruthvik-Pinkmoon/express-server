const express = require("express");
const addisomFormSchema = require("../../models/aknuform/admissionFrom");

const addisomFormRouter = express.Router();

// POST request - Create new form entry
addisomFormRouter.post("/create-new-admission", async (req, res) => {
  try {
    const newForm = new addisomFormSchema(req.body);
    const savedForm = await newForm.save();
    res.status(201).json(savedForm);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET request - Get all form entries
addisomFormRouter.get("/", async (req, res) => {
  try {
    const forms = await addisomFormSchema.find();
    res.status(200).json(forms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = addisomFormRouter;

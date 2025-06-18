const express = require("express");
const eventFormSchema = require("../../models/aknuform/eventForm");

const eventFormRouter = express.Router();

// POST request to create a new event form entry
eventFormRouter.post("/create-new-form", async (req, res) => {
  try {
    const newForm = new eventFormSchema(req.body);
    const savedForm = await newForm.save();
    res.status(201).json(savedForm);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET request to fetch all event form entries
eventFormRouter.get("/", async (req, res) => {
  try {
    const forms = await eventFormSchema.find();
    res.status(200).json(forms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = eventFormRouter;

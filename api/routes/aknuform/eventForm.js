const express = require("express");
const eventFormSchema = require("../../models/aknuform/eventForm");
const authenticationMiddleware = require("../../middlewares/authentication");

const eventFormRouter = express.Router();

// POST request to create a new event form entry
eventFormRouter.post("/create-new-form",authenticationMiddleware, async (req, res) => {
  try {
    const newForm = new eventFormSchema(req.body);
    const savedForm = await newForm.save();
    res.status(201).json(savedForm);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT request to update decision status
eventFormRouter.put("/update-decision/:id",authenticationMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.query;

    if (!["approve", "reject"].includes(action)) {
      return res
        .status(400)
        .json({ error: "Invalid action. Use 'approve' or 'reject'." });
    }

    const updatedForm = await eventFormSchema.findByIdAndUpdate(
      id,
      { decision: action === "approve" ? "approve" : "rejected" },
      { new: true }
    );

    if (!updatedForm) {
      return res.status(404).json({ error: "Form not found." });
    }

    res.status(200).json(updatedForm);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET request to fetch all event form entries
eventFormRouter.get("/", async (req, res) => {
  try {
    // Find forms where the decision is 'pending'
    const forms = await eventFormSchema.find();
    res.status(200).json(forms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET request to fetch filtered event form entries based on branch (and optionally other fields)



module.exports = eventFormRouter;

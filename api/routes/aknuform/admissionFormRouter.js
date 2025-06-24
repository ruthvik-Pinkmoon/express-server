const express = require("express");
const addisomFormSchema = require("../../models/aknuform/admissionFrom");

const authenticationMiddleware = require("../../middlewares/authentication")

const addisomFormRouter = express.Router();

// POST request - Create new form entry
addisomFormRouter.post("/create-new-admission" ,async (req, res) => {
  try {
    const newForm = new addisomFormSchema(req.body);
    const savedForm = await newForm.save();
    res.status(201).json(savedForm);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET request - Get all form entries
addisomFormRouter.get("/", authenticationMiddleware,async (req, res) => {
  try {
    const forms = await addisomFormSchema.find();
    res.status(200).json(forms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// PUT request to update decision status
addisomFormRouter.put("/update-decision/:id",authenticationMiddleware ,async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.query;

    if (!["approve", "reject"].includes(action)) {
      return res
        .status(400)
        .json({ error: "Invalid action. Use 'approve' or 'reject'." });
    }

    const updatedForm = await addisomFormSchema.findByIdAndUpdate(
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
module.exports = addisomFormRouter;

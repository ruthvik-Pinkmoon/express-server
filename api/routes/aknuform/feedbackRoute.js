const express = require('express');
const feedbackRoute = express.Router();
const FeedbackForm = require('../../models/aknuform/feedbackForm');
const authenticationMiddleware = require('../../middlewares/authentication');

// POST Route: Submit Feedback
feedbackRoute.post('/submit-feedback', async (req, res) => {
  try {
    const feedbackData = new FeedbackForm(req.body);
    await feedbackData.save();
    res.status(201).json({ message: 'Feedback submitted successfully!', data: feedbackData });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error submitting feedback', error });
  }
});

// GET Route: Get All Feedbacks
feedbackRoute.get('/submit-feedback', authenticationMiddleware,async (req, res) => {
  try {
    const feedbacks = await FeedbackForm.find();
    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching feedbacks', error });
  }
});

module.exports = feedbackRoute;

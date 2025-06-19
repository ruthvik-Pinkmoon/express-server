const express = require('express');
const alumniRoute = express.Router();
const AlumniRegistrationForm = require('../../models/aknuform/alumniRegistrationForm')

// POST Route: Register Alumni
alumniRoute.post('/alumni-registration', async (req, res) => {
  try {
    const alumniData = new AlumniRegistrationForm(req.body);
    await alumniData.save();
    res.status(201).json({ message: 'Alumni registered successfully!', data: alumniData });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error registering alumni', error });
  }
});

// GET Route: Get all Alumni
alumniRoute.get('/alumni-registration', async (req, res) => {
  try {
    const alumniList = await AlumniRegistrationForm.find();
    res.status(200).json(alumniList);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching alumni data', error });
  }
});

module.exports = alumniRoute;

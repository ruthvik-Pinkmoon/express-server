const express = require('express');
const mongoose = require('mongoose');
const ImportantDate = require('../models/important_dates');
const authenticationMiddleware = require('../middlewares/authentication');
const importantDatesRouter = express.Router();

// POST route to create a new important date entry
importantDatesRouter.post('/', authenticationMiddleware,async (req, res) => {
    try {
        const { color, date, title, program, description } = req.body;
    
        // Validate required fields
        if (!color || !date || !title || !program || !description) {
            return res.status(400).json({ success: false, error: 'All fields are required' });
        }
    
        const newImportantDate = new ImportantDate({
            color,
            date,
            title,
            program,
            description
        });
    
        const savedImportantDate = await newImportantDate.save();
        res.status(201).json({ success: true, data: savedImportantDate });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// GET route to fetch all important date entries
importantDatesRouter.get('/', async (req, res) => {
    try {
        const importantDates = await ImportantDate.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: importantDates });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// PUT route to update an important date entry by ID
importantDatesRouter.put('/:id',authenticationMiddleware ,async (req, res) => {
    try {
        const { color, date, title, program, description } = req.body;

        // Validate required fields
        if (!color || !date || !title || !program || !description) {
            return res.status(400).json({ success: false, error: 'All fields are required' });
        }

        const updatedImportantDate = await ImportantDate.findByIdAndUpdate(
            req.params.id,
            { color, date, title, program, description },
            { new: true }
        );

        if (!updatedImportantDate) {
            return res.status(404).json({ success: false, error: 'Important date not found' });
        }

        res.status(200).json({ success: true, data: updatedImportantDate });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// DELETE route to delete an important date entry by ID
importantDatesRouter.delete('/:id',authenticationMiddleware, async (req, res) => {
    try {
        const deletedImportantDate = await ImportantDate.findByIdAndDelete(req.params.id);

        if (!deletedImportantDate) {
            return res.status(404).json({ success: false, error: 'Important date not found' });
        }

        res.status(200).json({ success: true, data: deletedImportantDate });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = importantDatesRouter;
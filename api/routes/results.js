const express = require('express');
const ExcelJS = require('exceljs');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const ResultBatch = require('../models/ResultBatch');
const StudentResult = require('../models/StudentResult');
const authenticationMiddleware = require('../middlewares/authentication');

const upload = multer({ dest: 'uploads/' });

const resultsRouter = express.Router();

resultsRouter.post('/upload',authenticationMiddleware, upload.single('file'), async (req, res) => {
  try {
    const { title, level, resultDate } = req.body;
    const filePath = req.file?.path;

    // 1. Validate inputs
    if (!title || !level || !resultDate || !filePath) {
      return res.status(400).json({ error: "Missing required fields: title, level, resultDate, or file." });
    }

    // 2. Get or create ResultBatch
    let resultBatch = await ResultBatch.findOne({ title });
    if (!resultBatch) {
      resultBatch = await ResultBatch.create({
        title,
        level,
        resultDate: new Date(resultDate),
      });
    }

    const resultBatchId = resultBatch._id;

    // 3. Load Excel file
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    const worksheet = workbook.worksheets[0];
    const headers = worksheet.getRow(1).values;

    for (let i = 2; i <= worksheet.rowCount; i++) {
      const row = worksheet.getRow(i);
      const rowData = {};

      headers.forEach((header, index) => {
        const cellValue = row.getCell(index).value;
        if (header && cellValue) {
          rowData[header.toString().trim()] = cellValue.toString().trim();
        }
      });

      const { hallticket, sname, ...rest } = rowData;
      if (!hallticket || !sname) continue;

      const semesters = {};

      // 4. Parse semester data like: sem1: English:40,Maths:50
      for (let key in rest) {
        if (key.toLowerCase().startsWith('sem')) {
          const subjectPairs = rest[key].split(',');
          semesters[key] = {};

          subjectPairs.forEach(pair => {
            const [subject, mark] = pair.split(':').map(s => s.trim());
            const isDangerous = ['__proto__', 'constructor'].includes(subject);
            const isValidMark = !isNaN(parseInt(mark));
            if (subject && !isDangerous && isValidMark) {
              semesters[key][subject] = parseInt(mark);
            }
          });
        }
      }

      // 5. Upsert StudentResult
      let student = await StudentResult.findOne({
        hallticket,
        resultBatch: resultBatchId,
      });

      if (!student) {
        // Create new student
        await StudentResult.create({
          hallticket,
          sname,
          resultBatch: resultBatchId,
          semesters,
        });
      } else {
        // 🔥 Overwrite semesters properly (this is the fixed part)
        for (const sem in semesters) {
          student.semesters.set(sem, semesters[sem]); // full replace
        }

        student.sname = sname; // update name if needed
        await student.save();
      }
    }

    // 6. Clean up uploaded file
    fs.unlinkSync(path.resolve(filePath));

    res.status(200).json({ message: "Upload and update complete ✅" });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Error processing file. Check logs." });
  }
});

resultsRouter.get("/", async (req, res) => {
  try {
    const { title, hallticket } = req.query;

    if (!title) {
      return res.status(400).json({ error: "Missing title (result batch name)" });
    }

    const batch = await ResultBatch.findOne({ title });
    if (!batch) {
      return res.status(404).json({ error: "Result batch not found" });
    }

    const query = { resultBatch: batch._id };

    if (hallticket) {
      query.hallticket = hallticket;
    }

    const results = await StudentResult.find(query).select("-__v").lean();

    res.status(200).json({
      resultBatch: title,
      totalResults: results.length,
      results,
    });
  } catch (error) {
    console.error("GET /results error:", error);
    res.status(500).json({ error: "Server error while fetching results" });
  }
});

module.exports = resultsRouter;
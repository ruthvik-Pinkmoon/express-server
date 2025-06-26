const express = require("express");
const multer = require("multer");
const ExcelJS = require("exceljs");
const fs = require("fs");
const path = require("path");
const Result = require("../models/resultSchema"); // Your updated schema

const resultRouter = express.Router();
const upload = multer({ dest: "uploads/" });

// 👇 These are your core fields
const knownExcelFields = [
  "RegisterNumber",
  "StudentName",
  "CourseName",
  "Semester",
  "SubjectName",
  "Grade",
  "Note"
];


resultRouter.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const filePath = req.file?.path;
    if (!filePath) return res.status(400).json({ error: "No file uploaded" });

    const { Level, ResultTitle, ResultDate } = req.body;

    if (!Level || !ResultTitle || !ResultDate) {
      return res.status(400).json({ error: "Missing Level, ResultTitle or ResultDate in form fields" });
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    const sheet = workbook.worksheets[0];

    const headerRow = sheet.getRow(1);
    const headers = headerRow.values.map(cell => cell?.toString().trim());

    for (let i = 2; i <= sheet.rowCount; i++) {
      const row = sheet.getRow(i).values;
      const rowData = {};

      for (let j = 1; j < headers.length; j++) {
        const key = headers[j];
        const value = row[j] instanceof Date
          ? row[j]
          : row[j]?.toString().trim();
        if (key) rowData[key] = value;
      }

      const baseData = {
        RegisterNumber: rowData["RegisterNumber"],
        StudentName: rowData["StudentName"],
        CourseName: rowData["CourseName"],
        Semester: rowData["Semester"],
        SubjectName: rowData["SubjectName"],
        Grade: rowData["Grade"],
        Note: rowData["Note"],
        Level,
        ResultTitle,
        ResultDate: new Date(ResultDate),
      };

      // Check for missing fields
      const missing = Object.entries(baseData).filter(([k, v]) => !v);
      if (missing.length) {
        //console.warn(`Skipping row ${i} — Missing:`, missing.map(([k]) => k));
        continue;
      }

      // Put unexpected columns into meta
      const meta = {};
      for (const key in rowData) {
        if (!knownExcelFields.includes(key)) {
          meta[key] = rowData[key];
        }
      }

      const fullDoc = { ...baseData, meta };

      await Result.findOneAndUpdate(
        {
          RegisterNumber: baseData.RegisterNumber,
          CourseName: baseData.CourseName,
          Semester: baseData.Semester,
          SubjectName: baseData.SubjectName,
        },
        fullDoc,
        { upsert: true, new: true }
      );
    }

    fs.unlinkSync(path.resolve(filePath));

    res.status(200).json({ message: "Upload success ✅" });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Server error during file processing" });
  }
});
module.exports = resultRouter;

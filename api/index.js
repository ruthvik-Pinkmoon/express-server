const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const XLSX = require("xlsx");
const { MongoClient } = require('mongodb');

const app = express();
const uri = 'mongodb+srv://Tom:Jerry@cluster0.yyxtymq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(uri);


app.use(cors({ origin: "*" }));


app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://adikavi-nannaya-university.vercel.app"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

app.get("/hello",(req, res) => {
  res.send("Hello Inegrated MongoDB")
})

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post("/upload", upload.any(), async (req, res) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://adikavi-nannaya-university.vercel.app"
  );
  try {
    const fields = {};
    const uploadsFolder = path.join(__dirname, "uploads");

    // Parse JSON string from frontend
    req.body = JSON.parse(req.body.data);

    for (const key in req.body) {
      fields[key] = req.body[key];
    }
    await client.connect();
    const db = client.db('myDatabase'); // choose a DB name
    const collection = db.collection('myCollection'); // choose a collection

    const result = await collection.insertOne(fields);
    if(result.insertedId) {
      console.log("Uploaded Documeny ID",result.insertedId);
      res.send("Submission successful");
      return;
    }

    const folderName = fields.name.trim().replace(/\s+/g, "_");
    const userFolder = path.join(uploadsFolder, folderName);
    if (!fs.existsSync(userFolder)) {
      fs.mkdirSync(userFolder, { recursive: true });
    }

    // Save files
    req.files.forEach((file) => {
      const filePath = path.join(userFolder, `${file.originalname}`);
      fs.writeFileSync(filePath, file.buffer);
    });

    // Excel logic
    const excelPath = path.join(__dirname, "submissions.xlsx");
    let workbook;
    let worksheet;
    let dataArray = [];

    if (fs.existsSync(excelPath)) {
      workbook = XLSX.readFile(excelPath);
      worksheet = workbook.Sheets[workbook.SheetNames[0]];
      dataArray = XLSX.utils.sheet_to_json(worksheet);
    } else {
      workbook = XLSX.utils.book_new();
    }

    // Add new record
    dataArray.push(fields);

    // Create new sheet and replace old one
    const newSheet = XLSX.utils.json_to_sheet(dataArray);
    workbook.Sheets["Submissions"] = newSheet;
    if (!workbook.SheetNames.includes("Submissions")) {
      workbook.SheetNames.push("Submissions");
    }

    XLSX.writeFile(workbook, excelPath);

    res.send("Submission successful");
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).send("Internal server error");
  }
});

module.exports = app;

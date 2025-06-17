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

const ADMIN_PASSWORD = "Admin@6734"
// const CLIENT_DOMAIN = "http://localhost:5173";
const CLIENT_DOMAIN = "https://adikavi-nannaya-university.vercel.app"

app.use(cors({ origin: CLIENT_DOMAIN }));

app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    CLIENT_DOMAIN
    // "*"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

app.get("/hello",(req, res) => {
  console.log("Hello From terminal")
  res.send("Hello Inegrated MongoDB")
})

const storage = multer.memoryStorage();
const upload = multer({ storage });

// =================================================================================================
app.post("/upload", upload.any(), async (req, res) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    CLIENT_DOMAIN
  );
  try {
    const fields = {};
    const uploadsFolder = path.join(__dirname, "uploads");

    // Parse JSON string from frontend
    req.body = JSON.parse(req.body.data);

    for (const key in req.body) {
      fields[key] = req.body[key];
    }
    fields.files = {}
    for (const key in req.files) {
      fields.files[key] = req.files[key];
    }

    fields.createdAt = new Date();

    await client.connect();
    const db = client.db('myDatabase'); // choose a DB name
    const collection = db.collection('myCollection'); // choose a collection

    const result = await collection.insertOne(fields);
    if(result.insertedId) {
      console.log("Uploaded Documeny ID",result.insertedId);
      res.status(200).send({success: true,message:"Submission successful",doc_id:result.insertedId, createdAt: fields.createdAt});
      return;
    } else {
      console.log("Upload Failed",result);
      res.status(500).send({success: false, message:"Submission failed"});
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

// =================================================================================================
app.post('/get-documents', upload.any(),async (req, res) => {
  console.log("New Post Request '/get-documents'",req.body)
  req.body = JSON.parse(req.body.data);
  const { adminPassword, limit, startDate, endDate, name, mobileNumber } = req.body;

  if (adminPassword !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    await client.connect();
    const db = client.db('myDatabase');
    const collection = db.collection('myCollection');

    const query = {};
    const sort = { _id: -1 };
    const orConditions = [];


    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = startDate;
      if (endDate) query.createdAt.$lte = endDate;
    }

    if (name) {
      orConditions.push({ name: { $regex: new RegExp(name, "i") } });
    }

    if (mobileNumber) {
      orConditions.push({ mobileNumber: { $regex: new RegExp(mobileNumber, "i") } });
    }

    if (orConditions.length > 0) {
      query.$or = orConditions;
    }


    const docs = await collection.find(query).sort(sort).limit(limit || 50).toArray();
    res.status(200).json({ success: true, data: docs });
  } catch (error) {
    console.error('Error retrieving documents:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await client.close();
  }
});


module.exports = app;
app.listen(3000)

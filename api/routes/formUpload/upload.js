const express = require("express");
const multer = require("multer");
const { MongoClient } = require("mongodb");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const client = new MongoClient(process.env.MONGO_DB);
const CLIENT_DOMAIN = process.env.CLIENT_DOMAIN;
const MONDODB_DB_NAME = process.env.MONDODB_DB_NAME;
const MONGO_DB_COLLECTION = process.env.MONGO_DB_COLLECTION;

router.post("/", upload.any(), async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", CLIENT_DOMAIN);
  res.setHeader("Access-Control-Allow-Origin", "*");
  try {
    const fields = {};
    req.body = JSON.parse(req.body.data);
    for (const key in req.body) fields[key] = req.body[key];

    fields.files = {};
    for (const key in req.files) fields.files[key] = req.files[key];
    fields.createdAt = new Date();

    await client.connect();
    const db = client.db(MONDODB_DB_NAME);
    const collection = db.collection(MONGO_DB_COLLECTION);

    const result = await collection.insertOne(fields);

    if (result.insertedId) {
      res.status(200).json({
        success: true,
        message: "Submission successful",
        doc_id: result.insertedId,
        createdAt: fields.createdAt,
      });
    } else {
      res.status(500).json({ success: false, message: "Submission failed" });
    }
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).send("Internal Server Error");
  } finally {
    await client.close();
  }
});

module.exports = router;

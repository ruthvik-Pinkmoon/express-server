const express = require("express");
const multer = require("multer");
const { MongoClient } = require("mongodb");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const client = new MongoClient(process.env.MONGO_DB);
const MONDODB_DB_NAME = "myDatabase"; // Replace with your actual database name
const MONGO_DB_COLLECTION = "myCollection"; // Replace with your actual collection name

router.post("/", upload.any(), async (req, res) => {
  console.log("___coneectiom success");
  
  const { limit, startDate, endDate, name, mobileNumber } = req.body;

  try {
    await client.connect();
    const db = client.db(MONDODB_DB_NAME);
    const collection = db.collection(MONGO_DB_COLLECTION);
    const query = {};
    const orConditions = [];

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    if (name) {
      orConditions.push({ name: { $regex: new RegExp(name, "i") } });
    }

    if (mobileNumber) {
      orConditions.push({
        mobileNumber: { $regex: new RegExp(mobileNumber, "i") },
      });
    }

    if (orConditions.length > 0) {
      query.$or = orConditions;
    }

    const docs = await collection
      .find(query)
      .sort({ _id: -1 })
      .limit(limit || 50)
      .toArray();
      console.log("Documents fetched:", docs.length);
    res.status(200).json({ success: true, data: docs });
  } catch (err) {
    console.error("Fetch Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await client.close();
  }
});

module.exports = router;

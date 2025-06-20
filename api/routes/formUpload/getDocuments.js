const express = require("express");
const multer = require("multer");
const { MongoClient } = require("mongodb");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });   

const client = new MongoClient(process.env.MONGO_DB);
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const MONDODB_DB_NAME = process.env.MONDODB_DB_NAME;

router.post("/", upload.any(), async (req, res) => {
  console.log("___coneectiom success")
  req.body = JSON.parse(req.body.data);
  const { adminPassword, limit, startDate, endDate, name, mobileNumber } =
    req.body;

  if (adminPassword !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    await client.connect();
    const db = client.db(MONDODB_DB_NAME);
    const collection = db.collection("aknu_form_upload");
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
    res.status(200).json({ success: true, data: docs });
  } catch (err) {
    console.error("Fetch Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await client.close();
  }
});

module.exports = router;

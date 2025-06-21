const express = require("express");
const chatrouter = express.Router();
const ChatWithUs = require("../../models/chatwithus/chatWithUs");

chatrouter.post("/details", async (req, res) => {
  try {
    const {
      name,
      email,
      office,
      countryCode,
      phone,
      aadhaar,
      message,
      department,
      subDepartment,
    } = req.body;

    // Create new chat entry
    const newEntry = new ChatWithUs({
      office,
      name,
      email,
      countryCode: countryCode || "+91",
      phone,
      aadhaar,
      message,
      department,
      subDepartment,
    });

    await newEntry.save();

    res.status(201).json({ success: true, message }); // You can remove otp from response when live
  } catch (error) {
    console.error("Error creating entry:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});
// GET /details
chatrouter.get("/", async (req, res) => {
  try {
    const entries = await ChatWithUs.find();

    res.status(200).json({
      success: true,
      data: entries,
    });
  } catch (error) {
    console.error("Error fetching entries:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = chatrouter;

// routes/otp.js
const express = require('express');
const otprouter = express.Router();
const Otp = require('../../models/chatwithus/otp');

// POST /generate-otp
otprouter.post('/generate-otp', async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ success: false, message: 'Phone number is required' });
    }

    // Generate 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    // Check if an OTP already exists for this phone (optional: you can overwrite)
    let existingOtp = await Otp.findOne({ phone });

    if (existingOtp) {
      // Update the existing OTP
      existingOtp.otp = otp;
      existingOtp.createdAt = new Date(); // Reset expiry timer
      await existingOtp.save();
    } else {
      // Create new OTP entry
      const newOtp = new Otp({ phone, otp });
      await newOtp.save();
    }

    // MOCK: Send OTP via SMS API (later)
    console.log(`OTP for ${phone} is ${otp}`);

    return res.status(200).json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error generating OTP:', error);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
});

module.exports = otprouter;

const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  file: {
    data: Buffer,            // This will store the file's binary data
    contentType: String,      // This will store the file's MIME type (like 'image/png', 'application/pdf')
     fileName:String
  }
});

module.exports = mongoose.model('Notification', notificationSchema,"notification");

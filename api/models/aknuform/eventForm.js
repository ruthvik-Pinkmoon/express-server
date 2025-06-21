const mongoose = require("mongoose");

const eventFormSchema = new mongoose.Schema({
  eventTitle: { type: String, required: true },
  name: { type: String, required: true },
 
  decision: { type: String, default:"pending"},
  location: { type: String, required: true },
  occupation: { type: String, required: true },
  
  phoneNumber: { type: String, required: true },
} ,{ timestamps: true })

module.exports = mongoose.model("eventsForm", eventFormSchema, "eventForm");

const mongoose = require("mongoose");

const eventFormSchema = new mongoose.Schema({
  eventTitle:{ type: String, required: true },
  name: { type: String, required: true },
  registrationNumber: { type: String, required: true },

  location: { type: String, required: true },
  branch: { type: String, required: true },
  phoneNumber: { type: String, required: true },
});

module.exports = mongoose.model("eventsForm", eventFormSchema, "eventForm");

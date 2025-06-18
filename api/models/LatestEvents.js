const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
   location: { type: String, required: true },
   isImportant:{type:Boolean,default:false,required:true},
  description: { type: String, required: true },
  date: { type: Date, required: true },
  file: {
    data: Buffer,            // This will store the file's binary data
    contentType: String  , 
    fileName:String
  }
});

module.exports = mongoose.model('events', eventSchema,"events");

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true,
    enum: ['admin', 'super_admin', 'user'], // You can customize roles
  },
  password: {
    type: String,
    required: true,
  }
}, { timestamps: true });

const User = mongoose.model('Authentication', userSchema,);

module.exports = User;

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  first_name: {
    type: String
  },
  last_name: {
    type: String
  },
  password: {
    type: String,
    required: true,
    min: 6
  },
  create_at: {
    type: Date,
    default: Date.now
  },
  update_at: { 
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('User', userSchema);
const mongoose = require('mongoose');

//------------ User Schema ------------//
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  course: {
    type: String,                                                                                          
    
  },
  batch: {
    type: String, 
  },
  rollno: {
    type: String, 
  },
  year: {
    type: String,
    
  },
  branch: {
    type: String,
    
  },
  phoneno: {
    type: String,
    required: true
  },
 
  gender: {
    type: String
  },
  role: {
    type: String,
    default: "user",
  },
  address: {
    type: String
  },
  password: {
    type: String,
    required: true
  },
  department: {
    type: String
  },
  qualification: {
    type: String
  },
  roa: {
    type: String
  },
  verified: {
    type: Boolean,
    default: false
  },
  resetLink: {
    type: String,
    default: ''
  }
}, { timestamps: true });


const User = mongoose.model('User', UserSchema);

module.exports = User; 

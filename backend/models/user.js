const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: [true,"First Name is required"]
  },
  lastname: {
    type: String,
    required: [true,"Lastt name is required"]
  },
  email: {
    type: String,
    required: [true,"Email is required"],
    unique: true
  },
  password: {
    type: String,
    required: [true,"Password is required"]
  },
  userType: {
    type: String,
    required: true,
    enum: ['user', 'host'],
    defaul:'user'
  }
});

module.exports = mongoose.model('User', userSchema);
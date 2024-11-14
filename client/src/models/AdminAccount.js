const mongoose = require('mongoose');

const adminAccountSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: String,
});

module.exports = mongoose.model('AdminAccount', adminAccountSchema);

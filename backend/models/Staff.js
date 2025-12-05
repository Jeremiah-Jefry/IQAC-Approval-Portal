const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema({
  name: String,
  email: String,
  department: String,
  password: String
});

module.exports = mongoose.model("Staff", staffSchema);

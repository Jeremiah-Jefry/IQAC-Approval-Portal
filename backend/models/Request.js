const mongoose = require("mongoose");

const approvalSchema = new mongoose.Schema({
  role: String,
  status: String,
  comments: String,
  decidedAt: Date
});

const requestSchema = new mongoose.Schema({
  staffId: String,
  staffName: String,
  department: String,

  eventName: String,
  eventDate: String,
  purpose: String,

  reportPath: String,

  referenceNo: String,
  workflowRoles: [String],
  approvals: [approvalSchema],

  currentRole: String,
  overallStatus: String,
  isCompleted: Boolean,

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Request", requestSchema);

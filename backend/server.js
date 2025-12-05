// ===============================
// IMPORTS
// ===============================
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

// MODELS
const User = require("./models/User");
const Staff = require("./models/staff");
const Request = require("./models/Request");

// APP SETUP
const app = express();
app.use(express.json());
app.use(cors());

// ===============================
// FILE UPLOAD CONFIG
// ===============================
const uploadFolder = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadFolder)) fs.mkdirSync(uploadFolder);

app.use("/uploads", express.static(uploadFolder));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadFolder),
  filename: (req, file, cb) =>
    cb(null, `report_${Date.now()}_${file.originalname}`)
});
const upload = multer({ storage });

// ===============================
// NORMALIZE APPROVAL FLOW ORDER
// ===============================
function normalizeFlow(arr) {
  const order = ["HOD", "PRINCIPAL", "DIRECTOR", "AO", "CEO"];
  if (!Array.isArray(arr)) return [];

  const set = new Set(arr.map(r => r.toUpperCase()));
  return order.filter(r => set.has(r));
}

// ===============================
// DEFAULT ROLE USERS
// ===============================
async function createDefaultRoles() {
  const roles = [
    { name: "IQAC User", role: "IQAC", password: "123" },
    { name: "HOD User", role: "HOD", password: "123" },
    { name: "Principal User", role: "PRINCIPAL", password: "123" },
    { name: "Director User", role: "DIRECTOR", password: "123" },
    { name: "AO User", role: "AO", password: "123" },
    { name: "CEO User", role: "CEO", password: "123" }
  ];

  for (let r of roles) {
    if (!(await User.findOne({ role: r.role }))) {
      await User.create(r);
    }
  }
}

// ===============================
// DEFAULT STAFF USERS
// ===============================
async function createDefaultStaffs() {
  const staffs = [
    { name: "gokul", email: "gokul@test.com", department: "CSE", password: "gokul123" },
    { name: "arun", email: "arun@test.com", department: "CSE", password: "arun123" },
    { name: "sathish", email: "sathish@test.com", department: "IT", password: "sathish123" },
    { name: "mani", email: "mani@test.com", department: "ECE", password: "mani123" },
    { name: "vijay", email: "vijay@test.com", department: "MECH", password: "vijay123" }
  ];

  for (let s of staffs) {
    if (!(await Staff.findOne({ name: s.name }))) {
      await Staff.create(s);
    }
  }
}

// ===============================
// DATABASE CONNECT
// ===============================
mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log("Mongo Connected");
  await createDefaultRoles();
  await createDefaultStaffs();
});

// ===============================
// LOGIN
// ===============================
app.post("/api/auth/login", async (req, res) => {
  try {
    let { role, name, password } = req.body;
    role = (role || "").toUpperCase();

    if (role === "STAFF") {
      const staff = await Staff.findOne({ name, password });
      if (!staff)
        return res.status(400).json({ error: "Invalid staff credentials" });

      return res.json({
        user: {
          id: staff._id,
          role: "STAFF",
          name: staff.name,
          department: staff.department
        }
      });
    }

    const user = await User.findOne({ role });
    if (!user)
      return res.status(400).json({ error: "Role not found in DB" });

    if (user.password !== password)
      return res.status(400).json({ error: "Invalid password" });

    res.json({ user });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

// ===============================
// STAFF REQUEST CREATE
// ===============================
app.post("/api/requests", upload.single("event_report"), async (req, res) => {
  try {
    const { staffId, event_name, event_date, purpose } = req.body;

    const staff = await Staff.findById(staffId);
    if (!staff) return res.status(400).json({ error: "Invalid staffId" });

    const file = req.file ? req.file.filename : null;

    const newReq = await Request.create({
      staffId,
      staffName: staff.name,
      department: staff.department,
      eventName: event_name,
      eventDate: event_date,
      purpose,
      reportPath: file,
      currentRole: "IQAC",
      overallStatus: "Waiting approval for IQAC",
      referenceNo: null,
      workflowRoles: [],
      approvals: [],
      isCompleted: false
    });

    res.json({ message: "Request created", request: newReq });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

// ===============================
// GET REQUESTS
// ===============================
app.get("/api/requests", async (req, res) => {
  try {
    const filter = {};
    if (req.query.staffId) filter.staffId = req.query.staffId;
    if (req.query.current_role)
      filter.currentRole = req.query.current_role.toUpperCase();

    const requests = await Request.find(filter).sort({ createdAt: -1 });
    const baseUrl = req.protocol + "://" + req.get("host");

    res.json(
      requests.map(r => ({
        ...r.toObject(),
        reportUrl: r.reportPath ? `${baseUrl}/uploads/${r.reportPath}` : null
      }))
    );
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

// ===============================
// REQUEST ACTION (APPROVE/RECREATE)
// ===============================
app.post("/api/requests/:id/action", async (req, res) => {
  try {
    const { action, comments, refNumber, flow } = req.body;

    const doc = await Request.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: "Invalid Request ID" });

    const role = doc.currentRole;
    const now = new Date();

    // Save approval entry
    doc.approvals.push({
      role,
      status: action === "approve" ? "Approved" : "Recreated",
      comments: comments || "",
      decidedAt: now
    });

    // IQAC sets workflow
    if (role === "IQAC" && action === "approve") {
      doc.referenceNo = refNumber;
      doc.workflowRoles = normalizeFlow(flow);
      doc.currentRole = doc.workflowRoles[0] || null;

      doc.overallStatus = doc.currentRole
        ? `Waiting approval for ${doc.currentRole}`
        : "Completed";

      if (!doc.currentRole) doc.isCompleted = true;

      await doc.save();
      return res.json({ message: "IQAC Approved" });
    }

    // Recreate request
    if (action === "recreate") {
      doc.currentRole = null;
      doc.overallStatus = `${role} requested recreation`;
      doc.isCompleted = false;

      await doc.save();
      return res.json({ message: "Recreate issued" });
    }

    // Approve next stage
    const seq = doc.workflowRoles;
    const idx = seq.indexOf(role);

    if (idx === seq.length - 1) {
      doc.currentRole = null;
      doc.overallStatus = "Completed";
      doc.isCompleted = true;
    } else {
      doc.currentRole = seq[idx + 1];
      doc.overallStatus = `Waiting approval for ${doc.currentRole}`;
      doc.isCompleted = false;
    }

    await doc.save();
    res.json({ message: "Status updated" });

  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

// ===============================
// APPROVAL REPORT (GENERATED TABLE)
// ===============================
app.get("/api/requests/:id/approval-letter", async (req, res) => {
  try {
    const doc = await Request.findById(req.params.id);
    if (!doc) return res.status(404).send("Not found");

    const flow = ["IQAC", ...(doc.workflowRoles || [])];

    const rows = flow.map((r) => {
      const a = doc.approvals.find(x => x.role === r);

      return `
        <tr>
          <td>${r}</td>
          <td>${a?.status === "Approved" ? "✔" : a?.status === "Recreated" ? "↩" : "Pending"}</td>
          <td>${a ? a.comments : "-"}</td>
          <td>${a ? new Date(a.decidedAt).toLocaleString() : "-"}</td>
        </tr>`;
    }).join("");

    res.send(`
      <html>
      <body>
        <h2>Approval Report</h2>
        <h3>Reference No: ${doc.referenceNo || "-"}</h3>
        <h3>Event: ${doc.eventName}</h3>
        <p><b>Staff:</b> ${doc.staffName}</p>
        <p><b>Department:</b> ${doc.department}</p>
        <p><b>Event Date:</b> ${doc.eventDate}</p>
        <p><b>Purpose:</b> ${doc.purpose}</p>
        <hr/>
        
        <table border="1" cellpadding="7" cellspacing="0">
          <tr>
            <th>Role</th>
            <th>Status</th>
            <th>Comments</th>
            <th>Date & Time</th>
          </tr>
          ${rows}
        </table>

      </body>
      </html>
    `);

  } catch (e) {
    res.status(500).send("Server error");
  }
});

// ===============================
// START SERVER
// ===============================
app.listen(5000, () => console.log("Backend running on 5000"));

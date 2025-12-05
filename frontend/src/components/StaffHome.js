import React, { useEffect, useState } from "react";
import {
  fetchStaffRequests,
  createRequest,
  approvalLetterUrl,
} from "../api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import useDisableBack from "./useDisableBack";

function StaffHome() {
  // ----------------------------------------
  // HOOKS
  // ----------------------------------------
  const navigate = useNavigate();
  useDisableBack();

  const [requests, setRequests] = useState([]);
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [purpose, setPurpose] = useState("");
  const [report, setReport] = useState(null);

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const staffId = user?.id;

  // ----------------------------------------
  // LOGOUT
  // ----------------------------------------
  const logout = () => {
    localStorage.removeItem("user");
    navigate("/", { replace: true });
  };

  // ----------------------------------------
  // LOAD STAFF REQUESTS
  // ----------------------------------------
  const loadRequests = async () => {
    try {
      if (!staffId) return;
      const res = await fetchStaffRequests(staffId);
      setRequests(res.data);
    } catch (err) {
      toast.error("Failed to load requests");
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  // ----------------------------------------
  // DETERMINE CARD COLOR
  // ----------------------------------------
  const getStatusColor = (req) => {
    const status = (req.overallStatus || "").toLowerCase();

    const isApproved =
      req.isCompleted ||
      status.includes("completed") ||
      status.includes("approved");

    if (isApproved) return "#e6ffed"; // light green

    if (req.currentRole === "IQAC") return "#ffe5e5"; // light red

    return "#fff8cc"; // light yellow
  };

  // ----------------------------------------
  // CREATE REQUEST
  // ----------------------------------------
  const submit = async (e) => {
    e.preventDefault();

    if (!report) {
      return toast.error("Please upload event report file");
    }

    const formData = new FormData();
    formData.append("staffId", staffId);
    formData.append("event_name", eventName);
    formData.append("event_date", eventDate);
    formData.append("purpose", purpose);
    formData.append("event_report", report);

    try {
      await createRequest(formData);
      toast.success("Request submitted!");

      // clear form
      setEventName("");
      setEventDate("");
      setPurpose("");
      setReport(null);

      loadRequests();
    } catch (err) {
      toast.error("Failed to submit request");
    }
  };

  // ----------------------------------------
  // UNAUTHORIZED
  // ----------------------------------------
  if (!user) {
    return (
      <div className="container mt-5 text-center">
        <h3 className="text-danger">Unauthorized Access</h3>
        <p>Please login again.</p>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/", { replace: true })}
        >
          Go to Login
        </button>
      </div>
    );
  }

  // ----------------------------------------
  // MAIN RENDER
  // ----------------------------------------
  return (
    <div className="container mt-4">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center">
        <h2 className="fw-bold text-primary">Staff Dashboard</h2>

        <button className="btn btn-danger btn-sm" onClick={logout}>
          Logout
        </button>
      </div>

      <h5 className="text-secondary">Welcome, {user.name}</h5>
      <hr />

      {/* CREATE REQUEST */}
      <div className="card shadow p-4">
        <h4 className="fw-bold mb-3">Create Event Request</h4>

        <form onSubmit={submit}>
          <input
            className="form-control mb-3"
            placeholder="Event Name"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            required
          />

          <input
            className="form-control mb-3"
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            required
          />

          <textarea
            className="form-control mb-3"
            placeholder="Purpose of Event"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            required
          />

          <input
            className="form-control mb-3"
            type="file"
            accept=".pdf,.jpg,.png,.doc,.docx"
            onChange={(e) => setReport(e.target.files[0])}
            required
          />

          <button className="btn btn-primary w-100">Submit</button>
        </form>
      </div>

      <hr className="my-4" />

      {/* REQUEST LIST */}
      <h3 className="fw-bold">Your Requests</h3>

      {requests.length === 0 && (
        <p className="text-muted">No requests submitted yet.</p>
      )}

      {requests.map((req) => {
        const bgColor = getStatusColor(req);

        const isApproved =
          req.isCompleted ||
          (req.overallStatus || "").toLowerCase().includes("completed");

        return (
          <div
            key={req._id}
            className="card p-3 mt-3 shadow-sm"
            style={{
              backgroundColor: bgColor,
              borderLeft: "6px solid rgba(0,0,0,0.2)",
            }}
          >
            <h5 className="fw-bold">{req.eventName}</h5>
            <p>
              <b>Date:</b> {req.eventDate}
            </p>
            <p>
              <b>Status:</b> {req.overallStatus}
            </p>

            {/* VIEW FILE */}
            {req.reportUrl && (
              <a
                className="btn btn-secondary btn-sm mt-2 w-100"
                href={req.reportUrl}
                target="_blank"
                rel="noreferrer"
              >
                View Uploaded File
              </a>
            )}

            {/* GENERATE APPROVAL REPORT (only after completion) */}
            {isApproved && (
              <button
                className="btn btn-success btn-sm mt-2 w-100"
                onClick={() =>
                  window.open(approvalLetterUrl(req._id), "_blank")
                }
              >
                Generate Approval Report
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default StaffHome;

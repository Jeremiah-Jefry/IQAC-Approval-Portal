import React, { useEffect, useState } from "react";
import {
  fetchRequestsForRole,
  actOnRequest,
  approvalLetterUrl,
} from "../api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import useDisableBack from "./useDisableBack";

function IQACHome() {
  // ------------------------------------
  // HOOKS
  // ------------------------------------
  const navigate = useNavigate();
  useDisableBack();

  const role = "IQAC";

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [refNumber, setRefNumber] = useState("");
  const [flowRoles, setFlowRoles] = useState([]);
  const [comments, setComments] = useState({}); // comments per request

  const flowOptions = ["HOD", "PRINCIPAL", "DIRECTOR", "AO", "CEO"];

  // ------------------------------------
  // LOGOUT
  // ------------------------------------
  const logout = () => {
    localStorage.removeItem("user");
    navigate("/", { replace: true });
  };

  // ------------------------------------
  // LOAD REQUESTS
  // ------------------------------------
  const loadRequests = async () => {
    try {
      const res = await fetchRequestsForRole(role);
      setRequests(res.data);
      setLoading(false);
    } catch (err) {
      toast.error("Failed to load requests");
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  // ------------------------------------
  // COMMENT HANDLER
  // ------------------------------------
  const handleCommentChange = (id, text) => {
    setComments((prev) => ({ ...prev, [id]: text }));
  };

  // ------------------------------------
  // APPROVE
  // ------------------------------------
  const handleApprove = async (id) => {
    const cmt = comments[id] || "";

    // Reference number required
    if (refNumber.trim().length !== 8) {
      return toast.error("Reference number must be 8 characters.");
    }

    // At least one next approver required
    if (flowRoles.length === 0) {
      return toast.error("Select at least one role for the workflow.");
    }

    try {
      await actOnRequest(id, {
        action: "approve",
        comments: cmt,
        refNumber,
        flow: flowRoles,
      });

      toast.success("Approved and forwarded!");

      // reset only for that card
      setComments((prev) => ({ ...prev, [id]: "" }));
      setRefNumber("");
      setFlowRoles([]);

      loadRequests();
    } catch {
      toast.error("Approval failed");
    }
  };

  // ------------------------------------
  // RECREATE
  // ------------------------------------
  const handleRecreate = async (id) => {
    const cmt = comments[id];

    if (!cmt || cmt.trim() === "") {
      return toast.error("Comments are required for recreation!");
    }

    try {
      await actOnRequest(id, {
        action: "recreate",
        comments: cmt,
      });

      toast.success("Sent back for recreation!");

      // reset comment only for this request
      setComments((prev) => ({ ...prev, [id]: "" }));

      loadRequests();
    } catch {
      toast.error("Recreate failed");
    }
  };

  if (loading) return <h4 className="text-center mt-5">Loading...</h4>;

  return (
    <div className="container mt-4">

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center">
        <h2 className="fw-bold text-primary">IQAC Dashboard</h2>

        <button className="btn btn-danger btn-sm" onClick={logout}>
          Logout
        </button>
      </div>

      <p className="text-muted">
        Review event requests, assign workflow, approve or recreate.
      </p>
      <hr />

      <div className="row">
        {requests.map((req) => (
          <div className="col-md-4" key={req._id}>
            <div className="card shadow p-3 mb-4">

              {/* BASIC DETAILS */}
              <h5 className="fw-bold">{req.eventName}</h5>
              <p><b>Event Date:</b> {req.eventDate}</p>
              <p><b>Staff:</b> {req.staffName}</p>
              <p><b>Status:</b> {req.overallStatus}</p>

              {/* VIEW REPORT FILE */}
              {req.reportUrl && (
                <a
                  href={req.reportUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2"
                >
                  View Uploaded Report
                </a>
              )}

              {/* SHOW APPROVAL REPORT WHEN COMPLETED */}
              {req.isCompleted && (
                <button
                  className="btn btn-success btn-sm mt-3 w-100"
                  onClick={() => window.open(approvalLetterUrl(req._id), "_blank")}
                >
                  Generate Approval Report
                </button>
              )}

              {/* SHOW IQAC ACTIONS ONLY WHEN WAITING FOR IQAC */}
              {req.currentRole === role && (
                <>
                  <hr />

                  {/* REFERENCE NO */}
                  <label className="fw-bold">Reference Number</label>
                  <input
                    type="text"
                    className="form-control mb-3"
                    maxLength="8"
                    value={refNumber}
                    onChange={(e) => setRefNumber(e.target.value)}
                  />

                  {/* WORKFLOW ROLES */}
                  <label className="fw-bold">Select Workflow Roles</label>
                  {flowOptions.map((r) => (
                    <div key={r}>
                      <input
                        type="checkbox"
                        checked={flowRoles.includes(r)}
                        onChange={() =>
                          setFlowRoles((prev) =>
                            prev.includes(r)
                              ? prev.filter((x) => x !== r)
                              : [...prev, r]
                          )
                        }
                      />
                      <label className="ms-2">{r}</label>
                    </div>
                  ))}

                  <hr />

                  {/* COMMENTS */}
                  <label className="fw-bold">Comments</label>
                  <textarea
                    className="form-control mb-3"
                    placeholder="Enter comments (required for recreate)"
                    value={comments[req._id] || ""}
                    onChange={(e) =>
                      handleCommentChange(req._id, e.target.value)
                    }
                  />

                  {/* ACTION BUTTONS */}
                  <button
                    className="btn btn-primary btn-sm me-2"
                    onClick={() => handleApprove(req._id)}
                  >
                    Approve
                  </button>

                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => handleRecreate(req._id)}
                  >
                    Recreate
                  </button>
                </>
              )}

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default IQACHome;

import React, { useState } from "react";

const ROLES = ["HOD", "PRINCIPAL", "DIRECTOR", "AO", "CEO"];

function ActionPopup({ role, request, onSubmit, onClose }) {
  const [action, setAction] = useState("approve");
  const [comments, setComments] = useState("");

  const [refNo, setRefNo] = useState("");
  const [selectedRoles, setSelectedRoles] = useState([]);

  const isIQAC = role === "IQAC";

  const toggleRole = (r) => {
    setSelectedRoles((prev) =>
      prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]
    );
  };

  const handleSubmit = () => {
    if (action === "approve" && isIQAC) {
      if (!/^[A-Za-z0-9]{8}$/.test(refNo)) {
        alert("Reference No must be 8 alphanumeric characters.");
        return;
      }
      if (selectedRoles.length === 0) {
        alert("Select at least one role for workflow.");
        return;
      }
    }

    const payload = {
      actor_role: role,
      action,
      comments,
    };

    if (isIQAC && action === "approve") {
      payload.reference_no = refNo;
      payload.workflow_roles = selectedRoles;
    }

    onSubmit(payload);
  };

  return (
    <div className="modal show" style={{ display: "block", background: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog">
        <div className="modal-content">

          <div className="modal-header">
            <h5>{role} - Action for Request #{request.id}</h5>
            <button className="btn-close" onClick={onClose} />
          </div>

          <div className="modal-body">
            {/* Action Selection */}
            <label className="form-label fw-bold">Select Action</label>
            <select
              className="form-select mb-3"
              value={action}
              onChange={(e) => setAction(e.target.value)}
            >
              <option value="approve">Approve</option>
              <option value="recreate">Recreate</option>
            </select>

            {/* IQAC-specific UI */}
            {isIQAC && action === "approve" && (
              <>
                <div className="mb-3">
                  <label className="form-label fw-bold">
                    Reference Number (8 Alphanumeric)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    maxLength="8"
                    value={refNo}
                    onChange={(e) => setRefNo(e.target.value)}
                  />
                </div>

                <div className="mb-2">
                  <label className="form-label fw-bold">
                    Select Workflow Roles
                  </label>
                  {ROLES.map((r) => (
                    <div key={r}>
                      <input
                        type="checkbox"
                        checked={selectedRoles.includes(r)}
                        onChange={() => toggleRole(r)}
                      />{" "}
                      {r}
                    </div>
                  ))}
                  <small className="text-muted">
                    Order is automatic: HOD → Principal → Director → AO → CEO
                  </small>
                </div>
              </>
            )}

            {/* Comments */}
            <div className="mb-3">
              <label className="form-label fw-bold">Comments (optional)</label>
              <textarea
                className="form-control"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows="2"
              />
            </div>
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button className="btn btn-success" onClick={handleSubmit}>
              Submit Action
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ActionPopup;

import React from "react";
import { approvalLetterUrl } from "../api";

function FinalApprovalLetterPreview({ request, onClose }) {
  if (!request) return null;

  const handleOpen = () => {
    window.open(approvalLetterUrl(request.id), "_blank");
  };

  return (
    <div className="modal show" style={{ display: "block", background: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">

          <div className="modal-header">
            <h5>Approval Letter Preview</h5>
            <button className="btn-close" onClick={onClose}/>
          </div>

          <div className="modal-body">
            <p>
              <b>Reference No:</b> {request.reference_no || "N/A"}
            </p>
            <p>
              <b>Event:</b> {request.event_name}
            </p>
            <p>
              <b>Requested By:</b> {request.staff_name}
            </p>

            <p className="text-muted">
              Click below to download final approval letter.
            </p>

            <button className="btn btn-success" onClick={handleOpen}>
              Open Approval Letter
            </button>
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default FinalApprovalLetterPreview;

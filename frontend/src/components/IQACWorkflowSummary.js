import React from "react";

function IQACWorkflowSummary({ referenceNo, selectedRoles }) {
  return (
    <div className="card p-3 mt-2 border-primary shadow-sm">
      <h5 className="text-primary">IQAC Approval Summary</h5>

      <p className="mb-1">
        <b>Reference Number:</b> {referenceNo || "Not assigned"}
      </p>

      <p className="mb-1">
        <b>Selected Workflow:</b>
      </p>

      {selectedRoles.length === 0 ? (
        <p className="text-danger">No roles selected.</p>
      ) : (
        <ul>
          {selectedRoles.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      )}

      <small className="text-muted">
        Roles will follow default sequence:
        <br />
        HOD → Principal → Director → AO → CEO
      </small>
    </div>
  );
}

export default IQACWorkflowSummary;

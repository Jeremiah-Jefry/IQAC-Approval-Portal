import React from "react";

function ApprovalHistoryCard({ approvals }) {
  if (!approvals || approvals.length === 0)
    return <p>No approvals yet.</p>;

  return (
    <div className="mt-3">
      {approvals.map((item, i) => (
        <div key={i} className="card mb-2 shadow-sm">
          <div className="card-body">
            <h6 className="fw-bold text-primary">{item.role}</h6>
            <p className="mb-1">
              <b>Status:</b> {item.status}
            </p>
            <p className="mb-1">
              <b>Comments:</b> {item.comments || "-"}
            </p>
            <p className="text-muted" style={{ fontSize: "13px" }}>
              {new Date(item.decided_at).toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ApprovalHistoryCard;

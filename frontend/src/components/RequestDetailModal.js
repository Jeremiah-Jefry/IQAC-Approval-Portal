import React from "react";

function RequestDetailModal({ data, onClose }) {
  const {
    id,
    staff_name,
    department,
    event_name,
    event_date,
    time_in,
    time_out,
    purpose,
    report_url,
    approvals,
  } = data;

  return (
    <div className="modal show" style={{ display: "block", background: "rgba(0,0,0,0.4)" }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5>Request #{id} - Details</h5>
            <button className="btn-close" onClick={onClose} />
          </div>

          <div className="modal-body">
            <h5 className="text-primary">{event_name}</h5>
            <p><b>Staff:</b> {staff_name} ({department})</p>
            <p><b>Event Date:</b> {event_date}</p>
            <p><b>Time:</b> {time_in} - {time_out}</p>
            <p><b>Purpose:</b> {purpose}</p>

            {report_url && (
              <p>
                <b>Event Report:</b>{" "}
                <a href={report_url} target="_blank" rel="noreferrer">
                  View / Download
                </a>
              </p>
            )}

            <hr />
            <h5>Approval Flow History</h5>

            {(!approvals || approvals.length === 0) ? (
              <p>No actions taken yet.</p>
            ) : (
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Comments</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {approvals.map((a, i) => (
                    <tr key={i}>
                      <td>{a.role}</td>
                      <td>{a.status}</td>
                      <td>{a.comments || "-"}</td>
                      <td>{new Date(a.decided_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RequestDetailModal;

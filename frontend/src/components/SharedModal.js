import React from "react";

function SharedModal({ title, children, footer, onClose }) {
  return (
    <div
      className="modal show"
      style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog">
        <div className="modal-content">

          <div className="modal-header">
            <h5>{title}</h5>
            <button className="btn-close" onClick={onClose} />
          </div>

          <div className="modal-body">{children}</div>

          <div className="modal-footer">
            {footer || (
              <button className="btn btn-secondary" onClick={onClose}>
                Close
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default SharedModal;

import React, { useState } from "react";

const CreateRequestPopup = ({ isOpen, onClose, onSubmit }) => {
  const [formValues, setFormValues] = useState({
    event_name: "",
    event_date: "",
    time_in: "",
    time_out: "",
    purpose: "",
    event_report: null,
  });

  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "event_report") {
      setFormValues((prev) => ({ ...prev, event_report: files[0] || null }));
    } else {
      setFormValues((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validate = () => {
    const newErrors = {};
    const today = new Date().toISOString().split("T")[0];

    if (!formValues.event_name) newErrors.event_name = "Event name is required.";
    if (!formValues.event_date) newErrors.event_date = "Event date is required.";
    else if (formValues.event_date < today)
      newErrors.event_date = "Event date cannot be in the past.";

    if (!formValues.time_in) newErrors.time_in = "Time in is required.";
    if (!formValues.time_out) newErrors.time_out = "Time out is required.";
    if (!formValues.purpose) newErrors.purpose = "Purpose is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(formValues);
    setFormValues({
      event_name: "",
      event_date: "",
      time_in: "",
      time_out: "",
      purpose: "",
      event_report: null,
    });
  };

  return (
    <div className="modal show" style={{ display: "block", background: "rgba(0,0,0,0.4)" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">Create Event Request</h5>
              <button type="button" className="btn-close" onClick={onClose} />
            </div>

            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Event Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="event_name"
                  value={formValues.event_name}
                  onChange={handleChange}
                />
                {errors.event_name && (
                  <small className="text-danger">{errors.event_name}</small>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Event Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="event_date"
                  value={formValues.event_date}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                />
                {errors.event_date && (
                  <small className="text-danger">{errors.event_date}</small>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Time In</label>
                <input
                  type="time"
                  className="form-control"
                  name="time_in"
                  value={formValues.time_in}
                  onChange={handleChange}
                />
                {errors.time_in && (
                  <small className="text-danger">{errors.time_in}</small>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Time Out</label>
                <input
                  type="time"
                  className="form-control"
                  name="time_out"
                  value={formValues.time_out}
                  onChange={handleChange}
                />
                {errors.time_out && (
                  <small className="text-danger">{errors.time_out}</small>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Purpose</label>
                <textarea
                  className="form-control"
                  name="purpose"
                  rows="2"
                  value={formValues.purpose}
                  onChange={handleChange}
                />
                {errors.purpose && (
                  <small className="text-danger">{errors.purpose}</small>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Event Report (optional)</label>
                <input
                  type="file"
                  className="form-control"
                  name="event_report"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Close
              </button>
              <button type="submit" className="btn btn-primary">
                Create Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateRequestPopup;

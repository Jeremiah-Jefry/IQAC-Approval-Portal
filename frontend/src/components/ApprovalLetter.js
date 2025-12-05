import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { approvalLetterUrl } from "../api";

function ApprovalLetter() {
  const { id } = useParams();
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(approvalLetterUrl(id));
  }, [id]);

  const downloadReport = () => {
    const a = document.createElement("a");
    a.href = url;
    a.download = `Approval_Report_${id}.html`;
    a.click();
  };

  return (
    <div className="container mt-5 text-center">
      <h2 className="fw-bold text-primary mb-4">
        Final Approval Report
      </h2>

      {url && (
        <>
          <iframe
            src={url}
            title="Approval Letter"
            width="100%"
            height="600px"
            style={{
              border: "2px solid #ccc",
              borderRadius: "12px",
              boxShadow: "0px 0px 6px rgba(0,0,0,0.1)",
            }}
          ></iframe>

          <button
            className="btn btn-success mt-4"
            onClick={downloadReport}
          >
            Download Report
          </button>
        </>
      )}
    </div>
  );
}

export default ApprovalLetter;

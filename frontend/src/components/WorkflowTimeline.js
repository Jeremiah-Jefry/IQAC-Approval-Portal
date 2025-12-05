import React from "react";

const circleStyle = (active) => ({
  width: "30px",
  height: "30px",
  borderRadius: "50%",
  backgroundColor: active ? "#007bff" : "#d3d3d3",
  color: active ? "white" : "black",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontWeight: "bold",
  margin: "0 auto",
});

function WorkflowTimeline({ currentRole, workflow }) {
  const fullFlow = ["STAFF", "IQAC", ...workflow, "Completed"];

  return (
    <div className="d-flex justify-content-between align-items-center mt-4"
         style={{ maxWidth: "800px", margin: "auto" }}>
      {fullFlow.map((role, index) => {
        const isActive =
          (currentRole && currentRole.toUpperCase() === role) ||
          (role === "STAFF" && currentRole === "IQAC") ||
          (role === "Completed" && currentRole === null);

        return (
          <div key={index} className="text-center">
            <div style={circleStyle(isActive)}>{index + 1}</div>
            <div style={{ marginTop: "8px", fontSize: "13px" }}>{role}</div>
          </div>
        );
      })}
    </div>
  );
}

export default WorkflowTimeline;

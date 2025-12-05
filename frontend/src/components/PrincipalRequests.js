import React from "react";
import RoleDashboard from "./RoleDashboard";

/**
 * Wrapper so that different roles can use the same dashboard UI
 */
function PrincipalRequests({ role }) {
  return <RoleDashboard role={role} />;
}

export default PrincipalRequests;

import React from "react";

function RoleRow({ request, onView, onAction }) {
  return (
    <tr>
      <td>{request.id}</td>
      <td>{request.event_name}</td>
      <td>{request.staff_name}</td>
      <td>{request.event_date}</td>
      <td>{request.overall_status}</td>
      <td>
        <button className="btn btn-info btn-sm" onClick={onView}>
          View
        </button>
      </td>
      <td>
        <button className="btn btn-primary btn-sm" onClick={onAction}>
          Action
        </button>
      </td>
    </tr>
  );
}

export default RoleRow;

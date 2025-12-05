import React, { useEffect, useState } from "react";
import { fetchAllRequests } from "../api";

function AllRequests() {
  const [requests, setRequests] = useState([]);

  const load = async () => {
    try {
      const res = await fetchAllRequests();
      setRequests(res.data?.requests || []);
    } catch (err) {
      console.error("Error fetching all requests:", err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="container mt-4">
      <h2>All Requests</h2>
      <div className="table-responsive mt-3">
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Event</th>
              <th>Staff</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center">
                  No requests found
                </td>
              </tr>
            ) : (
              requests.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.event_name}</td>
                  <td>{r.name}</td>
                  <td>{r.created_time}</td>
                  <td>{r.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AllRequests;

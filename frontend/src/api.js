import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// =============================================
// AUTH
// =============================================
export const loginUser = (data) =>
  API.post("/auth/login", data);

// =============================================
// STAFF: CREATE REQUEST
// =============================================
export const createRequest = (formData) =>
  API.post("/requests", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// =============================================
// STAFF: FETCH THEIR OWN REQUESTS
// =============================================
export const fetchStaffRequests = (staffId) =>
  API.get("/requests", {
    params: { staffId },
  });

// =============================================
// IQAC / ROLE USERS: FETCH REQUESTS BY ROLE
// =============================================
export const fetchRequestsForRole = (role) =>
  API.get("/requests", {
    params: { current_role: role },
  });

// =============================================
// FETCH SINGLE REQUEST DETAIL
// =============================================
export const getRequestDetail = (id) =>
  API.get(`/requests/${id}`);

// =============================================
// APPROVAL / RECREATE ACTION
// =============================================
export const actOnRequest = (id, payload) =>
  API.post(`/requests/${id}/action`, payload);

// =============================================
// APPROVAL REPORT (HTML)
// =============================================
export const approvalLetterUrl = (id) =>
  `${API.defaults.baseURL}/requests/${id}/approval-letter`;

export default API;

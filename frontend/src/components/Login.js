import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const navigate = useNavigate();

  const [role, setRole] = useState("staff");
  const [name, setName] = useState(""); // For staff only
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = { role, password };

      // For staff, include name
      if (role === "staff") {
        if (!name.trim()) {
          toast.error("Please enter your staff name.");
          setLoading(false);
          return;
        }
        payload.name = name.trim();
      }

      const res = await loginUser(payload);
      const user = res.data.user;

      // ✅ Save user info to localStorage so StaffHome works
      localStorage.setItem("user", JSON.stringify(user));

      toast.success(`Welcome, ${user.name}!`, { autoClose: 1200 });

      setTimeout(() => {
        setLoading(false);

        const routeMap = {
  STAFF: "/staff-home",
  IQAC: "/iqac-home",
  HOD: "/role/hod",
  PRINCIPAL: "/role/principal",
  DIRECTOR: "/role/director",
  AO: "/role/ao",
  CEO: "/role/ceo"
};

navigate(routeMap[user.role], { replace: true });

      }, 1300);
    } catch (err) {
      setLoading(false);
      const msg = err.response?.data?.error || "Login failed.";
      toast.error(msg);
    }
  };

  const isStaff = role === "staff";

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{ background: "linear-gradient(135deg, #f0f4ff, #ffffff)" }}
    >
      <ToastContainer />
      <div
        className="card shadow p-4"
        style={{ width: "400px", borderRadius: "16px" }}
      >
        <h3 className="text-center mb-3 text-primary fw-bold">
          Event Workflow Login
        </h3>

        <form onSubmit={handleLogin}>
          {/* Role Selection */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Role</label>
            <select
              className="form-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="staff">Staff</option>
              <option value="iqac">IQAC</option>
              <option value="hod">HOD</option>
              <option value="principal">Principal</option>
              <option value="director">Director</option>
              <option value="ao">AO</option>
              <option value="ceo">CEO</option>
            </select>
          </div>

          {/* Staff Name */}
          {isStaff && (
            <div className="mb-3">
              <label className="form-label fw-semibold">Staff Name</label>
              <input
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. gokul"
              />
              <small className="text-muted">
                Example: gokul, arun, sathish, mani, vijay
              </small>
            </div>
          )}

          {/* Password */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isStaff ? "e.g. gokul123" : "123"}
              required
            />
            {!isStaff && (
              <small className="text-muted">
                Default password for roles: <b>123</b>
              </small>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 fw-bold"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;

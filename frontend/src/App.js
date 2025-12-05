// src/App.js
import React from "react";
import { Routes, Route } from "react-router-dom";

import Login from "./components/Login";
import StaffHome from "./components/StaffHome";
import RoleDashboard from "./components/RoleDashboard";
import ApprovalLetter from "./components/ApprovalLetter";
import IQACHome from "./components/IQACHome";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ProtectedRoute from "./components/ProtectedRoute"; // if you use it

function App() {
  return (
    <>
      {/* 🔥 Global toast container for ALL pages */}
      <ToastContainer position="top-right" autoClose={2000} />

      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/staff-home"
          element={
            <ProtectedRoute role="staff">
              <StaffHome />
            </ProtectedRoute>
          }
        />

        <Route
          path="/iqac-home"
          element={
            <ProtectedRoute role="iqac">
              <IQACHome />
            </ProtectedRoute>
          }
        />

        <Route
          path="/role/:roleKey"
          element={
            <ProtectedRoute>
              <RoleDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/approval-letter/:id"
          element={
            <ProtectedRoute>
              <ApprovalLetter />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;

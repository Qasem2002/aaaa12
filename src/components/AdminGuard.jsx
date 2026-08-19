import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function AdminGuard() {
  const authed = sessionStorage.getItem("admin_auth") === "1";
  if (!authed) {
    return <Navigate to="/admin/login" replace />;
  }
  return <Outlet />;
}
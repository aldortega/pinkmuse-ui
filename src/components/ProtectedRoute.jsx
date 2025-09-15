import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
}


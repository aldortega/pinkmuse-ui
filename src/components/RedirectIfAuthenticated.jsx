import { Navigate } from "react-router-dom";

export default function RedirectIfAuthenticated({ children }) {
  const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

  if (token) {
    return <Navigate to="/home" replace />;
  }

  return children;
}

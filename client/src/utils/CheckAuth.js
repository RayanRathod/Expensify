import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

export default function CheckAuth({ children }) {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const token = Cookies.get("token");

  // ✅ Allow access if either Redux state OR token exists
  const isLoggedIn = isAuthenticated || !!token;

  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

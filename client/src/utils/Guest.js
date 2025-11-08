import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

export default function Guest({ children }) {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const token = Cookies.get("token");

  // ✅ If token exists, user is considered logged in
  const isLoggedIn = isAuthenticated || !!token;

  return !isLoggedIn ? children : <Navigate to="/" replace />;
}

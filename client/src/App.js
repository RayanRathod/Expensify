import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { setUser, logOut } from "./store/auth.js";
import NavBar from "./components/NavBar";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

function App() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const token = Cookies.get("token");

  useEffect(() => {
    async function fetchUser() {
      // If no token, skip API call
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const user = await res.json();
          dispatch(setUser(user));
        } else {
          // Token invalid — clear cookie and state
          Cookies.remove("token");
          dispatch(logOut());
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        Cookies.remove("token");
        dispatch(logOut());
      } finally {
        setIsLoading(false);
      }
    }

    fetchUser();
  }, [dispatch, token]);

  if (isLoading) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #1e3a8a 0%, #0f172a 50%, #1e40af 100%)",
        }}
      >
        <CircularProgress sx={{ color: "#ffffff" }} />
      </Box>
    );
  }

  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
}

export default App;

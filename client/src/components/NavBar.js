import * as React from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Tooltip,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import CategoryIcon from "@mui/icons-material/Category";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LoginIcon from "@mui/icons-material/Login";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import SavingsIcon from "@mui/icons-material/Savings";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../store/auth.js";
import Cookies from "js-cookie";

export default function NavBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);

  function handleLogout() {
    Cookies.remove("token");
    dispatch(logOut());
    navigate("/login");
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{
          background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
          boxShadow: "0px 4px 15px rgba(0,0,0,0.2)",
        }}
      >
        <Toolbar>
          {/* App Logo / Name */}
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              display: "flex",
              alignItems: "center",
              gap: 1,
              fontWeight: 600,
              letterSpacing: 0.5,
            }}
          >
            <SavingsIcon sx={{ fontSize: 26 }} />
            <Link
              to="/"
              style={{
                textDecoration: "none",
                color: "#fff",
                fontWeight: "bold",
              }}
            >
              SmartSpendr
            </Link>
          </Typography>

          {/* User Info */}
          {user && isAuthenticated && (
            <Typography
              sx={{
                marginRight: 2,
                fontStyle: "italic",
                fontSize: "0.9rem",
                color: "rgba(255,255,255,0.9)",
              }}
            >
              Hello, {user.firstName}
            </Typography>
          )}

          {/* Authenticated Menu */}
          {isAuthenticated && (
            <>
              <Link
                to="/dashboard"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Button
                  color="inherit"
                  startIcon={<DashboardIcon />}
                  sx={{
                    mx: 1,
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.15)",
                    },
                  }}
                >
                  Dashboard
                </Button>
              </Link>

              <Link
                to="/category"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Button
                  color="inherit"
                  startIcon={<CategoryIcon />}
                  sx={{
                    mx: 1,
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.15)",
                    },
                  }}
                >
                  Categories
                </Button>
              </Link>

              <Tooltip title="Logout">
                <IconButton
                  color="inherit"
                  onClick={handleLogout}
                  sx={{
                    ml: 1,
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.15)",
                    },
                  }}
                >
                  <LogoutIcon />
                </IconButton>
              </Tooltip>
            </>
          )}

          {/* Guest Menu */}
          {!isAuthenticated && (
            <>
              <Link to="/login" style={{ textDecoration: "none" }}>
                <Button
                  color="inherit"
                  startIcon={<LoginIcon />}
                  sx={{
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.15)",
                    },
                  }}
                >
                  Login
                </Button>
              </Link>

              <Link to="/register" style={{ textDecoration: "none" }}>
                <Button
                  color="inherit"
                  startIcon={<HowToRegIcon />}
                  sx={{
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.15)",
                    },
                  }}
                >
                  Register
                </Button>
              </Link>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}

import * as React from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Tooltip,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
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
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const isMobile = useMediaQuery("(max-width:768px)");

  function handleLogout() {
    Cookies.remove("token");
    dispatch(logOut());
    navigate("/login");
  }

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const menuItems = isAuthenticated
    ? [
        { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
        { text: "Categories", icon: <CategoryIcon />, path: "/category" },
      ]
    : [
        { text: "Login", icon: <LoginIcon />, path: "/login" },
        { text: "Register", icon: <HowToRegIcon />, path: "/register" },
      ];

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
          {/* Left Section - App Name */}
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
              Expensify
            </Link>
          </Typography>

          {/* Desktop View */}
          {!isMobile && (
            <>
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

              {menuItems.map((item) => (
                <Link
                  key={item.text}
                  to={item.path}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Button
                    color="inherit"
                    startIcon={item.icon}
                    sx={{
                      mx: 1,
                      textTransform: "none",
                      "&:hover": {
                        backgroundColor: "rgba(255,255,255,0.15)",
                      },
                    }}
                  >
                    {item.text}
                  </Button>
                </Link>
              ))}

              {isAuthenticated && (
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
              )}
            </>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              color="inherit"
              edge="end"
              onClick={toggleDrawer(true)}
              sx={{
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.15)",
                },
              }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{
            width: 250,
            background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
            height: "100%",
            color: "#fff",
          }}
          role="presentation"
          onClick={toggleDrawer(false)}
        >
          <Box sx={{ p: 2, borderBottom: "1px solid rgba(255,255,255,0.3)" }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: 1 }}
            >
              <SavingsIcon />
              Expensify
            </Typography>
            {user && isAuthenticated && (
              <Typography sx={{ fontSize: "0.85rem", opacity: 0.9 }}>
                Hello, {user.firstName}
              </Typography>
            )}
          </Box>

          <List>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton component={Link} to={item.path}>
                  <ListItemIcon sx={{ color: "white" }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}

            {isAuthenticated && (
              <ListItem disablePadding>
                <ListItemButton onClick={handleLogout}>
                  <ListItemIcon sx={{ color: "white" }}>
                    <LogoutIcon />
                  </ListItemIcon>
                  <ListItemText primary="Logout" />
                </ListItemButton>
              </ListItem>
            )}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
}

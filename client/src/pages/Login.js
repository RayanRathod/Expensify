import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Cookie from "js-cookie";
import { useDispatch } from "react-redux";
import { setUser } from "../store/auth.js";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [fieldsEmpty, setFieldsEmpty] = useState(true);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const form = {
      email: data.get("email"),
      password: data.get("password"),
    };

    const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
      method: "POST",
      body: JSON.stringify(form),
      headers: {
        "content-type": "application/json",
      },
    });

    const { token, user } = await res.json();

    if (res.ok) {
      Cookie.set("token", token);
      dispatch(setUser(user));
      navigate("/");
    } else {
      alert("Wrong email or password!");
    }
  };

  const handleFieldChange = (event) => {
    const email = event.target.form.elements.email.value;
    const password = event.target.form.elements.password.value;
    setFieldsEmpty(email.trim() === "" || password.trim() === "");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #1E3C72 0%, #2A5298 50%, #6A5ACD 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        px: { xs: 2, sm: 3 }, // ✅ responsive horizontal padding
        py: { xs: 4, sm: 6 }, // ✅ responsive vertical padding
      }}
    >
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            padding: { xs: 3, sm: 4 },
            borderRadius: 4,
            backgroundColor: "rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(12px)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
            textAlign: "center",
            width: "100%",
            maxWidth: "400px",
            mx: "auto",
          }}
        >
          <Avatar
            sx={{
              m: "auto",
              mb: 2,
              bgcolor: "rgba(255,255,255,0.3)",
              color: "#1E3C72",
              width: { xs: 56, sm: 64 },
              height: { xs: 56, sm: 64 },
            }}
          >
            <LockOutlinedIcon sx={{ fontSize: { xs: 28, sm: 32 } }} />
          </Avatar>

          <Typography
            component="h1"
            variant="h5"
            sx={{
              fontWeight: "bold",
              mb: 3,
              textShadow: "1px 1px 10px rgba(0,0,0,0.3)",
              fontSize: { xs: "1.4rem", sm: "1.6rem" },
            }}
          >
            Sign In to Expense Tracker
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={handleFieldChange}
              InputLabelProps={{
                style: { color: "#E0E0E0" },
              }}
              InputProps={{
                style: {
                  color: "white",
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#E0E0E0" },
                  "&:hover fieldset": { borderColor: "#90CAF9" },
                },
              }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={handleFieldChange}
              InputLabelProps={{
                style: { color: "#E0E0E0" },
              }}
              InputProps={{
                style: {
                  color: "white",
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#E0E0E0" },
                  "&:hover fieldset": { borderColor: "#90CAF9" },
                },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                background:
                  "linear-gradient(135deg, #6A5ACD 0%, #1E90FF 100%)",
                borderRadius: "30px",
                fontWeight: "bold",
                textTransform: "none",
                boxShadow: "0px 4px 15px rgba(0,0,0,0.3)",
                fontSize: { xs: "0.9rem", sm: "1rem" },
                py: { xs: 1.1, sm: 1.4 },
                transition: "0.3s",
                "&:hover": {
                  transform: "translateY(-3px)",
                  boxShadow: "0px 8px 25px rgba(0,0,0,0.5)",
                },
              }}
              disabled={fieldsEmpty}
            >
              Sign In
            </Button>

            <Grid container justifyContent="center">
              <Grid item>
                <RouterLink to="/register" style={{ textDecoration: "none" }}>
                  <Link
                    component="span"
                    variant="body2"
                    sx={{
                      color: "#BBDEFB",
                      "&:hover": { textDecoration: "underline" },
                      fontSize: { xs: "0.85rem", sm: "0.95rem" },
                    }}
                  >
                    Don’t have an account? Sign Up
                  </Link>
                </RouterLink>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

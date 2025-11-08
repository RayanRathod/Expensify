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

export default function Register() {
  const navigate = useNavigate();
  const [fieldsEmpty, setFieldsEmpty] = useState(true);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const form = {
      firstName: data.get("firstName"),
      lastName: data.get("lastName"),
      email: data.get("email"),
      password: data.get("password"),
    };

    const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/register`, {
      method: "POST",
      body: JSON.stringify(form),
      headers: {
        "content-type": "application/json",
      },
    });

    if (res.ok) {
      navigate("/login");
    } else {
      alert("Email address already exists!");
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
      }}
    >
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            padding: 4,
            borderRadius: 4,
            backgroundColor: "rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(12px)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
            textAlign: "center",
          }}
        >
          <Avatar
            sx={{
              m: "auto",
              mb: 2,
              bgcolor: "rgba(255,255,255,0.3)",
              color: "#1E3C72",
            }}
          >
            <LockOutlinedIcon />
          </Avatar>
          <Typography
            component="h1"
            variant="h5"
            sx={{
              fontWeight: "bold",
              mb: 3,
              textShadow: "1px 1px 10px rgba(0,0,0,0.3)",
            }}
          >
            Create Your Account
          </Typography>

          <Box component="form" noValidate onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  onChange={handleFieldChange}
                  InputLabelProps={{ style: { color: "#E0E0E0" } }}
                  InputProps={{
                    style: {
                      color: "white",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  onChange={handleFieldChange}
                  InputLabelProps={{ style: { color: "#E0E0E0" } }}
                  InputProps={{
                    style: {
                      color: "white",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  onChange={handleFieldChange}
                  InputLabelProps={{ style: { color: "#E0E0E0" } }}
                  InputProps={{
                    style: {
                      color: "white",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  onChange={handleFieldChange}
                  InputLabelProps={{ style: { color: "#E0E0E0" } }}
                  InputProps={{
                    style: {
                      color: "white",
                    },
                  }}
                />
              </Grid>
            </Grid>

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
                transition: "0.3s",
                "&:hover": {
                  transform: "translateY(-3px)",
                  boxShadow: "0px 8px 25px rgba(0,0,0,0.5)",
                },
              }}
              disabled={fieldsEmpty}
            >
              Sign Up
            </Button>

            <Grid container justifyContent="center">
              <Grid item>
                <RouterLink to="/login" style={{ textDecoration: "none" }}>
                  <Link
                    component="span"
                    variant="body2"
                    sx={{
                      color: "#BBDEFB",
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    Already have an account? Sign In
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

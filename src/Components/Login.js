import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Box, Typography, Link } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Alert from "@mui/material/Alert";
import { Link as RouterLink, useNavigate } from "react-router-dom";

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://securing.onrender.com/auth/login",
        {
          username: username,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
          },
        }
      );
      const token = response.data.access_token;
      const isAdmin = response.data.isAdmin;
      onLoginSuccess(username, token, isAdmin);
      setError(null);
      navigate(isAdmin ? "/admin" : "/user");
    } catch (err) {
      console.error("Login error:", err);
      if (err.response && err.response.data) {
        setError(err.response.data.msg || "An error occurred during login");
      } else if (err.request) {
        setError("No response received from the server");
      } else {
        setError("Error setting up the request");
      }
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        maxWidth: 400,
        margin: "auto",
        padding: 2,
        border: "1px solid #ccc",
        borderRadius: 8,
        boxShadow: 3,
        bgcolor: "background.paper",
      }}
      component="form"
      onSubmit={handleLogin}
      noValidate>
      <LockOutlinedIcon sx={{ fontSize: 48, mb: 2 }} />
      <Typography component="h2" variant="h5" gutterBottom>
        Claims Management System Login
      </Typography>
      <TextField
        margin="normal"
        required
        fullWidth
        id="username"
        label="Username"
        name="username"
        autoComplete="username"
        autoFocus
        value={username}
        onChange={(e) => setUsername(e.target.value)}
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
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{
          mt: 3,
          mb: 2,
          bgcolor: "primary.main",
          color: "primary.contrastText",
        }}>
        Login
      </Button>
      {error && (
        <Alert severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      )}
      <Typography variant="body2" sx={{ mt: 2 }}>
        New User?{" "}
        <Link component={RouterLink} to="/register">
          Register
        </Link>
      </Typography>
    </Box>
  );
};

export default Login;

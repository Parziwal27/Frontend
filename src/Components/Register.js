import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Box, Typography, Link, Grid } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Alert from "@mui/material/Alert";
import { Link as RouterLink, useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    mobile: "",
    first_name: "",
    last_name: "",
    age: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "age") {
      // Only allow positive integers for age
      const ageValue = value.replace(/\D/g, "");
      setFormData({ ...formData, [name]: ageValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...formData,
        age: parseInt(formData.age, 10), // Convert age to integer
      };
      if (isNaN(dataToSend.age) || dataToSend.age <= 0 || dataToSend.age < 18) {
        setError("Please enter a valid age");
        return;
      }
      const response = await axios.post(
        "https://securing.onrender.com/auth/register",
        dataToSend,
        {
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
          },
        }
      );
      console.log("Registration successful:", response.data);
      setError(null);
      navigate("/login");
    } catch (err) {
      console.error("Registration error:", err);
      if (err.response && err.response.data) {
        setError(
          err.response.data.msg || "An error occurred during registration"
        );
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
      onSubmit={handleRegister}
      noValidate>
      <LockOutlinedIcon sx={{ fontSize: 48, mb: 2 }} />
      <Typography component="h2" variant="h5" gutterBottom>
        Register for Claims Management System
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            name="first_name"
            label="First Name"
            value={formData.first_name}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            name="last_name"
            label="Last Name"
            value={formData.last_name}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            name="username"
            label="Username"
            value={formData.username}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            name="email"
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            name="mobile"
            label="Mobile Number"
            value={formData.mobile}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            name="age"
            label="Age"
            type="number"
            inputProps={{ min: 0, step: 1 }}
            value={formData.age}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            value={formData.password}
            onChange={handleChange}
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
          bgcolor: "primary.main",
          color: "primary.contrastText",
        }}>
        Register
      </Button>
      {error && (
        <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
          {error}
        </Alert>
      )}
      <Typography variant="body2">
        Already have an account?{" "}
        <Link component={RouterLink} to="/login">
          Login
        </Link>
      </Typography>
    </Box>
  );
};

export default Register;

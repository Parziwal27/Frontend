// AdminDashboard.js
import React, { useState, useEffect } from "react";
import { Box, Typography, CircularProgress, Button } from "@mui/material";
import Sidebar from "./Sidebar_admin";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminDetails from "./AdminDetails";
import ConfirmUser from "./ConfirmUser";
import ApproveClaim from "./ConfirmClaim";

const AdminDashboard = ({ onLogout }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [currentAction, setCurrentAction] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    const token = sessionStorage.getItem("access_token");
    if (!token) {
      setError("No access token found. Please login again.");
      onLogout();
      return;
    }

    try {
      const response = await axios.get(
        "https://securing.onrender.com/api/user/details",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
      setError(`Failed to fetch user details: ${error.message}`);
      onLogout();
    } finally {
      setIsLoading(false);
    }
  };

  const handleSidebarItemClick = (action) => {
    setCurrentAction(action);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100%">
          <CircularProgress />
        </Box>
      );
    }

    switch (currentAction) {
      case "adminDetails":
        return <AdminDetails user={user} />;
      case "ConfirmUser":
        return <ConfirmUser />;
      case "Approveclaim":
        return <ApproveClaim />;
      default:
        return <Typography>Select an action from the sidebar</Typography>;
    }
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
        <Typography color="error" gutterBottom>
          {error}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/login")}>
          Go Back
        </Button>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
        <Typography>No user data available. Please login again.</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/login")}>
          Go Back
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar onItemClick={handleSidebarItemClick} onLogout={onLogout} />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Typography variant="h5">Welcome, {user.first_name}!</Typography>
        </Box>
        {renderContent()}
      </Box>
    </Box>
  );
};

export default AdminDashboard;

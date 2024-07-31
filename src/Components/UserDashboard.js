import React, { useState, useEffect } from "react";
import { Box, Typography, CircularProgress, Button } from "@mui/material";
import Sidebar from "./Sidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import UserDetails from "./UserDetails";
import AddPolicy from "./AddPolicy";
import UpdatePolicy from "./UpdatePolicy";
import DeletePolicy from "./DeletePolicy";
import ViewPolicy from "./ViewPolicy";
import ApplyClaim from "./ApplyClaim";

const UserDashboard = ({ onLogout }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [currentAction, setCurrentAction] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedPolicy, setSelectedPolicy] = useState(null);

  useEffect(() => {
    fetchUserDetails();
  }, []);

  useEffect(() => {
    if (currentAction === "addPolicy") {
      fetchPolicies();
    }
  }, [currentAction]);

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
      console.error("Full error object:", error);
      if (error.response) {
        setError(
          `Failed to fetch user details: ${
            error.response.data.msg || error.response.statusText
          }`
        );
      } else if (error.request) {
        setError("No response received from the server");
      } else {
        setError(`Error fetching user details: ${error.message}`);
      }
      onLogout();
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPolicies = async () => {
    const token = sessionStorage.getItem("access_token");
    setIsLoading(true);
    try {
      const response = await axios.get(
        "https://securing.onrender.com/api/policy",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      setPolicies(response.data);
      const uniqueCategories = [
        ...new Set(response.data.map((policy) => policy.category)),
      ];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Error fetching policies:", error);
      setError("Failed to fetch policies. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSidebarItemClick = (action) => {
    setCurrentAction(action);
    setSelectedCategory(null);
    setSelectedPolicy(null);
  };

  const handlePremiumPlanSelection = async (plan) => {
    setIsLoading(true);
    try {
      const token = sessionStorage.getItem("access_token");
      const policy_id = (Math.floor(Math.random() * 100000) + 1).toString();
      if (!user || !user.username) {
        alert("User information is missing or incomplete");
      }
      const response = await axios.put(
        `https://securing.onrender.com/api/policyholder/${user.username}`,
        {
          policy_id: policy_id,
          category: selectedCategory,
          policy_name: selectedPolicy.name,
          sum_assured: selectedPolicy.sum_assured,
          duration: plan.duration,
          premium: plan.premium,
          left_amount: selectedPolicy.sum_assured,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        alert("Policy added successfully!");
        setSelectedCategory(null);
        setSelectedPolicy(null);
        setCurrentAction(null);
      }
    } catch (error) {
      console.error("Error adding policy:", error);
      setError("Failed to add policy. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
      case "userDetails":
        return <UserDetails user={user} />;
      case "addPolicy":
        return (
          <AddPolicy
            categories={categories}
            policies={policies}
            selectedCategory={selectedCategory}
            selectedPolicy={selectedPolicy}
            onCategorySelect={(category) => setSelectedCategory(category)}
            onPolicySelect={(policy) => setSelectedPolicy(policy)}
            onPremiumPlanSelect={handlePremiumPlanSelection}
          />
        );
      case "updatePolicy":
        return <UpdatePolicy />;
      case "deletePolicy":
        return <DeletePolicy />;
      case "viewPolicy":
        return <ViewPolicy />;
      case "applyClaim":
        return <ApplyClaim />;
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
          Go to Login
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

export default UserDashboard;

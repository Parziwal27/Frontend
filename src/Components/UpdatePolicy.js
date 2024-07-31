// UpdatePolicy.js
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Button,
} from "@mui/material";
import axios from "axios";

const UpdatePolicy = () => {
  const [userPolicies, setUserPolicies] = useState([]);
  const [allPolicies, setAllPolicies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserPolicies();
    fetchAllPolicies();
  }, []);

  const fetchUserPolicies = async () => {
    const token = sessionStorage.getItem("access_token");
    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://securing.onrender.com/api/policyholder/${sessionStorage.getItem(
          "username"
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      setUserPolicies(response.data.policies);
      const uniqueCategories = [
        ...new Set(response.data.policies.map((policy) => policy.category)),
      ];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Error fetching user policies:", error);
      setError("Failed to fetch user policies. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllPolicies = async () => {
    const token = sessionStorage.getItem("access_token");
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
      setAllPolicies(response.data);
    } catch (error) {
      console.error("Error fetching all policies:", error);
      setError("Failed to fetch all policies. Please try again.");
    }
  };

  const getAvailablePlans = (category, policyName) => {
    const matchingPolicy = allPolicies.find(
      (policy) => policy.category === category && policy.name === policyName
    );
    return matchingPolicy ? matchingPolicy.premium_plans : [];
  };

  const handleUpdatePolicy = async () => {
    setIsLoading(true);
    try {
      const token = sessionStorage.getItem("access_token");
      const response = await axios.put(
        `https://securing.onrender.com/api/policyholder/${sessionStorage.getItem(
          "username"
        )}`,
        {
          policy_id: selectedPolicy.policy_id,
          category: selectedPolicy.category,
          policy_name: selectedPolicy.policy_name,
          sum_assured: selectedPolicy.sum_assured,
          duration: selectedPlan.duration,
          premium: selectedPlan.premium,
          left_amount: selectedPolicy.left_amount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        alert("Policy updated successfully!");
        setSelectedCategory(null);
        setSelectedPolicy(null);
        setSelectedPlan(null);
        fetchUserPolicies();
      }
    } catch (error) {
      console.error("Error updating policy:", error);
      setError("Failed to update policy. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const CategoryBox = ({ category, onClick }) => (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        m: 2,
        cursor: "pointer",
        textAlign: "center",
        "&:hover": {
          backgroundColor: "#e0e0e0",
        },
      }}
      onClick={() => onClick(category)}>
      <Typography variant="h5">{category}</Typography>
    </Paper>
  );

  const PolicyBox = ({ policy, onClick }) => (
    <Paper
      elevation={3}
      sx={{ p: 2, m: 1, cursor: "pointer", textAlign: "center" }}
      onClick={() => onClick(policy)}>
      <Typography variant="h6">{policy.policy_name}</Typography>
      <Typography>Sum Assured: {policy.sum_assured}</Typography>
      <Typography>Duration: {policy.duration}</Typography>
      <Typography>Premium: {policy.premium}</Typography>
    </Paper>
  );

  const PremiumPlanBox = ({ plan, onClick }) => (
    <Paper
      elevation={3}
      sx={{ p: 2, m: 1, cursor: "pointer", textAlign: "center" }}
      onClick={() => onClick(plan)}>
      <Typography variant="h6">{plan.duration}</Typography>
      <Typography>Premium: {plan.premium}</Typography>
    </Paper>
  );

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box>
      <Typography variant="h5">Update Policy</Typography>
      {!selectedCategory ? (
        <Box display="flex" flexWrap="wrap" justifyContent="center">
          {categories.map((category, index) => (
            <CategoryBox
              key={index}
              category={category}
              onClick={(category) => setSelectedCategory(category)}
            />
          ))}
        </Box>
      ) : !selectedPolicy ? (
        <Box display="flex" flexWrap="wrap" justifyContent="center">
          {userPolicies
            .filter((policy) => policy.category === selectedCategory)
            .map((policy, index) => (
              <PolicyBox
                key={index}
                policy={policy}
                onClick={(policy) => setSelectedPolicy(policy)}
              />
            ))}
        </Box>
      ) : !selectedPlan ? (
        <Box>
          <Typography variant="h6">Current Policy Details:</Typography>
          <Typography>Name: {selectedPolicy.policy_name}</Typography>
          <Typography>Sum Assured: {selectedPolicy.sum_assured}</Typography>
          <Typography>Duration: {selectedPolicy.duration}</Typography>
          <Typography>Premium: {selectedPolicy.premium}</Typography>
          <Typography variant="h6">Available Plans:</Typography>
          <Box display="flex" flexWrap="wrap" justifyContent="center">
            {getAvailablePlans(
              selectedPolicy.category,
              selectedPolicy.policy_name
            ).map((plan, index) => (
              <PremiumPlanBox
                key={index}
                plan={plan}
                onClick={(plan) => setSelectedPlan(plan)}
              />
            ))}
          </Box>
        </Box>
      ) : (
        <Box>
          <Typography variant="h6">New Plan Details:</Typography>
          <Typography>Duration: {selectedPlan.duration}</Typography>
          <Typography>Premium: {selectedPlan.premium}</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdatePolicy}>
            Confirm Update
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default UpdatePolicy;

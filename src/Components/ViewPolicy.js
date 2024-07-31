import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import axios from "axios";

const ViewPolicy = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
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
      setUserDetails(response.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
      setError("Failed to fetch user details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100%">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (
    !userDetails ||
    !userDetails.policies ||
    userDetails.policies.length === 0
  ) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100%">
        <Typography>No policies found.</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Your Policies
      </Typography>
      <Grid container spacing={2}>
        {userDetails.policies.map((policy) => (
          <Grid item xs={12} sm={6} md={4} key={policy.policy_id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {policy.policy_name}
                </Typography>
                <Typography>Category: {policy.category}</Typography>
                <Typography>Policy ID: {policy.policy_id}</Typography>
                <Typography>
                  Sum Assured: ${policy.sum_assured.toFixed(2)}
                </Typography>
                <Typography>Duration: {policy.duration}</Typography>
                <Typography>Premium: ${policy.premium.toFixed(2)}</Typography>
                <Typography>
                  Remaining Amount: ${policy.left_amount.toFixed(2)}
                </Typography>
                {policy.claimed_amounts.length > 0 && (
                  <Typography>
                    Claimed Amounts: {policy.claimed_amounts.join(", ")}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ViewPolicy;

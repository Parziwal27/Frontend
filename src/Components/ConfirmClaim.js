import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import axios from "axios";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

const ConfirmClaim = () => {
  const [users, setUsers] = useState([]);
  const [claims, setClaims] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [metrics, setMetrics] = useState({
    pendingClaims: 0,
    rejectedClaims: 0,
    acceptedClaims: 0,
  });

  useEffect(() => {
    fetchUsersAndClaims();
  }, []);

  const fetchUsersAndClaims = async () => {
    const token = sessionStorage.getItem("access_token");
    if (!token) {
      setError("No access token found. Please login again.");
      return;
    }
    setIsLoading(true);
    try {
      const [usersResponse, claimsResponse] = await Promise.all([
        axios.get("https://securing.onrender.com/api/policyholder", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }),
        axios.get("https://securing.onrender.com/api/claim", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }),
      ]);

      //   console.log("Users response:", usersResponse.data);
      //   console.log("Claims response:", claimsResponse.data);

      const verifiedUsers = usersResponse.data.filter(
        (user) => user.isVerified === "accepted"
      );
      const allClaims = claimsResponse.data;

      //   console.log("Verified users:", verifiedUsers);
      console.log("All claims:", allClaims);

      const usersWithMetrics = verifiedUsers.map((user) => {
        const userClaims = allClaims.filter(
          (claim) => claim.policyholder_id === user.Username
        );
        const pendingClaims = userClaims.filter(
          (claim) => claim.status === "pending"
        ).length;
        const rejectedClaims = userClaims.filter(
          (claim) => claim.status === "rejected"
        ).length;
        const acceptedClaims = userClaims.filter(
          (claim) => claim.status === "approved"
        ).length;

        // console.log(`Metrics for user ${user.Username}:`, {
        //   pendingClaims,
        //   rejectedClaims,
        //   acceptedClaims,
        // });

        return {
          ...user,
          metrics: {
            pendingClaims,
            rejectedClaims,
            acceptedClaims,
          },
          claims: userClaims,
        };
      });

      //   console.log("Users with metrics:", usersWithMetrics);

      setUsers(usersWithMetrics);
      setClaims(allClaims);

      // Calculate total metrics
      const totalMetrics = usersWithMetrics.reduce(
        (acc, user) => ({
          pendingClaims: acc.pendingClaims + user.metrics.pendingClaims,
          rejectedClaims: acc.rejectedClaims + user.metrics.rejectedClaims,
          acceptedClaims: acc.acceptedClaims + user.metrics.acceptedClaims,
        }),
        { pendingClaims: 0, rejectedClaims: 0, acceptedClaims: 0 }
      );

      //   console.log("Total metrics:", totalMetrics);

      setMetrics(totalMetrics);
    } catch (error) {
      //   console.error("Error fetching data:", error);
      setError(`Failed to fetch data: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmClaim = async (claim) => {
    if (!claim) {
      console.error("Claim ID is undefined");
      setError("Claim ID is undefined");
      return;
    }
    const claimIdString = claim._id.toString();
    try {
      const response = await axios.put(
        `https://securing.onrender.com/api/confirmclaim/${claimIdString}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
          },
        }
      );
      fetchUsersAndClaims();
    } catch (error) {
      setError(`Failed to confirm claim: ${error.message}`);
    }
  };

  const handleRejectClaim = async (claimId) => {
    if (!claimId) {
      console.error("Claim ID is undefined");
      setError("Claim ID is undefined");
      return;
    }
    const claimIdString = claimId.toString();
    try {
      const response = await axios.put(
        `https://securing.onrender.com/api/rejectclaim/${claimIdString}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
          },
        }
      );
      fetchUsersAndClaims();
    } catch (err) {
      console.error("Reject claim error:", err);
      if (err.response && err.response.data) {
        setError(
          err.response.data.msg || "An error occurred during Rejecting claim"
        );
      } else if (err.request) {
        setError("No response received from the server");
      } else {
        setError("Error setting up the request");
      }
    }
  };

  if (isLoading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      <Typography variant="h4">Admin Dashboard</Typography>

      <Grid container spacing={2} sx={{ my: 2 }}>
        <Grid item xs={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Pending Claims</Typography>
              <Typography variant="h4">{metrics.pendingClaims}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Rejected Claims</Typography>
              <Typography variant="h4">{metrics.rejectedClaims}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Accepted Claims</Typography>
              <Typography variant="h4">{metrics.acceptedClaims}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Typography variant="h5" sx={{ mt: 4 }}>
        Verified Users
      </Typography>
      <Grid container spacing={2}>
        {users.map((user) => (
          <Grid item xs={12} sm={6} md={4} key={user.Username}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6">{user.Username}</Typography>
              <Typography>
                Pending Claims: {user.metrics.pendingClaims}
              </Typography>
              <Typography>
                Rejected Claims: {user.metrics.rejectedClaims}
              </Typography>
              <Typography>
                Accepted Claims: {user.metrics.acceptedClaims}
              </Typography>
              <Button onClick={() => setSelectedUser(user)}>View Claims</Button>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {selectedUser && (
        <Box mt={4}>
          <Typography variant="h5">
            Claims for {selectedUser.Username}
          </Typography>
          <Grid container spacing={2}>
            {selectedUser.claims.map((claim) => (
              <Grid item xs={12} key={claim._id}>
                <Paper elevation={3} sx={{ p: 2 }}>
                  <Typography>Policy ID: {claim.policy_id}</Typography>
                  <Typography>Amount: {claim.amount}</Typography>
                  <Typography>Status: {claim.status}</Typography>
                  {claim.status === "pending" && (
                    <Box mt={1}>
                      <Button
                        startIcon={<CheckIcon />}
                        onClick={() => handleConfirmClaim(claim)}
                        sx={{ mr: 1 }}>
                        Confirm
                      </Button>
                      <Button
                        startIcon={<CloseIcon />}
                        onClick={() => handleRejectClaim(claim._id)}>
                        Reject
                      </Button>
                    </Box>
                  )}
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default ConfirmClaim;

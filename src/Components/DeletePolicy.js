import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import axios from "axios";

const DeletePolicy = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);

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

  const handleDeleteClick = (policy) => {
    setSelectedPolicy(policy);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPolicy(null);
  };

  const handleConfirmDelete = async () => {
    const token = sessionStorage.getItem("access_token");
    console.log("Token:", token);
    try {
      await axios.delete("https://securing.onrender.com/api/delete_policy", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: {
          Username: userDetails.Username,
          policy_id: selectedPolicy.policy_id,
        },
      });
      await fetchUserDetails();
      handleCloseDialog();
    } catch (error) {
      console.error("Error deleting policy:", error);
      setError("Failed to delete policy. Please try again.");
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
        Delete Policy
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
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleDeleteClick(policy)}
                  sx={{ mt: 2 }}>
                  Delete Policy
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">
          {"Confirm Policy Deletion"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this policy? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DeletePolicy;

// ConfirmUser.js
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Button,
  Grid,
  Modal,
} from "@mui/material";
import axios from "axios";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";

const ConfirmUser = ({ onLogout }) => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewedUser, setViewedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const token = sessionStorage.getItem("access_token");
    if (!token) {
      setError("No access token found. Please login again.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get(
        "https://securing.onrender.com/api/user/tempusers",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError(`Failed to fetch users: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (username) => {
    const token = sessionStorage.getItem("access_token");
    if (!token) {
      setError("No access token found. Please login again.");
      onLogout();
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios({
        method: "post",
        url: "https://securing.onrender.com/api/user/confirm",
        data: { username: username },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      console.log("Approval response:", response.data);
      fetchUsers();
    } catch (error) {
      console.error(
        "Error approving user:",
        error.response ? error.response.data : error.message
      );
      setError(
        `Failed to approve user: ${JSON.stringify(
          error.response ? error.response.data : error.message
        )}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async (username) => {
    const token = sessionStorage.getItem("access_token");
    if (!token) {
      setError("No access token found. Please login again.");
      onLogout();
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios({
        method: "post",
        url: "https://securing.onrender.com/api/user/reject",
        data: { username: username },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Rejected response:", response.data);
      fetchUsers();
    } catch (error) {
      console.error(
        "Error rejecting user:",
        error.response ? error.response.data : error.message
      );
      setError(
        `Failed to reject user: ${JSON.stringify(
          error.response ? error.response.data : error.message
        )}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (username) => {
    const token = sessionStorage.getItem("access_token");
    if (!token) {
      setError("No access token found. Please login again.");
      onLogout();
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios({
        method: "delete",
        url: `https://securing.onrender.com/api/policyholder/${username}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("response:", response.data);
      fetchUsers();
    } catch (error) {
      console.error(
        "Error Deleting user:",
        error.response ? error.response.data : error.message
      );
      setError(
        `Failed to Delete user: ${JSON.stringify(
          error.response ? error.response.data : error.message
        )}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleView = async (username) => {
    const token = sessionStorage.getItem("access_token");
    if (!token) {
      setError("No access token found. Please login again.");
      onLogout();
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios({
        method: "get",
        url: `https://securing.onrender.com/api/policyholder/${username}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("response:", response.data);
      setViewedUser(response.data);
    } catch (error) {
      console.error(
        "Error View user:",
        error.response ? error.response.data : error.message
      );
      setError(
        `Failed to View user: ${JSON.stringify(
          error.response ? error.response.data : error.message
        )}`
      );
    } finally {
      setIsLoading(false);
    }
  };
  const handleCloseModal = () => {
    setViewedUser(null);
  };
  const getUserStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "yellow";
      case "accepted":
        return "lightgreen";
      case "rejected":
        return "lightcoral";
      default:
        return "white";
    }
  };

  const getUserStatusHoverColor = (status) => {
    switch (status) {
      case "pending":
        return "orange";
      case "accepted":
        return "green";
      case "rejected":
        return "red";
      default:
        return "lightgray";
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
    return <Typography color="error">{error}</Typography>;
  }

  const sortedUsers = [...users].sort((a, b) => {
    const order = { pending: 0, accepted: 1, rejected: 2 };
    return order[a.isVerified] - order[b.isVerified];
  });

  return (
    <Box>
      <Grid container spacing={2} sx={{ mt: 2 }}>
        {sortedUsers.map((user) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={user.id}>
            <Paper
              sx={{
                p: 2,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                backgroundColor: getUserStatusColor(user.isVerified),
                "&:hover": {
                  backgroundColor: getUserStatusHoverColor(user.isVerified),
                },
              }}>
              <Typography variant="subtitle1">
                Username: {user.Username}
              </Typography>
              <Typography>Email: {user.Email}</Typography>
              <Typography>Mobile: {user.Mobile}</Typography>
              <Typography>
                Name: {user.First_name} {user.Last_name}
              </Typography>
              <Typography>Age: {user.age}</Typography>
              <Typography>Status: {user.isVerified}</Typography>
              <Box sx={{ display: "flex", gap: 1, mt: "auto", pt: 1 }}>
                {user.isVerified === "pending" && (
                  <>
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      onClick={() => handleApprove(user.Username)}
                      startIcon={<CheckIcon />}>
                      Approve
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => handleReject(user.Username)}
                      startIcon={<CloseIcon />}>
                      Reject
                    </Button>
                  </>
                )}
                {user.isVerified === "accepted" && (
                  <>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => handleView(user.Username)}
                      startIcon={<VisibilityIcon />}>
                      View
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => handleReject(user.Username)}
                      startIcon={<CloseIcon />}>
                      Reject
                    </Button>
                  </>
                )}
                {user.isVerified === "rejected" && (
                  <>
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      onClick={() => handleApprove(user.Username)}
                      startIcon={<CheckIcon />}>
                      Accept
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => handleDelete(user.Username)}
                      startIcon={<DeleteIcon />}>
                      Delete
                    </Button>
                  </>
                )}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Modal open={!!viewedUser} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            maxWidth: "90vw",
            maxHeight: "90vh",
            overflowY: "auto",
          }}>
          {viewedUser && (
            <>
              <Typography variant="h6" gutterBottom>
                User Details
              </Typography>
              <Typography variant="subtitle1">
                Username: {viewedUser.username}
              </Typography>
              <Typography>Email: {viewedUser.email}</Typography>
              <Typography>Mobile: {viewedUser.mobile}</Typography>
              <Typography>
                Name: {viewedUser.firstName} {viewedUser.lastName}
              </Typography>
              <Typography>Age: {viewedUser.age}</Typography>
              <Typography>Status: {viewedUser.isVerified}</Typography>

              <Typography variant="h6" gutterBottom>
                Policies
              </Typography>
              {viewedUser.policies && viewedUser.policies.length > 0 ? (
                viewedUser.policies.map((policy, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Typography>Policy Number: {policy.policy_id}</Typography>
                    <Typography>category: {policy.category}</Typography>
                    <Typography>Name: {policy.policy_name}</Typography>
                    <Typography>Sum Assured: {policy.sum_assured}</Typography>
                    <Typography>Duration: {policy.duration}</Typography>
                    <Typography>Premium: {policy.premium}</Typography>
                  </Box>
                ))
              ) : (
                <Typography>No policies found for this user.</Typography>
              )}

              <Button onClick={handleCloseModal} sx={{ mt: 2 }}>
                Close
              </Button>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default ConfirmUser;

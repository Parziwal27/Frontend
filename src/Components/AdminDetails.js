// AdminDetails.js
import React from "react";
import { Paper, Typography } from "@mui/material";

const AdminDetails = ({ user }) => {
  return (
    <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6">Admin Details</Typography>
      <Typography>
        Name: {user.first_name} {user.last_name}
      </Typography>
      <Typography>Email: {user.email}</Typography>
      <Typography>Mobile: {user.mobile}</Typography>
    </Paper>
  );
};

export default AdminDetails;

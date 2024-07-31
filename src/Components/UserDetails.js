import React from "react";
import { Paper, Typography } from "@mui/material";

const UserDetails = ({ user }) => (
  <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
    <Typography variant="h6">User Details</Typography>
    <Typography>
      Name: {user.first_name} {user.last_name}
    </Typography>
    <Typography>Email: {user.email}</Typography>
    <Typography>Mobile: {user.mobile}</Typography>
    <Typography>User Status: {user.User_status}</Typography>
  </Paper>
);

export default UserDetails;

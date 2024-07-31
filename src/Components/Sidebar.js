import React, { useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Drawer,
  IconButton,
  Typography,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AssignmentIcon from "@mui/icons-material/Assignment";
import LogoutIcon from "@mui/icons-material/Logout";

const Sidebar = ({ onItemClick, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setIsOpen(open);
  };

  const sidebarItems = [
    { text: "User Details", icon: <PersonIcon />, action: "userDetails" },
    { text: "Add Policy", icon: <AddCircleIcon />, action: "addPolicy" },
    { text: "Update Policy", icon: <EditIcon />, action: "updatePolicy" },
    { text: "Delete Policy", icon: <DeleteIcon />, action: "deletePolicy" },
    { text: "View Policy", icon: <VisibilityIcon />, action: "viewPolicy" },
    { text: "Apply for Claim", icon: <AssignmentIcon />, action: "applyClaim" },
  ];

  const handleLogoutClick = () => {
    setIsOpen(false); // Close the drawer
    onLogout(); // Call the onLogout function passed from UserDashboard
  };

  const sidebarContent = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}>
      <List>
        {sidebarItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => onItemClick(item.action)}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem button onClick={handleLogoutClick}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <IconButton
        edge="start"
        color="inherit"
        aria-label="menu"
        onClick={toggleDrawer(true)}
        sx={{ mr: 2 }}>
        <MenuIcon />
      </IconButton>
      <Drawer anchor="left" open={isOpen} onClose={toggleDrawer(false)}>
        {sidebarContent}
      </Drawer>
    </>
  );
};

export default Sidebar;

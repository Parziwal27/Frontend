import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import {
  Box,
  CssBaseline,
  Container,
  Typography,
  CircularProgress,
} from "@mui/material";
import Login from "./Components/Login";
import Register from "./Components/Register";
import AdminDashboard from "./Components/AdminDashboard";
import UserDashboard from "./Components/UserDashboard";
import ConfirmUser from "./Components/ConfirmUser";
import ConfirmClaim from "./Components/ConfirmClaim";
import ViewAllPolicyholders from "./Components/ViewAllPolicyholders";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const checkAuthStatus = () => {
    const token = sessionStorage.getItem("access_token");
    const username = sessionStorage.getItem("username");
    const userIsAdmin = sessionStorage.getItem("isAdmin") === "true";
    if (token && username) {
      setIsAuthenticated(true);
      setIsAdmin(userIsAdmin);
    } else {
      setIsAuthenticated(false);
      setIsAdmin(false);
    }
    setIsLoading(false);
  };

  const handleBeforeUnload = () => {
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("isAdmin");
  };

  const handleLoginSuccess = (username, token, userIsAdmin) => {
    sessionStorage.setItem("access_token", token);
    sessionStorage.setItem("username", username);
    sessionStorage.setItem("isAdmin", userIsAdmin.toString());
    setIsAuthenticated(true);
    setIsAdmin(userIsAdmin);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("isAdmin");
    setIsAuthenticated(false);
    setIsAdmin(false);
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

  return (
    <Router>
      <CssBaseline />
      <Container>
        <Box sx={{ mt: 4 }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            Claims Management System
          </Typography>
          <Routes>
            {!isAuthenticated ? (
              <>
                <Route
                  path="/login"
                  element={<Login onLoginSuccess={handleLoginSuccess} />}
                />
                <Route path="/register" element={<Register />} />
                <Route path="*" element={<Navigate to="/login" />} />
              </>
            ) : (
              <>
                <Route
                  path="/"
                  element={
                    <Navigate to={isAdmin ? "/admin" : "/user"} replace />
                  }
                />
                <Route
                  path="/admin/*"
                  element={
                    isAdmin ? (
                      <AdminDashboard onLogout={handleLogout} />
                    ) : (
                      <Navigate to="/user" replace />
                    )
                  }>
                  <Route path="confirm-user" element={<ConfirmUser />} />
                  <Route path="confirm-claim" element={<ConfirmClaim />} />
                  <Route
                    path="view-all-policyholders"
                    element={<ViewAllPolicyholders />}
                  />
                </Route>
                <Route
                  path="/user"
                  element={
                    !isAdmin ? (
                      <UserDashboard onLogout={handleLogout} />
                    ) : (
                      <Navigate to="/admin" replace />
                    )
                  }
                />
                <Route
                  path="*"
                  element={
                    <Navigate to={isAdmin ? "/admin" : "/user"} replace />
                  }
                />
              </>
            )}
          </Routes>
        </Box>
      </Container>
    </Router>
  );
}

export default App;

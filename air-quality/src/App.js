import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box, Container } from "@mui/material";
import Dashboard from "./components/Dashboard";
import AdminPage from "./components/Admin/AdminPage";
import "./App.css";

function App() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Header/Navigation */}
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            🌍 Air Quality Prediction System
          </Typography>
          <Button color="inherit" component={Link} to="/">
            Dashboard
          </Button>
          <Button color="inherit" component={Link} to="/admin" sx={{ ml: 2 }}>
            Admin Panel
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, py: 4, backgroundColor: "#f5f5f5" }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          backgroundColor: "#333",
          color: "#fff",
          py: 3,
          textAlign: "center",
          mt: 4,
        }}
      >
        <Container>
          <Typography variant="body2">
            © 2026 Air Quality Prediction System. All rights reserved.
          </Typography>
          <Typography variant="caption">
            {/* Data sourced from environmental monitoring stations across India. */}
            Akula Sai Sankar
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default App;

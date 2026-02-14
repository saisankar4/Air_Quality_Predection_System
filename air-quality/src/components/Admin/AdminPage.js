import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Alert,
} from "@mui/material";
import CSVUploader from "./CSVUploader";

const AdminPage = () => {
  const [stats, setStats] = useState({
    totalRecords: 0,
    lastUpdate: null,
    uploadedRecords: 0,
  });

  useEffect(() => {
    // Calculate statistics
    const calculateStats = async () => {
      try {
        const response = await fetch("/aqi-data.csv");
        const csvText = await response.text();
        const workbook = XLSX.read(csvText, { type: "string" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(sheet);

        const uploadedData = localStorage.getItem("aqi_additional_data");
        const uploadedCount = uploadedData ? JSON.parse(uploadedData).length : 0;

        setStats({
          totalRecords: data.length + uploadedCount,
          lastUpdate: new Date().toLocaleString(),
          uploadedRecords: uploadedCount,
        });
      } catch (error) {
        console.error("Error loading stats:", error);
      }
    };

    calculateStats();
  }, []);

  const handleUploadSuccess = (newData) => {
    // Update stats
    setStats((prev) => ({
      ...prev,
      totalRecords: prev.totalRecords + newData.length,
      uploadedRecords: prev.uploadedRecords + newData.length,
      lastUpdate: new Date().toLocaleString(),
    }));
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            🔧 Admin Panel
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Manage air quality data and system settings
          </Typography>
        </Box>

        {/* Statistics */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: "center" }}>
                <Typography color="textSecondary" gutterBottom>
                  Total Records
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: "#1976d2" }}>
                  {stats.totalRecords.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: "center" }}>
                <Typography color="textSecondary" gutterBottom>
                  Uploaded Records
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: "#4CAF50" }}>
                  {stats.uploadedRecords.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: "center" }}>
                <Typography color="textSecondary" gutterBottom>
                  Last Updated
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {stats.lastUpdate || "N/A"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: "center" }}>
                <Typography color="textSecondary" gutterBottom>
                  Status
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: "#4CAF50" }}>
                  ✅ Active
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* CSV Upload Section */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12}>
            <CSVUploader onUploadSuccess={handleUploadSuccess} />
          </Grid>
        </Grid>

        {/* Information Cards */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Alert severity="info" sx={{ mb: 2 }}>
              <strong>📝 Important Notes:</strong>
              <ul style={{ marginTop: "10px", marginBottom: 0 }}>
                <li>CSV upload stores data locally in your browser using LocalStorage</li>
                <li>Maximum storage is typically 5-10MB depending on browser</li>
                <li>Data persists across browser sessions but will be lost if browser cache is cleared</li>
                <li>For production, consider implementing a backend API for permanent storage</li>
              </ul>
            </Alert>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  📋 CSV Format
                </Typography>
                <Typography variant="body2" component="div">
                  <strong>Required columns:</strong>
                  <ul>
                    <li>country - Country name (e.g., "India")</li>
                    <li>state - State/Province name</li>
                    <li>city - City name</li>
                    <li>station - Monitoring station name</li>
                    <li>last_update - Timestamp (DD-MM-YYYY HH:MM:SS)</li>
                    <li>latitude - Geographic latitude</li>
                    <li>longitude - Geographic longitude</li>
                    <li>pollutant_id - Pollutant type (e.g., "PM2.5")</li>
                    <li>pollutant_min - Minimum pollutant value</li>
                    <li>pollutant_max - Maximum pollutant value</li>
                    <li>pollutant_avg - Average pollutant value (used for AQI)</li>
                  </ul>
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  💡 Tips
                </Typography>
                <Typography variant="body2" component="div">
                  <ul>
                    <li>Upload data in hourly intervals for best prediction accuracy</li>
                    <li>Ensure timestamps are in correct format (DD-MM-YYYY HH:MM:SS)</li>
                    <li>Latitude/Longitude should be valid geographic coordinates</li>
                    <li>AQI calculations use pollutant_avg values</li>
                    <li>Multiple pollutants per location and time are supported</li>
                    <li>To reset all data, click "Clear Data" button in upload section</li>
                  </ul>
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default AdminPage;

import React, { useRef, useState } from "react";
import * as XLSX from "xlsx";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Alert,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const CSVUploader = ({ onUploadSuccess }) => {
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [uploadedRows, setUploadedRows] = useState(null);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.name.endsWith(".csv")) {
      setMessage({ type: "error", text: "Please upload a CSV file" });
      return;
    }

    // Store the file and open password dialog
    setSelectedFile(file);
    setPasswordDialogOpen(true);
    setPassword("");
  };

  const handlePasswordSubmit = async () => {
    if (password !== "123456") {
      setMessage({ type: "error", text: "❌ Invalid passcode! Access denied." });
      setPassword("");
      setPasswordDialogOpen(false);
      return;
    }

    setPasswordDialogOpen(false);
    await processCSVFile(selectedFile);
    setPassword("");
  };

  const handlePasswordCancel = () => {
    setPasswordDialogOpen(false);
    setPassword("");
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const processCSVFile = async (file) => {
    if (!file) return;

    setLoading(true);
    setMessage(null);

    try {
      const text = await file.text();
      const workbook = XLSX.read(text, { type: "string" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const newData = XLSX.utils.sheet_to_json(sheet);

      if (newData.length === 0) {
        setMessage({ type: "error", text: "CSV file is empty" });
        setLoading(false);
        return;
      }

      // Validate CSV structure
      const requiredColumns = [
        "country",
        "state",
        "city",
        "station",
        "last_update",
        "latitude",
        "longitude",
        "pollutant_id",
        "pollutant_min",
        "pollutant_max",
        "pollutant_avg",
      ];

      const missingColumns = requiredColumns.filter(
        (col) => !(col in newData[0])
      );
      if (missingColumns.length > 0) {
        setMessage({
          type: "error",
          text: `Missing columns: ${missingColumns.join(", ")}`,
        });
        setLoading(false);
        return;
      }

      // Store in localStorage for now (client-side approach)
      const existingData = localStorage.getItem("aqi_additional_data");
      const combined = existingData ? JSON.parse(existingData) : [];
      const updatedData = [...combined, ...newData];
      localStorage.setItem("aqi_additional_data", JSON.stringify(updatedData));

      setUploadedRows(newData.length);
      setMessage({
        type: "success",
        text: `✅ Successfully uploaded ${newData.length} records! Data has been stored and will merge with main data.`,
      });

      if (onUploadSuccess) {
        onUploadSuccess(newData);
      }

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Upload error:", error);
      setMessage({
        type: "error",
        text: `Error uploading file: ${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClearData = () => {
    if (window.confirm("Are you sure? This will clear all uploaded data.")) {
      localStorage.removeItem("aqi_additional_data");
      setUploadedRows(null);
      setMessage({ type: "info", text: "Additional data cleared" });
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          📤 Upload CSV Data
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="textSecondary" paragraph>
            Upload a CSV file to add new air quality records. The file must contain all required columns:
            country, state, city, station, last_update, latitude, longitude, pollutant_id, pollutant_min, pollutant_max, pollutant_avg
          </Typography>

          <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
            <input
              type="file"
              accept=".csv"
              ref={fileInputRef}
              onChange={handleFileSelect}
              style={{ display: "none" }}
            />
            <Button
              variant="contained"
              startIcon={<CloudUploadIcon />}
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
            >
              Choose CSV File
            </Button>

            {uploadedRows !== null && (
              <Button variant="outlined" color="error" onClick={handleClearData}>
                Clear Data ({uploadedRows} records)
              </Button>
            )}
          </Box>

          {loading && <LinearProgress />}
        </Box>

        {message && (
          <Alert severity={message.type} sx={{ mb: 2 }}>
            {message.text}
          </Alert>
        )}

        {uploadedRows !== null && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              ✅ Uploaded Data Summary
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Total records stored: {uploadedRows}
            </Typography>
            <Typography variant="caption" display="block" sx={{ mt: 1, fontStyle: "italic" }}>
              Note: Data is stored locally in your browser. Refresh the app to see updated air quality records.
            </Typography>
          </Box>
        )}
      </CardContent>

      {/* Password Dialog */}
      <Dialog open={passwordDialogOpen} onClose={handlePasswordCancel} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>🔐 Passcode Required</DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Please enter the passcode to upload CSV files:
          </Typography>
          <TextField
            autoFocus
            fullWidth
            type="password"
            variant="outlined"
            placeholder="Enter passcode"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handlePasswordSubmit();
              }
            }}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePasswordCancel}>Cancel</Button>
          <Button onClick={handlePasswordSubmit} variant="contained" color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default CSVUploader;

import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { Box, Container, Grid, Paper, CircularProgress, Alert } from "@mui/material";
import AQIBox from "./AQIBox";
import AQIChart from "./AQIChart";
import AQIScaleGauge from "./AQI/AQIScaleGauge";
import DiseaseInfo from "./DiseaseInfo";
import { predictAQI } from "../utils/mlPredictor";
import "../styles/Dashboard.css";

function Dashboard() {
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentAQI, setCurrentAQI] = useState(0);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  // Haversine formula to calculate distance
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Find nearest location from user's coordinates
  const findNearestLocation = (lat, lon, data) => {
    let nearest = data[0];
    let minDist = getDistance(lat, lon, nearest.latitude, nearest.longitude);

    data.forEach((item) => {
      const dist = getDistance(lat, lon, item.latitude, item.longitude);
      if (dist < minDist) {
        minDist = dist;
        nearest = item;
      }
    });
    return nearest;
  };

  // Load CSV
  useEffect(() => {
    setLoading(true);
    fetch("/aqi-data.csv")
      .then((res) => res.text())
      .then((csvText) => {
        const workbook = XLSX.read(csvText, { type: "string" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(sheet);

        setAllData(data);

        // Unique countries
        const uniqueCountries = [...new Set(data.map((d) => d.country))];
        setCountries(uniqueCountries);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading CSV:", err);
        setLoading(false);
      });
  }, []);

  // Auto-select based on user location
  useEffect(() => {
    if (allData.length === 0) return;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const nearest = findNearestLocation(latitude, longitude, allData);

          setSelectedCountry(nearest.country);
          setSelectedState(nearest.state);
          setSelectedCity(nearest.city);
        },
        (error) => console.error("Error getting location:", error)
      );
    }
  }, [allData.length]);

  // Update filtered data whenever selection changes
  useEffect(() => {
    if (!selectedCountry) return;

    let data = allData.filter((d) => d.country === selectedCountry);

    const uniqueStates = [...new Set(data.map((d) => d.state))];
    setStates(uniqueStates);

    if (selectedState) {
      data = data.filter((d) => d.state === selectedState);
      const uniqueCities = [...new Set(data.map((d) => d.city))];
      setCities(uniqueCities);
    }

    if (selectedCity) {
      data = data.filter((d) => d.city === selectedCity);
    }

    // Sort by last_update
    const sortedData = [...data].sort(
      (a, b) => new Date(a.last_update) - new Date(b.last_update)
    );

    setFilteredData(sortedData);

    if (sortedData.length > 0) {
      const latestAQI = Number(sortedData[sortedData.length - 1].pollutant_avg);
      setCurrentAQI(latestAQI);

      // Generate predictions based on filtered data
      const historicalAQI = sortedData.map((d) => ({
        hour: new Date(d.last_update).getHours(),
        aqi: Number(d.pollutant_avg),
      }));
      setPredictions(predictAQI(historicalAQI));
    } else {
      setCurrentAQI(0);
      setPredictions(predictAQI([]));
    }
  }, [selectedCountry, selectedState, selectedCity, allData]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  // Get hourly data for current display
  const hourlyData = (() => {
    const data = {};
    for (let i = 0; i < 24; i++) {
      data[i] = { total: 0, count: 0, hour: i };
    }
    filteredData.forEach((d) => {
      const hour = new Date(d.last_update).getHours();
      data[hour].total += Number(d.pollutant_avg);
      data[hour].count += 1;
    });
    return Object.values(data)
      .map((item) => ({
        hour: String(item.hour).padStart(2, "0") + ":00",
        aqi: item.count > 0 ? Math.round(item.total / item.count) : 0,
      }))
      .sort((a, b) => parseInt(a.hour) - parseInt(b.hour));
  })();

  return (
    <Box className="dashboard-container">
      <Container maxWidth="xl">
        {/* Filters */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <select
                value={selectedCountry}
                onChange={(e) => {
                  setSelectedCountry(e.target.value);
                  setSelectedState("");
                  setSelectedCity("");
                }}
                className="filter-select"
              >
                <option value="">Select Country</option>
                {countries.map((c, i) => (
                  <option key={i} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <select
                value={selectedState}
                onChange={(e) => {
                  setSelectedState(e.target.value);
                  setSelectedCity("");
                }}
                className="filter-select"
              >
                <option value="">Select State</option>
                {states.map((s, i) => (
                  <option key={i} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="filter-select"
              >
                <option value="">Select City</option>
                {cities.map((c, i) => (
                  <option key={i} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Grid>
          </Grid>
        </Paper>

        {/* Main Content */}
        <Box sx={{ display: "flex", gap: 3 }}>
          {/* Left Column - Main Content */}
          <Box sx={{ flex: "2", minWidth: 0 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <AQIBox aqi={currentAQI} />
              <AQIScaleGauge aqi={currentAQI} />
              <AQIChart data={hourlyData} title="Hourly AQI Data" />
            </Box>

            {/* Forecasts Section */}
            <Box sx={{ mt: 4 }}>
              <Paper sx={{ p: 3 }}>
                <h2>24-Hour Forecast</h2>
                <AQIChart data={predictions.map((p) => ({ hour: p.hour, aqi: p.predictedAQI }))} title="24-Hour AQI Forecast" />
              </Paper>
            </Box>

            {/* Forecast Precautions */}
            {predictions.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Alert severity="info">
                  <strong>24-Hour Forecast Alert:</strong> Peak AQI of {Math.max(...predictions.map((p) => p.predictedAQI))} expected.
                  Average AQI: {Math.round(predictions.reduce((sum, p) => sum + p.predictedAQI, 0) / predictions.length)}
                </Alert>
              </Box>
            )}
          </Box>

          {/* Right Column - Sticky Sidebar */}
          <Box
            sx={{
              flex: "1",
              minWidth: "300px",
              position: "sticky",
              top: 100,
              height: "fit-content",
              maxHeight: "calc(100vh - 120px)",
              overflowY: "auto",
              paddingRight: 1,
              "&::-webkit-scrollbar": {
                width: "6px",
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "#f1f1f1",
                borderRadius: "4px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#888",
                borderRadius: "4px",
                "&:hover": {
                  backgroundColor: "#555",
                },
              },
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <DiseaseInfo aqi={currentAQI} />
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default Dashboard;

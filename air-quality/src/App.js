import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import AQIBox from "./components/AQIBox";
import AQIChart from "./components/AQIChart";
import DiseaseInfo from "./components/DiseaseInfo";
import "./App.css";

function App() {
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentAQI, setCurrentAQI] = useState(0);

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
      })
      .catch((err) => console.error("Error loading CSV:", err));
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
  }, [allData]);

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
      setCurrentAQI(Number(sortedData[sortedData.length - 1].pollutant_avg));
    } else {
      setCurrentAQI(0);
    }
  }, [selectedCountry, selectedState, selectedCity, allData]);

  return (
    <div className="container">
      <div className="filters">
        <select
          value={selectedCountry}
          onChange={(e) => {
            setSelectedCountry(e.target.value);
            setSelectedState("");
            setSelectedCity("");
          }}
        >
          <option value="">Select Country</option>
          {countries.map((c, i) => (
            <option key={i} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={selectedState}
          onChange={(e) => {
            setSelectedState(e.target.value);
            setSelectedCity("");
          }}
        >
          <option value="">Select State</option>
          {states.map((s, i) => (
            <option key={i} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
        >
          <option value="">Select City</option>
          {cities.map((c, i) => (
            <option key={i} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="main">
        <div className="left">
          <AQIBox aqi={currentAQI} />
          <AQIChart
            data={filteredData.map((d) => ({
              time: new Date(d.last_update).getHours() + ":00",
              aqi: Number(d.pollutant_avg),
            }))}
          />
        </div>
        <div className="right">
          <DiseaseInfo aqi={currentAQI} />
        </div>
      </div>
    </div>
  );
}

export default App;

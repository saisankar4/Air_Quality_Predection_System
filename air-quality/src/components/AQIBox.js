import React from "react";
import "./AQIBox.css";

const getColor = (aqi) => {
  if (aqi <= 50) return "green";
  if (aqi <= 100) return "#cccc00";
  if (aqi <= 200) return "orange";
  if (aqi <= 300) return "red";
  return "maroon";
};

const getStatus = (aqi) => {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Satisfactory";
  if (aqi <= 200) return "Moderate";
  if (aqi <= 300) return "Poor";
  return "Severe";
};

const AQIBox = ({ aqi }) => {
  return (
    <div className="aqi-box">
      <h1 style={{ color: getColor(aqi) }} className="blink">
        AQI: {aqi}
      </h1>
      <h2 className="status blink">
        {getStatus(aqi)}
      </h2>
    </div>
  );
};

export default AQIBox;

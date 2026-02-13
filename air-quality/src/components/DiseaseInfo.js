import React from "react";

const getHealthImpact = (aqi) => {
  if (aqi <= 50) {
    return {
      status: "Good",
      risk: "No major health risk.",
      color: "green",
      precautions: ["Enjoy outdoor activities."]
    };
  } else if (aqi <= 100) {
    return {
      status: "Satisfactory",
      risk: "Minor breathing discomfort for sensitive people.",
      color: "#cccc00",
      precautions: ["Sensitive people should reduce prolonged outdoor exertion."]
    };
  } else if (aqi <= 200) {
    return {
      status: "Moderate",
      risk: "Asthma patients and elderly may face breathing issues.",
      color: "orange",
      precautions: [
        "Wear N95 mask",
        "Avoid heavy outdoor activities",
        "Keep windows closed"
      ]
    };
  } else if (aqi <= 300) {
    return {
      status: "Poor",
      risk: "Breathing discomfort on prolonged exposure.",
      color: "red",
      precautions: [
        "Avoid outdoor activities",
        "Use air purifier",
        "Stay hydrated"
      ]
    };
  } else {
    return {
      status: "Severe",
      risk: "Serious lung & heart problems possible.",
      color: "maroon",
      precautions: [
        "Stay indoors",
        "Use air purifier",
        "Wear N95 mask if going outside",
        "Consult doctor if breathing issues occur"
      ]
    };
  }
};

const DiseaseInfo = ({ aqi }) => {
  const health = getHealthImpact(aqi);

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ color: health.color }}>
        Health Effects ({health.status})
      </h2>

      <p>{health.risk}</p>

      <h3>👶 Children</h3>
      <p>More sensitive to air pollution. Risk of asthma & lung irritation.</p>
      <img src="/child.png" width="150" alt="child" />

      <h3>👴 Elderly</h3>
      <p>Higher risk of heart and respiratory diseases.</p>

      <h3>⚠ Precautions</h3>
      <ul>
        {health.precautions.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default DiseaseInfo;

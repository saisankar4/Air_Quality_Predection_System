import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Alert,
  Chip,
  Stack,
} from "@mui/material";
import { getAQILevel, AQI_LEVELS, getAQIColor } from "../../theme";

const precautionsByLevel = {
  good: {
    severity: "success",
    title: "✅ Good Air Quality",
    description: "Air quality is satisfactory for outdoor activities.",
    tips: [
      "Outdoor activities are safe and recommended",
      "No respiratory precautions needed",
      "Normal daily routines can be followed",
      "Exercise and sports are encouraged outdoors",
    ],
  },
  satisfactory: {
    severity: "info",
    title: "ℹ️ Satisfactory Air Quality",
    description: "Air quality is acceptable for most people.",
    tips: [
      "Sensitive people should reduce prolonged exertion",
      "Children and elderly should limit intense outdoor activities",
      "Wear N95 mask if you have respiratory conditions",
      "Stay hydrated throughout the day",
    ],
  },
  moderate: {
    severity: "warning",
    title: "⚠️ Moderate Air Quality",
    description: "Air quality is unhealthy for sensitive groups.",
    tips: [
      "Wear N95 mask for outdoor activities",
      "Avoid heavy outdoor exertion",
      "Keep windows closed indoors",
      "Use air purifier if available",
      "Limit children's outdoor play time",
      "Drink plenty of water",
    ],
  },
  poor: {
    severity: "error",
    title: "🚨 Poor Air Quality",
    description: "Air quality is unhealthy for the general population.",
    tips: [
      "Wear N95/N100 mask if you must go outside",
      "Limit outdoor activities as much as possible",
      "Use air purifier with HEPA filter indoors",
      "Keep windows and doors closed",
      "Stay indoors if possible, especially children and elderly",
      "Use prescribed inhalers if needed",
      "Drink plenty of water and stay hydrated",
    ],
  },
  veryPoor: {
    severity: "error",
    title: "🔴 Very Poor Air Quality",
    description: "Air quality is very unhealthy. General public affected.",
    tips: [
      "Minimize outdoor exposure as much as possible",
      "Wear best-quality N100 mask if outside",
      "Use medical-grade air purifier indoors",
      "Close all windows and doors",
      "Keep vulnerable groups (children, elderly, patients) indoors",
      "Monitor health closely and consult doctor",
      "Have emergency contact numbers ready",
    ],
  },
  severe: {
    severity: "error",
    title: "🛑 SEVERE Air Quality Alert",
    description: "CRITICAL: Air quality is hazardous. Avoid all outdoor exposure.",
    tips: [
      "⚠️ STAY INDOORS - Avoid all outdoor activities",
      "Use best available air filtration system",
      "Wear medical-grade N100 mask if absolutely necessary to go out",
      "Close all windows, doors, and seal cracks",
      "Monitor vulnerable groups continuously",
      "Have emergency medical support on standby",
      "Consult doctor immediately if experiencing symptoms",
      "Call emergency services (108/911) in case of respiratory distress",
    ],
  },
};

const PrecautionsCard = ({ aqi = 0 }) => {
  const level = getAQILevel(aqi);
  const precautions = precautionsByLevel[level];
  const levelData = AQI_LEVELS[level];

  return (
    <Card>
      <CardContent>
        <Alert severity={precautions.severity} sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {precautions.title}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            {precautions.description}
          </Typography>
        </Alert>

        <Box sx={{ mb: 2 }}>
          <Chip
            label={`Level: ${levelData.label}`}
            sx={{
              backgroundColor: getAQIColor(aqi),
              color: "#fff",
              fontWeight: 600,
            }}
          />
        </Box>

        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
          📋 Recommended Precautions:
        </Typography>

        <Stack spacing={1}>
          {precautions.tips.map((tip, idx) => (
            <Box
              key={idx}
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 1.5,
                p: 1,
                backgroundColor: "#f5f5f5",
                borderRadius: 1,
              }}
            >
              <Typography sx={{ fontWeight: 700, color: getAQIColor(aqi) }}>
                •
              </Typography>
              <Typography variant="body2">{tip}</Typography>
            </Box>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default PrecautionsCard;

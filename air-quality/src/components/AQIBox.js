import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { getAQIColor, getAQILevel, AQI_LEVELS } from "../theme";
import "./AQIBox.css";

const AQIBox = ({ aqi }) => {
  const level = getAQILevel(aqi);
  const levelData = AQI_LEVELS[level];

  return (
    <Card sx={{ position: "relative", overflow: "visible" }}>
      <CardContent
        sx={{
          textAlign: "center",
          py: 4,
          backgroundImage: `linear-gradient(135deg, ${getAQIColor(aqi)}15 0%, transparent 100%)`,
        }}
      >
        {/* Current AQI Value */}
        <Box className="blink" sx={{ mb: 2 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: getAQIColor(aqi),
              fontSize: "3rem",
            }}
          >
            {Math.round(aqi)}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Air Quality Index
          </Typography>
        </Box>

        {/* Status */}
        <Box className="blink" sx={{ py: 2 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: getAQIColor(aqi),
              mb: 1,
            }}
          >
            {levelData.label}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Range: {levelData.min} - {levelData.max}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AQIBox;

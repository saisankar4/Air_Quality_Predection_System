import React from "react";
import { Box, Card, CardContent, Typography, LinearProgress } from "@mui/material";
import { AQI_LEVELS, getAQILevel, getAQIColor } from "../../theme";

const AQIScaleGauge = ({ aqi = 0 }) => {
  const level = getAQILevel(aqi);
  const levels = Object.entries(AQI_LEVELS);

  return (
    <Card sx={{ p: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          Air Quality Scale
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {levels.map(([key, data]) => (
            <Box key={key}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 0.5,
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {data.label}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {data.min} - {data.max}
                </Typography>
              </Box>

              <LinearProgress
                variant="determinate"
                value={100}
                sx={{
                  height: 12,
                  borderRadius: 1,
                  backgroundColor: "#e0e0e0",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: data.color,
                    borderRadius: 1,
                  },
                  ...(level === key && {
                    boxShadow: `0 0 8px ${data.color}`,
                    border: `2px solid ${data.color}`,
                  }),
                }}
              />
            </Box>
          ))}
        </Box>

        {/* Current AQI Indicator */}
        <Box
          sx={{
            mt: 3,
            p: 2,
            backgroundColor: `${getAQIColor(aqi)}20`,
            borderRadius: 2,
            border: `2px solid ${getAQIColor(aqi)}`,
            textAlign: "center",
          }}
        >
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Current AQI Level
          </Typography>
          <Typography
            variant="h4"
            sx={{ color: getAQIColor(aqi), fontWeight: 700 }}
          >
            {AQI_LEVELS[level].label}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AQIScaleGauge;

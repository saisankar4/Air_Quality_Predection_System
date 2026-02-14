import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { getAQILevel } from "../../theme";

const diseasesByLevel = {
  good: [],
  satisfactory: [
    { disease: "No significant risk", icon: "✅" },
  ],
  moderate: [
    { disease: "Mild cardiovascular stress", icon: "❤️" },
    { disease: "Respiratory discomfort", icon: "🫁" },
  ],
  poor: [
    { disease: "Heart palpitations", icon: "❤️" },
    { disease: "Hypertension episodes", icon: "🩺" },
    { disease: "Respiratory tract irritation", icon: "🫁" },
    { disease: "Fatigue and weakness", icon: "😴" },
  ],
  veryPoor: [
    { disease: "Acute heart attacks risk", icon: "🚨" },
    { disease: "Stroke risk increases", icon: "🧠" },
    { disease: "Severe breathing difficulties", icon: "😮‍💨" },
    { disease: "COPD exacerbation", icon: "⚠️" },
  ],
  severe: [
    { disease: "Critical cardiac events", icon: "🚨" },
    { disease: "Severe respiratory failure", icon: "🏥" },
    { disease: "Multiple organ stress", icon: "⚠️" },
    { disease: "Emergency medical intervention required", icon: "🚑" },
  ],
};

const precautionsByLevel = {
  good: "Elderly can maintain normal outdoor activities safely.",
  satisfactory: "Normal activities are safe. Regular health check-ups recommended.",
  moderate: "Limit outdoor activities. Take prescribed medications. Rest frequently.",
  poor: "Stay mostly indoors. Use prescribed inhalers. Monitor heart rate. Consult doctor.",
  veryPoor: "Stay strictly indoors. Use medical oxygen if prescribed. Keep emergency numbers ready.",
  severe: "Critical alert! Remain indoors. Use emergency medical services. Hospital standby recommended.",
};

const ElderlyDiseaseCard = ({ aqi = 0 }) => {
  const level = getAQILevel(aqi);
  const diseases = diseasesByLevel[level] || [];
  const precaution = precautionsByLevel[level];

  return (
    <Card sx={{ mb: 2 }}>
      <CardMedia
        component="img"
        height="200"
        image="https://www.ashleycourtcare.co.uk/wp-content/uploads/2018/10/Senior-and-Elderly-Care-Living-Options.jpg"
        alt="Elderly people"
        sx={{ objectFit: "cover" }}
      />
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          👴 Health Impact for Elderly
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            Possible Health Effects:
          </Typography>
          {diseases.length === 0 ? (
            <Typography variant="body2" color="success.main">
              ✅ No health risks at this AQI level
            </Typography>
          ) : (
            <List dense>
              {diseases.map((item, idx) => (
                <ListItem key={idx} disableGutters>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <span>{item.icon}</span>
                  </ListItemIcon>
                  <ListItemText
                    primary={item.disease}
                    primaryTypographyProps={{ variant: "body2" }}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Box>

        <Box
          sx={{
            p: 1.5,
            backgroundColor: "#FCE4EC",
            borderRadius: 1,
            borderLeft: "4px solid #E91E63",
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
            💡 Precautions:
          </Typography>
          <Typography variant="body2">{precaution}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ElderlyDiseaseCard;

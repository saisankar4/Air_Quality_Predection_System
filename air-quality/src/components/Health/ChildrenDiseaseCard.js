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
    { disease: "Respiratory sensitivity increases", icon: "⚠️" },
    { disease: "Asthma symptoms may worsen", icon: "🫁" },
  ],
  poor: [
    { disease: "Asthma attacks", icon: "⚠️" },
    { disease: "Chest tightness", icon: "🫁" },
    { disease: "Coughing and wheezing", icon: "🔊" },
    { disease: "Shortness of breath", icon: "😮‍💨" },
  ],
  veryPoor: [
    { disease: "Severe asthma episodes", icon: "🚨" },
    { disease: "Respiratory tract inflammation", icon: "🫁" },
    { disease: "Chronic cough", icon: "☔" },
    { disease: "Long-term lung damage", icon: "⚠️" },
  ],
  severe: [
    { disease: "Critical respiratory failure risk", icon: "🚨" },
    { disease: "Severe pneumonia", icon: "🏥" },
    { disease: "Permanent lung damage", icon: "☠️" },
    { disease: "Emergency hospitalization needed", icon: "🚑" },
  ],
};

const precautionsByLevel = {
  good: "Outdoor activities are recommended and safe!",
  satisfactory: "Children can play outdoors normally with good air quality.",
  moderate: "Limit prolonged outdoor play. Use N95 mask for outdoor activities.",
  poor: "Keep children indoors. Use air purifier inside. Minimize outdoor exposure.",
  veryPoor: "Keep children strictly indoors. Use medical air purifier. Close windows.",
  severe: "Emergency alert! Keep children indoors. Consult doctor. Use best-quality air filter.",
};

const ChildrenDiseaseCard = ({ aqi = 0 }) => {
  const level = getAQILevel(aqi);
  const diseases = diseasesByLevel[level] || [];
  const precaution = precautionsByLevel[level];

  return (
    <Card sx={{ mb: 2 }}>
      <CardMedia
        component="img"
        height="200"
        image="https://parentingdiarieswithpreeti.com/wp-content/uploads/2022/04/small-baby.jpg"
        alt="Children playing"
        sx={{ objectFit: "cover" }}
      />
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          👶 Health Impact for Children
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
            backgroundColor: "#FFF3E0",
            borderRadius: 1,
            borderLeft: "4px solid #FF9800",
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

export default ChildrenDiseaseCard;

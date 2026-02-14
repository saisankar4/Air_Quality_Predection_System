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

// Images that change based on AQI level
const imageByLevel = {
  good: "https://cdn.cdnparenting.com/articles/2018/07/1009601068-H.webp", // Happy children playing
  satisfactory: "https://wowparenting.com/wp-content/uploads/2019/03/Untitled-design-1.png", // Active children
  moderate: "https://www.slumbersac.ie/cdn/shop/articles/when-do-children-show-emotions.jpg?v=1723618502", // Concerned expression
  poor: "https://media.emscimprovement.center/images/EMS220623_PEAKWebGraphics500x300_01.width-500.png", // Healthcare/distressed
  veryPoor: "https://www.shutterstock.com/shutterstock/photos/2441390011/display_1500/stock-photo-sick-asian-boy-touching-neck-unwell-coughing-with-sore-throat-pain-lung-cancer-bronchitis-bronchial-2441390011.jpg", // Very unwell
  severe: "https://ichef.bbci.co.uk/news/1024/cpsprodpb/1511/live/624819d0-6bf4-11f0-89ea-4d6f9851f623.jpg.webp", // Critical/hospital 
};

const ChildrenDiseaseCard = ({ aqi = 0 }) => {
  const level = getAQILevel(aqi);
  const diseases = diseasesByLevel[level] || [];
  const precaution = precautionsByLevel[level];
  const cardImage = imageByLevel[level];

  return (
    <Card sx={{ mb: 2 }}>
      <CardMedia
        component="img"
        height="200"
        image={cardImage}
        alt="Children health status"
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

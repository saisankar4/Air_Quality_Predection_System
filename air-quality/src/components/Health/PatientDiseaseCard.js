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
    { disease: "Condition stable", icon: "✅" },
  ],
  moderate: [
    { disease: "Asthma control worsens", icon: "🫁" },
    { disease: "Increased medication need", icon: "💊" },
  ],
  poor: [
    { disease: "Acute asthma attacks", icon: "🚨" },
    { disease: "Chronic obstructive pulmonary disease (COPD) worsening", icon: "🫁" },
    { disease: "Heart condition complications", icon: "❤️" },
    { disease: "Allergic rhinitis flare-ups", icon: "🤧" },
  ],
  veryPoor: [
    { disease: "Severe asthma crisis", icon: "🚨" },
    { disease: "COPD exacerbation requiring hospitalization", icon: "🏥" },
    { disease: "Cardiac arrhythmia episodes", icon: "📊" },
    { disease: "Pulmonary fibrosis progression risk", icon: "⚠️" },
  ],
  severe: [
    { disease: "Life-threatening asthma attacks", icon: "🚨" },
    { disease: "Respiratory failure", icon: "😮‍💨" },
    { disease: "Acute myocardial infarction risk", icon: "🚑" },
    { disease: "ICU admission likely needed", icon: "🏥" },
  ],
};

const precautionsByLevel = {
  good: "Continue regular medical check-ups. Maintain medication compliance.",
  satisfactory: "Monitor symptoms regularly. Have prescribed medicines available.",
  moderate: "Use prescribed inhalers frequently. Carry emergency medications. Limit outdoor exposure.",
  poor: "Stay indoors with air purifier. Use prescribed medications. Consult doctor daily.",
  veryPoor: "Hospital admission may be needed. Use medical oxygen. Keep emergency contacts ready.",
  severe: "Emergency hospitalization required. Call ambulance immediately. Critical medical intervention needed.",
};

// Images that change based on AQI level
const imageByLevel = {
  good: "https://www.rightpatient.com/wp-content/uploads/2023/11/The-Importance-of-Patient-Comfort-and-How-Biometrics-Can-Help.jpg", // Healthy patient 
  satisfactory: "https://d14d5nk8lue86f.cloudfront.net/s3fs-public/styles/header_image/public/2021-01/Stable%20CAD%20With%20High-Risk%20Anatomy%20Warrants%20PCI%20or%20CABG%2C%20APPROACH%20Suggests.jpeg?itok=_QsSH71t", // Stable patient
  moderate: "https://cdn.prod.website-files.com/67a9f7e05bb5f8e3e7410ca5/6836e47d8aeef5da82b72595_emergency_medicine.webp", // Medical attention
  poor: "https://www.hopequre.com/live-images/blog-detil/General-physician.webp", // Doctor consultation
  veryPoor: "https://www.2050healthcare.com/assets/images/service/bedside-about-us.webp", // Hospital care needed
  severe: "https://www.parkhospital.in/storage/app/public/upload/rkngmFl4S0EOFU8uUohWnCXCAaUyFdPydZsZbAgI.png", // Critical/ICU
};

const PatientDiseaseCard = ({ aqi = 0 }) => {
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
        alt="Patient health status"
        sx={{ objectFit: "cover" }}
      />
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          🏥 Health Impact for Patients with Existing Conditions
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            Possible Health Risks:
          </Typography>
          {diseases.length === 0 ? (
            <Typography variant="body2" color="success.main">
              ✅ No additional risks at this AQI level
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
            backgroundColor: "#F3E5F5",
            borderRadius: 1,
            borderLeft: "4px solid #9C27B0",
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
            💡 Critical Precautions:
          </Typography>
          <Typography variant="body2">{precaution}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PatientDiseaseCard;

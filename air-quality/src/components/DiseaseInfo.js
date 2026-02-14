import React from "react";
import { Box } from "@mui/material";
import ChildrenDiseaseCard from "./Health/ChildrenDiseaseCard";
import ElderlyDiseaseCard from "./Health/ElderlyDiseaseCard";
import PatientDiseaseCard from "./Health/PatientDiseaseCard";
import PrecautionsCard from "./Health/PrecautionsCard";

const DiseaseInfo = ({ aqi = 0 }) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <ChildrenDiseaseCard aqi={aqi} />
      <ElderlyDiseaseCard aqi={aqi} />
      <PatientDiseaseCard aqi={aqi} />
      <PrecautionsCard aqi={aqi} />
    </Box>
  );
};

export default DiseaseInfo;

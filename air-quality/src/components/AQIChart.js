import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const AQIChart = ({ data }) => {
  return (
    <BarChart width={500} height={300} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="hour" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="aqi" fill="#ff4d4d" />
    </BarChart>
  );
};

export default AQIChart;

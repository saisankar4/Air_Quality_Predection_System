import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, Typography } from "@mui/material";
import { AQI_COLORS } from "../theme";

const AQIChart = ({ data, title = "Hourly AQI Data" }) => {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography color="textSecondary">No data available</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="hour"
              angle={-45}
              textAnchor="end"
              height={100}
              interval={Math.floor(data.length / 8)}
            />
            <YAxis />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: `1px solid ${AQI_COLORS.moderate}`,
                borderRadius: "4px",
              }}
              formatter={(value) => [Math.round(value), "AQI"]}
            />
            <Bar
              dataKey="aqi"
              fill={AQI_COLORS.poor}
              radius={[8, 8, 0, 0]}
              isAnimationActive={true}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default AQIChart;

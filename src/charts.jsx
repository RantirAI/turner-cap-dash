import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Chart = ({
  data,
  type,
  metrics,
  selectedMetric,
  chartColors,
  fontColor,
  backgroundColor,
}) => (
  <ResponsiveContainer width="100%" height={500}>
    <LineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis
        dataKey="Month"
        stroke={fontColor}
        tick={{ fontSize: 8, fill: fontColor }}
      />
      <YAxis stroke={fontColor} />
      <Tooltip
        contentStyle={{ backgroundColor: backgroundColor, color: fontColor }}
      />
      <Legend />
      {type === "comparison"
        ? metrics.map((metric, index) => (
            <Line
              key={metric}
              type="monotone"
              dataKey={metric}
              stroke={chartColors[index]}
              activeDot={{ r: 8 }}
              strokeWidth={2}
            />
          ))
        : selectedMetric && (
            <Line
              type="monotone"
              dataKey={selectedMetric}
              stroke={chartColors[0]}
              activeDot={{ r: 8 }}
              strokeWidth={2}
            />
          )}
    </LineChart>
  </ResponsiveContainer>
);

export default Chart;

import React, { useState, useEffect, useMemo } from "react";
import { Box, Text, Select as ChakraSelect, HStack, Heading, Grid } from "@chakra-ui/react";
import TradingPerformanceChart from "./TradingPerformanceChart";
import Chart from "./charts";
import PerformanceResults from "./PerformanceResults";
import DateRangeSelector from "./DateRangeSelector";
import { initialData } from "./data";

const Dashboard = () => {
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [fontColor, setFontColor] = useState("#000000");
  const [chartColors, setChartColors] = useState([
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff7300",
  ]);
  const [startDate, setStartDate] = useState("2023-03-31");
  const [endDate, setEndDate] = useState("2024-07-31");

  // Example metrics and filtered data logic (similar to what you already have)
  const metrics = ["TMI-1x", "TMI-2x", "TMI-3x", "S&P 500"];

  const filteredInitialData = useMemo(() => {
    return initialData.filter(
      (item) => item.Month >= startDate && item.Month <= endDate,
    );
  }, [startDate, endDate]);

  const calculatePerformance = useMemo(() => {
    const startData = filteredInitialData[0];
    const endData = filteredInitialData[filteredInitialData.length - 1];
    const performance = {};

    metrics.forEach((metric) => {
      if (
        startData &&
        endData &&
        startData[metric] !== null &&
        endData[metric] !== null
      ) {
        const startValue = startData[metric];
        const endValue = endData[metric];
        const change = ((endValue - startValue) / startValue) * 100;
        performance[metric] = change.toFixed(2);
      }
    });
    return performance;
  }, [filteredInitialData, metrics]);

  return (
    <Box
      className="chart-card"
      boxShadow="xl" // Add shadow
      borderRadius="lg" // Rounded corners
      p={6} // Padding inside the box
      maxW="4xl"
      mx="auto"
      bg={backgroundColor}
      color={fontColor}
      style={{ fontFamily: "Roboto, sans-serif" }}
    >
      <Heading as="h1" size="2xl" mb={4}>
        Financial Performance Dashboard
      </Heading>

      {/* Date Range Selector for First Chart */}
      <DateRangeSelector
        initialData={initialData}
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
      />

      {/* Chart for the filtered initial data */}
      <Chart
        data={filteredInitialData}
        type="comparison"
        metrics={metrics}
        selectedMetric={"TMI-1x"}
        chartColors={chartColors}
        fontColor={fontColor}
        backgroundColor={backgroundColor}
      />

      <PerformanceResults
        metrics={metrics}
        performance={calculatePerformance}
      />

      {/* Trading Performance Chart with backgroundColor and fontColor props */}
      <TradingPerformanceChart
        fontColor={fontColor}
        backgroundColor={backgroundColor}
      />
    </Box>
  );
};

export default Dashboard;

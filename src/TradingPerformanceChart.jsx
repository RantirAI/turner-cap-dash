import React, { useState, useEffect, useMemo } from "react";
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
import Papa from "papaparse";
import {
  Box,
  Text,
  Select as ChakraSelect,
  HStack,
  Heading,
  Grid,
} from "@chakra-ui/react";

const TradingPerformanceChart = ({
  fontColor = "#333",
  backgroundColor = "#fff",
}) => {
  const [tradingData, setTradingData] = useState([]);
  const [tradingStartDate, setTradingStartDate] = useState("");
  const [tradingEndDate, setTradingEndDate] = useState("");
  const [tradingLoading, setTradingLoading] = useState(true);
  const [tradingError, setTradingError] = useState(null);

  useEffect(() => {
    const csvUrl =
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vRO99iDZZiqlXeGXRUP1Aubm7Fs2LP0oeda-yoxajUFsILfuOngPU196aKNhCeYd9kBRhFRHQx4gA8l/pub?output=csv";

    Papa.parse(csvUrl, {
      download: true,
      header: true,
      dynamicTyping: true,
      complete: (results) => {
        const parsedData = results.data
          .map((item) => ({
            ...item,
            open: item.open.trim(),
          }))
          .filter((item) => item.open);

        const sortedData = parsedData.sort(
          (a, b) => new Date(a.open) - new Date(b.open),
        );

        setTradingData(sortedData);
        setTradingStartDate(sortedData[0]?.open || "");
        setTradingEndDate(sortedData[sortedData.length - 1]?.open || "");
        setTradingLoading(false);
      },
      error: (err) => {
        setTradingError(err);
        setTradingLoading(false);
      },
    });
  }, []);

  // Filter the trading data based on selected date range
  const filteredTradingData = useMemo(() => {
    return tradingData.filter(
      (item) =>
        new Date(item.open) >= new Date(tradingStartDate) &&
        new Date(item.open) <= new Date(tradingEndDate),
    );
  }, [tradingStartDate, tradingEndDate, tradingData]);

  // Calculate performance change for the key metrics
  const calculatePerformanceMetrics = useMemo(() => {
    const startData = filteredTradingData[0];
    const endData = filteredTradingData[filteredTradingData.length - 1];

    if (!startData || !endData) return {};

    const metrics = ["net gain", "pct gain", "combined percent gain"];
    const performance = {};
    const MIN_START_VALUE = 0.01;

    metrics.forEach((metric) => {
      if (startData[metric] !== null && endData[metric] !== null) {
        let startValue = startData[metric];
        const endValue = endData[metric];

        if (Math.abs(startValue) < MIN_START_VALUE) {
          startValue = MIN_START_VALUE;
        }

        if (startValue > 0) {
          const change = ((endValue - startValue) / startValue) * 100;
          performance[metric] = change.toFixed(2);
        } else {
          performance[metric] = "N/A";
        }
      } else {
        performance[metric] = "N/A";
      }
    });

    return performance;
  }, [filteredTradingData]);

  if (tradingLoading) return <Text>Loading Trading Performance Data...</Text>;
  if (tradingError)
    return <Text color="red.500">Error: {tradingError.message}</Text>;

  return (
    <Box
      className="chart-card"
      m="15px" // Add margin of 15px
      boxShadow="0px 4px 12px rgba(0, 0, 0, 0.1)" // Custom shadow
      p="20px" // Add padding of 20px
      borderR="12px" // Add border radius of 12px
    >
      <HStack spacing={4} mb={4}>
        <Box>
          <Text mb={1} fontSize="sm" fontWeight="medium">
            Start Date
          </Text>
          <ChakraSelect
            placeholder="Select start date"
            value={tradingStartDate}
            onChange={(e) => setTradingStartDate(e.target.value)}
          >
            {tradingData.map((item) => (
              <option key={item.open} value={item.open}>
                {item.open}
              </option>
            ))}
          </ChakraSelect>
        </Box>

        <Box>
          <Text mb={1} fontSize="sm" fontWeight="medium">
            End Date
          </Text>
          <ChakraSelect
            placeholder="Select end date"
            value={tradingEndDate}
            onChange={(e) => setTradingEndDate(e.target.value)}
          >
            {tradingData.map((item) => (
              <option key={item.open} value={item.open}>
                {item.open}
              </option>
            ))}
          </ChakraSelect>
        </Box>
      </HStack>

      <ResponsiveContainer width="100%" height={500}>
        <LineChart data={filteredTradingData}>
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.5} />
          <XAxis
            dataKey="open"
            stroke={fontColor}
            tick={{ fontSize: 12, fill: fontColor }}
          />
          <YAxis stroke={fontColor} />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.9)",
            }}
            className="custom-tooltip"
          />
          <Legend verticalAlign="top" height={36} />
          <Line
            type="monotone"
            dataKey="net gain"
            stroke="#8884d8"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="pct gain"
            stroke="#82ca9d"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="combined percent gain"
            stroke="#ffc658"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Display the calculated performance metrics */}
      <Box mt={4}>
        <Heading size="md" mb={2}>
          Performance Metrics over Selected Range
        </Heading>
        <Grid templateColumns="repeat(3, 1fr)" gap={6}>
          {/* Net Gain */}
          <Box
            p={4}
            bg="white"
            borderRadius="lg"
            boxShadow="lg"
            textAlign="center"
            m="15px" // Add margin of 15px
          >
            <Text fontSize="lg" fontWeight="bold" mb={2}>
              Net Gain
            </Text>
            <Text
              fontSize="xl"
              color={
                calculatePerformanceMetrics["net gain"] >= 0
                  ? "green.500"
                  : "red.500"
              }
            >
              {calculatePerformanceMetrics["net gain"] || "N/A"}%
            </Text>
          </Box>

          {/* Pct Gain */}
          <Box
            p={4}
            bg="white"
            borderRadius="lg"
            boxShadow="lg"
            textAlign="center"
            m="15px" // Add margin of 15px
          >
            <Text fontSize="lg" fontWeight="bold" mb={2}>
              Pct Gain
            </Text>
            <Text
              fontSize="xl"
              color={
                calculatePerformanceMetrics["pct gain"] >= 0
                  ? "green.500"
                  : "red.500"
              }
            >
              {calculatePerformanceMetrics["pct gain"] || "N/A"}%
            </Text>
          </Box>

          {/* Combined Percent Gain */}
          <Box
            p={4}
            bg="white"
            borderRadius="lg"
            boxShadow="lg"
            textAlign="center"
            m="15px" // Add margin of 15px
          >
            <Text fontSize="lg" fontWeight="bold" mb={2}>
              Combined Percent Gain
            </Text>
            <Text
              fontSize="xl"
              color={
                calculatePerformanceMetrics["combined percent gain"] >= 0
                  ? "green.500"
                  : "red.500"
              }
            >
              {calculatePerformanceMetrics["combined percent gain"] || "N/A"}%
            </Text>
          </Box>
        </Grid>
      </Box>
    </Box>
  );
};

export default TradingPerformanceChart;

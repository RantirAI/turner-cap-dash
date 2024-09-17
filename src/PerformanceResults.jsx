import React from "react";
import { Box, Heading, Text, Grid } from "@chakra-ui/react";

const PerformanceResults = ({ metrics, performance }) => {
  return (
    <Box
      mt={4}
      boxShadow="0px 4px 12px rgba(0, 0, 0, 0.1)" // Custom shadow
      p={15} // Padding inside the box
      m={15} // Margin around the box
      borderRadius="lg" // Slight rounding of the corners
      bg="white" // Background color
    >
      <Heading size="md" mb={4}>
        Performance over Selected Range
      </Heading>
      <Grid templateColumns="repeat(3, 1fr)" gap={6}>
        {metrics.map((metric) => (
          <Box
            key={metric}
            p={4}
            bg="gray.50" // Light gray background for each metric card
            borderRadius="md"
            boxShadow="sm" // Slight shadow for each card
            textAlign="center"
          >
            <Text fontSize="lg" fontWeight="bold" mb={2}>
              {metric}
            </Text>
            <Text
              fontSize="xl"
              color={performance[metric] >= 0 ? "green.500" : "red.500"}
            >
              {performance[metric] ? `${performance[metric]}%` : "N/A"}
            </Text>
          </Box>
        ))}
      </Grid>
    </Box>
  );
};

export default PerformanceResults;

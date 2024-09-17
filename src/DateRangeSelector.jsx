import React from "react";
import { Box, Text, Select as ChakraSelect, HStack } from "@chakra-ui/react";

const DateRangeSelector = ({
  initialData,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}) => {
  return (
    <HStack spacing={4} mb={4}>
      <Box>
        <Text mb={1} fontSize="sm" fontWeight="medium">
          Start Date
        </Text>
        <ChakraSelect
          placeholder="Select start date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        >
          {initialData.map((item) => (
            <option key={item.Month} value={item.Month}>
              {item.Month}
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
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        >
          {initialData.map((item) => (
            <option key={item.Month} value={item.Month}>
              {item.Month}
            </option>
          ))}
        </ChakraSelect>
      </Box>
    </HStack>
  );
};

export default DateRangeSelector;

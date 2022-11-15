import React from "react";
import { Box } from "@chakra-ui/react";

function Order({ num }: { num: number }) {
  return (
    <Box
      width={10}
      height={10}
      fontWeight="bold"
      textAlign={'center'}
      lineHeight={8}
      borderRadius={"50%"}
      borderWidth={"2px"}
      borderColor={"primary.default"}
      color={"primary.default"}
    >
      {num}
    </Box>
  );
}

export default Order;

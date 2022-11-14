import React from "react";
import { Box } from "@chakra-ui/react";

function Order({ num }: { num: number }) {
  return (
    <Box
      width={10}
      height={10}
      textAlign={'center'}
      lineHeight={10}
      borderRadius={"50%"}
      border={"1px"}
      borderColor={"primary.default"}
      color={"primary.default"}
    >
      {num}
    </Box>
  );
}

export default Order;

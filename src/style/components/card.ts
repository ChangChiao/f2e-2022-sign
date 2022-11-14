import type { ComponentStyleConfig } from "@chakra-ui/react";
const Card: ComponentStyleConfig = {
  // The styles all Cards have in common
  baseStyle: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 2,
  },
};

export default Card;

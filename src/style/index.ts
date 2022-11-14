import { extendTheme, withDefaultColorScheme } from "@chakra-ui/react";

import Button from "./components/button";
import colors from "./colors";
import global from "./global";
import text from "./text";
import { StepsStyleConfig } from "chakra-ui-steps";

const CustomSteps = {
  ...StepsStyleConfig,
  baseStyle: (props) => {
    return {
      ...StepsStyleConfig.baseStyle(props),
      icon: {
        ...StepsStyleConfig.baseStyle(props).icon,
        // your custom styles here
        strokeWidth: "3px",
      },
    };
  },
};

const theme = extendTheme(
  {
    colors,
    global,
    textStyles: text,
    components: {
      Button,
      Steps: CustomSteps,
    },
    config: {
      initialColorMode: "light",
      useSystemColorMode: false,
    },
    breakpoints: {
      sm: "320px",
      md: "768px",
      lg: "960px",
      xl: "1200px",
    },
  },
  withDefaultColorScheme({ colorScheme: "primary" })
);

export default theme;

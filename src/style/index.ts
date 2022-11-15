import { extendTheme,  StyleFunctionProps, withDefaultColorScheme } from "@chakra-ui/react";

import Button from "./components/button";
import colors from "./colors";
import global from "./global";
import Text from "./text";
import Box from "./components/box";
import { StepsStyleConfig } from "chakra-ui-steps";

const CustomSteps = {
  ...StepsStyleConfig,
  baseStyle: (props: StyleFunctionProps) => {
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
    textStyles: Text,
    fonts: {
      body: 'Noto Sans TC, sans-serif',
    },
    components: {
      Button,
      Box,
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

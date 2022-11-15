import { extendTheme,  StyleFunctionProps, withDefaultColorScheme } from "@chakra-ui/react";

import Button from "./components/button";
import colors from "./colors";
import global from "./global";
import Text from "./text";
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
    layerStyles: {
      iconBox:{
        border: "1px solid",
        borderColor: 'gray.300',
        width: '48px',
        height: '48px',
        display: 'flex',
        fontSize: '16px',
        borderRadius: '4px',
        justifyContent: 'center',
        alignItems: 'center',
        _hover: {
          color: 'gray.300'
        }
      }
    },
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

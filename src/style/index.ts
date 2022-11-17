import { extendTheme,  StyleFunctionProps, withDefaultColorScheme } from "@chakra-ui/react";

import Button from "./components/button";
import colors from "./colors";
import global from "./global";
import Text from "./text";

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
        backgroundColor: '#fff',
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

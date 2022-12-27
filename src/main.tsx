import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import App from "./App";
import theme from "./style";
import "./index.css";
import CanvasContextProvider from "./provider/CanvasProvider";
import StepContextProvider from "./provider/StepProvider";
import FileContextProvider from "./provider/FileProvider";
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <CanvasContextProvider>
      <ChakraProvider resetCSS theme={theme}>
        <StepContextProvider>
          <FileContextProvider>
            <App />
          </FileContextProvider>
        </StepContextProvider>
      </ChakraProvider>
    </CanvasContextProvider>
  </React.StrictMode>
);

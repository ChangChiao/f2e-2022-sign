/// <reference types="vite-plugin-svgr/client" />

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import createSvgSpritePlugin from "vite-plugin-svg-sprite";
import svgr from "vite-plugin-svgr";



// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr(),
    // createSvgSpritePlugin({
    //   symbolId: "[name]",
    //   include: "/src/assets/icon/**.svg"
    // }),
  ],
  server: {
    watch: {
      usePolling: true, //for chakra-ui,
    },
  },
  build: {
    target: 'esnext'
  }
});

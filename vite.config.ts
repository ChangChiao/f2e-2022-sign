import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import createSvgSpritePlugin from "vite-plugin-svg-sprite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    createSvgSpritePlugin({
      symbolId: "[name]",
      // include: "/src/assets/icon/**.svg"
    }),
  ],
  server: {
    watch: {
      usePolling: true, //for chakra-ui,
    },
  },
});

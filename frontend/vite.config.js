import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()], // Remove tailwindcss() since Tailwind works via `postcss.config.js`
  server: {
    proxy: {
      "/api": "http://localhost:5173",
    },
    historyApiFallback: true, // Enable client-side routing
  },
  preview: {
    historyApiFallback: true, // Enable client-side routing for preview
  },
});

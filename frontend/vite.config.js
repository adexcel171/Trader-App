import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    historyApiFallback: true, // Enable client-side routing
  },
  preview: {
    historyApiFallback: true, // Enable client-side routing for preview
  },
});

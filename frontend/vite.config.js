import tailwindcss from "@tailwindcss/vite";
// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

// https://vite.dev/config/
// export default defineConfig({
//
//   build: {
//     outDir: "dist", // Ensures build goes to dist
//   },
// });
import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  plugins: [tailwindcss(), react()],
  build: {
    outDir: path.resolve(__dirname, "dist"), // Ensures correct build location
  },
});

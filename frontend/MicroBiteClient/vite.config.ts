import { defineConfig } from "vite";
import fs from "fs";
import path from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: "localhost",
    port: 5173,
    watch: {
      usePolling: true,
      interval: 200,
    },
    https: {
      key: fs.readFileSync(path.resolve(__dirname, "certs/dev-key.pem")),
      cert: fs.readFileSync(path.resolve(__dirname, "certs/dev.pem")),
    },
  },
});

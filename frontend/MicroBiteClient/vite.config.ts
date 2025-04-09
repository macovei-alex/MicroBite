import { defineConfig, loadEnv } from "vite";
import fs from "fs";
import path from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

type Env = {
  VITE_USE_HTTPS: string;
  VITE_BASE_AUTH_URL: string;
  VITE_BASE_RES_URL: string;
};

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "") as Env;

  return {
    plugins: [react(), tailwindcss()],
    server: {
      host: "localhost",
      port: 5173,
      watch: {
        usePolling: true,
        interval: 200,
      },
      https:
        env.VITE_USE_HTTPS === "true"
          ? {
              key: fs.readFileSync(path.resolve(__dirname, "certs/dev-key.pem")),
              cert: fs.readFileSync(path.resolve(__dirname, "certs/dev.pem")),
            }
          : undefined,
    },
  };
});

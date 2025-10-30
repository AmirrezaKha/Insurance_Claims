import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/upload": "http://localhost:8000",
      "/dbt": "http://localhost:8000",
      "/mlflow": "http://localhost:8000",
      "/databricks": "http://localhost:8000",
    },
  },
});

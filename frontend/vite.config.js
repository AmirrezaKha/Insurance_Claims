import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true, // required for Docker
    proxy: {
      "/upload": "http://fastapi:8001",
      "/dbt": "http://fastapi:8001",
      "/mlflow": "http://fastapi:8001",
      "/databricks": "http://fastapi:8001",
    },
  },
});

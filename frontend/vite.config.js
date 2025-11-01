import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // required for Docker
    port: 5173,
    proxy: {
      // Forward all API requests to the backend container
      '/upload': {
        target: 'http://fastapi:8001',
        changeOrigin: true,
        secure: false,
      },
      '/dbt': {
        target: 'http://fastapi:8001',
        changeOrigin: true,
        secure: false,
      },
      '/mlflow': {
        target: 'http://fastapi:8001',
        changeOrigin: true,
        secure: false,
      },
      '/databricks': {
        target: 'http://fastapi:8001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});

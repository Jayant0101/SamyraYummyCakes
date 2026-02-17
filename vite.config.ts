import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env vars regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    define: {
      // Polyfill process.env.API_KEY so it works in the browser
      // Checks for API_KEY first, then VITE_API_KEY. Defaults to empty string if missing.
      'process.env.API_KEY': JSON.stringify(env.API_KEY || env.VITE_API_KEY || "")
    },
    build: {
      // Increase the warning limit to 2000kb (2MB) to silence chunk size warnings
      chunkSizeWarningLimit: 2000,
      rollupOptions: {
        output: {
          // Manually split large vendor libraries into their own chunks for better caching
          manualChunks: {
            'vendor-react': ['react', 'react-dom', 'react-router-dom'],
            'vendor-genai': ['@google/genai'],
            'vendor-ui': ['lucide-react', 'react-hook-form']
          }
        }
      }
    }
  };
});
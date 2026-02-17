import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Increase the warning limit to 1000kb (1MB) to silence warnings for the GenAI SDK
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Manually split large vendor libraries into their own chunks
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-genai': ['@google/genai'],
          'vendor-ui': ['lucide-react']
        }
      }
    }
  }
});
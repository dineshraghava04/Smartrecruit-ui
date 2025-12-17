import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://v itejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});

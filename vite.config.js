// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; // React plugin for Vite
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),        // Enable React plugin
    tailwindcss(),  // Enable Tailwind plugin
  ],
});
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env variables for the current mode (development, production, etc.)
  // This loads variables from .env, .env.local, .env.[mode], .env.[mode].local
  const env = loadEnv(mode, process.cwd(), ''); // Load all env vars (no prefix)

  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react()],
    define: {
      // Explicitly define VITE_ prefixed environment variables for the client
      // Vite automatically exposes VITE_* variables, but defining them here can help with type checking and clarity
      // Note: process.env.VITE_* is for Node.js environment, import.meta.env.VITE_* is for client-side
      // We primarily use import.meta.env.VITE_* in the client code
      '__APP_VERSION__': JSON.stringify('1.0.0'), // Example of defining a custom variable
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    },
    // Ensure environment variables are available
    envPrefix: 'VITE_', // This is the default, but we make it explicit
  };
});
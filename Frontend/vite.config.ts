import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig(({ mode }) => {
  // Load environment variables based on the current mode (development/production)
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    define: {
      'import.meta.env': JSON.stringify(env), // Ensure env variables are available
    },
    build: {
      minify: 'terser', // Use Terser for better minification
      terserOptions: {
        compress: {
          drop_console: true, // Remove console.logs
          dead_code: true, // Remove unused code (tree shaking)
        },
      },
      rollupOptions: {
        treeshake: true, // Ensure tree shaking is enabled
      },
    },
    optimizeDeps: {
      esbuildOptions: {
        treeShaking: true, // Enable tree shaking in dependencies
      },
    },
  };
})
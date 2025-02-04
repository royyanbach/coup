import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command, mode }) => {
  return {
    base: command === 'build' ? '/coup/' : '/',
    build: {
      rollupOptions: {
        output: {
          entryFileNames: `[name].[hash].js`,
          chunkFileNames: `[name].[hash].js`,
          assetFileNames: `[name].[hash].[ext]`
        }
      },
    },
    plugins: [react()],
  }
});

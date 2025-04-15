import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    rollupOptions: {
      input: {
        scraper: resolve(__dirname, './src/content-scripts/scraper.ts'),
      },
      output: {
        entryFileNames: 'assets/[name].js',
      }
    },
    minify: 'esbuild',
    esbuild: {
      minifyIdentifiers: false,
    }
  }
});

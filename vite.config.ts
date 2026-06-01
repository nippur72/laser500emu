import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode === 'production' ? 'production' : 'development')
    },
    build: {
      lib: {
        entry: 'src/index.ts',
        name: 'laser500emu',
        formats: ['iife'],
        fileName: () => 'bundle.js',
      },
      outDir: 'dist',
      sourcemap: 'inline',
      emptyOutDir: false,
    }
  };
});

/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.NODE_ENV': JSON.stringify('development'),
  },
  resolve: {
    conditions: ['development', 'browser', 'import', 'default'],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
    css: true,
    server: {
      deps: {
        inline: [/react/, /react-dom/, /scheduler/],
      },
    },
  },
});

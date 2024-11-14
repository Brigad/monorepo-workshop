import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  resolve: {
    extensions: [
      ".web.ts",
      ".web.tsx",
      ".web.js",
      ".web.jsx",
      ".ts",
      ".tsx",
      ".js",
      ".jsx",
      ".json",
      ".mjs",
      ".cjs",
    ],
  }
})

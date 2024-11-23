import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/users": {
        target: "http://localhost:8000/api/v1/users",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/users/, ""), // No need to change this
      },
      "/videos": {
        target: "http://localhost:8000/api/v1/videos",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/videos/, ""), // No need to change this
      },
      "/subscription": {
        target: "http://localhost:8000/api/v1/subscription",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/subscription/, ""), // No need to change this
      },
      "/like": {
        target: "http://localhost:8000/api/v1/like",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/like/, ""), // Fix this to retain the path
      },
    },
  },
});

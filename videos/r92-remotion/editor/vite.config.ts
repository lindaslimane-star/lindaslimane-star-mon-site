import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { apiPlugin } from "./api-plugin";

export default defineConfig({
  root: __dirname,
  publicDir: path.resolve(__dirname, "../public"), // mêmes fichiers que Remotion (videos/…)
  plugins: [react(), apiPlugin()],
  server: { port: 5173, host: true, fs: { allow: [path.resolve(__dirname, "..")] } },
});

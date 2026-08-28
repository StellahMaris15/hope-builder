import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  resolve: {
    alias: {
      "lucide-react": fileURLToPath(new URL("./src/vendor/lucide-react.ts", import.meta.url)),
    },
  },
  plugins: [
    tsconfigPaths(),
    react(),
    tailwindcss(),
  ],
});
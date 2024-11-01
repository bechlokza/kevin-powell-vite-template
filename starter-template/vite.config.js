import { resolve } from "path";
import { defineConfig } from "vite";
import htmlPurge from "vite-plugin-purgecss";

export default defineConfig({
  plugins: [htmlPurge()],
  root: resolve(__dirname, "src/"),
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        home: resolve(__dirname, "src/index.html"),
        about: resolve(__dirname, "src/about/index.html"),
        contact: resolve(__dirname, "src/contact/index.html"),
      },
    },
  },
});

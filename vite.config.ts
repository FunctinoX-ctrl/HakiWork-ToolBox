import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import electron from "vite-plugin-electron"
import renderer from "vite-plugin-electron-renderer"
import { resolve, dirname } from "path"
import { writeFileSync, existsSync, readFileSync } from "fs"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig(({ mode }) => {
  const plugins: any[] = [react()]

  if (mode !== "renderer") {
    plugins.push(electron([
      {
        entry: "src/main/index.ts",
        vite: {
          resolve: {
            alias: { "@shared": "./src/shared" },
            extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
          },
          build: {
            outDir: "dist/main",
            rollupOptions: { external: ["electron"] },
          },
        },
      },
    ]))
  }

  plugins.push(renderer())

  return {
    plugins,
    root: ".",
    publicDir: false,
    base: "./",
    build: {
      outDir: "dist/renderer",
      emptyOutDir: true,
      rollupOptions: {
        input: resolve(__dirname, "src/renderer/index.html"),
      },
    },
    resolve: {
      alias: { "@shared": "./src/shared" },
      extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
    },
  }
})
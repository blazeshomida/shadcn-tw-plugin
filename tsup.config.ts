import { defineConfig } from "tsup";

const env = process.env.NODE_ENV;

export default defineConfig({
  splitting: env === "production",
  clean: true, // clean up the dist folder
  dts: true, // generate dts files
  format: "esm", // generate esm files only
  sourcemap: true,
  minify: env === "production",
  bundle: env === "production",
  skipNodeModulesBundle: true,
  watch: env === "development",
  target: "es2022",
  outDir: "dist",
  entry: ["src/**/*.ts"], //include all files under src
});

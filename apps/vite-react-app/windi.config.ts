import { defineConfig } from "@kym-config/windicss";

export default defineConfig({
  include: ["src/**/*.{vue,html,jsx,tsx}"],
  exclude: [".turbo", "node_modules", "dist"],
});

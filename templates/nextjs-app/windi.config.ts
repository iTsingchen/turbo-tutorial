import { defineConfig } from "@turbo-tutorial/windicss";

export default defineConfig({
  include: ["**/*.{vue,html,jsx,tsx}"],
  exclude: [".turbo", ".next", "node_modules"],
});

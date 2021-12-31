import path from "path";
import { defineConfig as officialDefineConfig } from "windicss/helpers";
import { ExtractOptions } from "windicss/types/interfaces";

const uniqueElements = <T>(arr: T[]) => [...new Set(arr)];
const makeExtractOptions = (customOptions: ExtractOptions) => {
  const include = uniqueElements([
    path.resolve(__dirname, "../../packages/**/*.{vue,html,jsx,tsx}"),
    ...customOptions.include,
  ]);
  const exclude = uniqueElements([
    ".turbo",
    "node_modules",
    ...customOptions.exclude,
  ]);
  const extractors = customOptions.extractors;

  return { include, exclude, extractors };
};

export const defineConfig = (extractOptions: ExtractOptions) => {
  return officialDefineConfig({
    extract: makeExtractOptions(extractOptions),
    /**
     * The following will be used to define the general windicss configuration.
     * For example:
     *
     * darkMode: 'class',
     * safelist: 'p-3 p-4 p-5',
     * theme: {
     *   extend: {
     *     colors: {
     *       teal: { 100: '#096' },
     *     },
     *   },
     * },
     * plugins: [formsPlugin],
     *
     */
  });
};

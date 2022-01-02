const child_process = require("child_process");
const path = require("path");
const {
  removeLoaders,
  addAfterLoader,
  loaderByName,
  pluginByName,
  getPlugin,
  addPlugins,
} = require("@craco/craco");
const WindiCSSWebpackPlugin = require("windicss-webpack-plugin");
const { EnvironmentPlugin } = require("webpack");

function git(command) {
  return child_process.execSync(`git ${command}`, { encoding: "utf8" }).trim();
}

function supportMultiPage(webpackConfig, { env }) {
  const isDevelopment = env === "development";
  const isProduction = env === "production";

  const getPluginByName = (name) =>
    getPlugin(webpackConfig, pluginByName(name)).match;

  // 1. Update webpack entry and output
  // https://webpack.js.org/configuration/entry-context/#entry
  // https://webpack.js.org/configuration/output/#outputfilename
  const routes = require(webpackConfig.entry);
  if (!routes.home) {
    throw new Error("Multi-page mode must contain a home entry.");
  }
  const routeEntries = Object.entries(routes).map(([name, p]) => [
    name,
    path.resolve(path.dirname(webpackConfig.entry), p),
  ]);
  webpackConfig.entry = Object.fromEntries(routeEntries);
  webpackConfig.output.filename = isProduction
    ? "static/js/[name].[contenthash:8].js"
    : isDevelopment && "static/js/[name].bundle.js";

  // 2. Generating multiple HTML entry points
  // https://github.com/jantimon/html-webpack-plugin#generating-multiple-html-files
  const { userOptions: homeHtmlOptions, constructor: HtmlWebpackPlugin } =
    getPluginByName("HtmlWebpackPlugin");

  const htmlWebpackPlugins = routeEntries
    .map(([name]) => name)
    .filter((name) => name !== "home")
    .map(
      (name) =>
        new HtmlWebpackPlugin({
          ...homeHtmlOptions,
          chunks: [name],
          filename: `${name}/index.html`,
        })
    );

  addPlugins(webpackConfig, htmlWebpackPlugins);
  homeHtmlOptions.chunks = ["home"]; // for index.html

  // 3. Update WebpackManifest to support multi entry points
  const { options: manifestPluginOptions } = getPluginByName(
    "WebpackManifestPlugin"
  );
  manifestPluginOptions.generate = (seed, files, entrypoints) => {
    const manifestFiles = files.reduce((manifest, file) => {
      manifest[file.name] = file.path;
      return manifest;
    }, seed);

    /**
     * This is the default implementation of create-react-app, and only one field main is supported.
     *
     * const entrypointFiles = entrypoints.main.filter(
     *    fileName => !fileName.endsWith('.map')
     * );
     *
     * https://github.com/facebook/create-react-app/blob/9673858a3715287c40aef9e800c431c7d45c05a2/packages/react-scripts/config/webpack.config.js#L684
     */
    const entrypointFiles = Object.values(entrypoints)
      .flat()
      .filter((fileName) => !fileName.endsWith(".map"));

    return {
      files: manifestFiles,
      entrypoints: entrypointFiles,
    };
  };
}

function replaceBabelToSwc(webpackConfig, { env }) {
  const isDevelopment = env === "development";

  // https://github.com/pmmmwh/react-refresh-webpack-plugin/blob/69a837e58bc5195377cd3521600c440dedf59b72/README.md?plain=1#L255-L299
  const swcLoader = {
    test: /\.[jt]sx?$/,
    exclude: /node_modules/,
    use: [
      {
        loader: require.resolve("swc-loader"),
        options: {
          jsc: {
            transform: {
              react: {
                development: isDevelopment,
                refresh: isDevelopment,
              },
            },
          },
        },
      },
    ],
  };

  /**
   * Babel-loader will throw an error when parsing TS in package in monorepos,
   * and the include of create-react-app babel-loader needs to be changed,
   * and the dynamic performance is very poor.
   *
   * https://github.com/facebook/create-react-app/blob/9673858a3715287c40aef9e800c431c7d45c05a2/packages/react-scripts/config/webpack.config.js#L415-L422
   *
   * Therefore, using swc-loader instead of babel-loader.
   * swc author to join vercel, and applied to nextjs, has been relatively stable.
   * Minifying that is not using swc for the time being.
   * https://nextjs.org/blog/next-11-1#adopting-rust-based-swc
   *
   * Warn: Make sure to add swc-loader before removing babel-loader.
   */
  //
  addAfterLoader(webpackConfig, loaderByName("babel-loader"), swcLoader);
  removeLoaders(webpackConfig, loaderByName("babel-loader"));
}

// As webpack5 supports Web Worker by default, Worker-Loader is no longer needed.
// https://webpack.js.org/guides/web-workers/#root

module.exports = {
  webpack: {
    plugins: {
      add: [
        // https://windicss.org/integrations/webpack.html#create-react-app-craco
        new WindiCSSWebpackPlugin({ virtualModulePath: "src" }),
        // https://webpack.js.org/plugins/environment-plugin/#use-case-git-version
        new EnvironmentPlugin({
          GIT_VERSION: git(`rev-parse --short HEAD`),
        }),
      ],
    },
    configure: (webpackConfig, options) => {
      replaceBabelToSwc(webpackConfig, options);

      // If webpackConfig.entry is json, support for multi-page mode will be enhanced.
      if (webpackConfig.entry.endsWith(".json")) {
        supportMultiPage(webpackConfig, options);
      }

      return webpackConfig;
    },
  },
};

const child_process = require("child_process");
const { removeLoaders, addAfterLoader, loaderByName } = require("@craco/craco");
const WindiCSSWebpackPlugin = require("windicss-webpack-plugin");
const { EnvironmentPlugin } = require("webpack");

function git(command) {
  return child_process.execSync(`git ${command}`, { encoding: "utf8" }).trim();
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
    configure: (webpackConfig, { env }) => {
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

      return webpackConfig;
    },
  },
};

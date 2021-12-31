const { removeLoaders, addAfterLoader, loaderByName } = require("@craco/craco");
const WindiCSSWebpackPlugin = require("windicss-webpack-plugin");

module.exports = {
  webpack: {
    plugins: {
      add: [new WindiCSSWebpackPlugin({ virtualModulePath: "src" })],
    },
    configure: (webpackConfig, { env, paths }) => {
      const isDevelopment = env === "development";

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

      addAfterLoader(webpackConfig, loaderByName("babel-loader"), swcLoader);
      removeLoaders(webpackConfig, loaderByName("babel-loader"));

      return webpackConfig;
    },
  },
};

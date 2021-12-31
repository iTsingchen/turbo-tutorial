const WindiCSSWebpackPlugin = require("windicss-webpack-plugin");
const withTM = require("next-transpile-modules")(["@kym/widgets"]);

module.exports = withTM({
  reactStrictMode: true,

  webpack(config) {
    config.plugins.push(new WindiCSSWebpackPlugin());
    return config;
  },
});

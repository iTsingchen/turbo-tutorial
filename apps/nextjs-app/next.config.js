const WindiCSSWebpackPlugin = require("windicss-webpack-plugin");
const withTM = require("next-transpile-modules")(["@turbo-tutorial/widgets"]);

module.exports = withTM({
  reactStrictMode: true,

  webpack(config) {
    // https://windicss.org/integrations/webpack.html#next-js
    config.plugins.push(new WindiCSSWebpackPlugin());
    return config;
  },
});

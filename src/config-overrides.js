const { override, addWebpackPlugin } = require("customize-cra");
const webpack = require("webpack");

module.exports = override(
  // Suppress source map warnings from Firebase
  (config) => {
    config.ignoreWarnings = [
      {
        module: /firebase\/.*/,
        message: /Failed to parse source map/,
      },
    ];
    return config;
  }
);

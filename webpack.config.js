var path = require("path");

module.exports = {
  context: __dirname,
  entry: "./js/game.js",
  output: {
    path: "./js",
    filename: "bundle.js",
    devtoolModuleFilenameTemplate: '[resourcePath]',
    devtoolFallbackModuleFilenameTemplate: '[resourcePath]?[hash]'
  },
  devtool: 'source-map',
  resolve: {
    extensions: ["", ".js", ".jsx" ]
  }
};

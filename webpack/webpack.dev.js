const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const path = require('path');

module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  output: {
    filename: 'bundle.js', // Nama file tanpa hash untuk development
    publicPath: '/',
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, "../dist"),
    },
    open: true,
    port: 8080,
    hot: true,
    historyApiFallback: {
      index: 'index.html'
    },
    devMiddleware: {
      publicPath: '/',
    },
  },
});
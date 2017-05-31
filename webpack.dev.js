var path = require("path");
var webpack = require("webpack");
var OfflinePlugin = require("offline-plugin");
var HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./index.js",
  output: {
    path: __dirname,
    filename: "bundle.js",
    publicPath: "/"
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: "babel-loader",
      include: __dirname,
      query: {
        presets: ["es2015", "react", "react-hmre"],
        plugins: ["transform-object-rest-spread"]
      }
    }]
  },
  plugins: [
    new webpack.DefinePlugin({
      BASENAME: JSON.stringify("/"),
      FILESTACK_API_KEY: JSON.stringify("A20mv1w46TXymdcWvpYuQz")
    }),
    new HtmlWebpackPlugin({
      title: "Atomic App Store",
      template: "src/index.ejs"
    }),
    new OfflinePlugin()
  ],
  devServer: {
    historyApiFallback: true
  }
};

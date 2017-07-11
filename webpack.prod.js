var webpack = require("webpack");
var path = require("path");
var CopyWebpackPlugin = require("copy-webpack-plugin");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var OfflinePlugin = require("offline-plugin");

module.exports = {
  entry: "./index.js",
  output: {
    path: path.join(__dirname, "bin"),
    filename: "bundle.js",
    publicPath: ""
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: "babel-loader",
      include: __dirname,
      query: {
        presets: ["es2015", "react"],
        plugins: ["transform-object-rest-spread"]
      }
    }]
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": { NODE_ENV: JSON.stringify("production") },
      BASENAME: JSON.stringify("/"),
      FILESTACK_API_KEY: JSON.stringify("A20mv1w46TXymdcWvpYuQz")
    }),
    new webpack.optimize.UglifyJsPlugin(),
    new CopyWebpackPlugin([
      { from: "manifest.json" },
      { from: "images/launch.png" },
      { from: "images/launch-iphone.png" }
    ]),
    new HtmlWebpackPlugin({
      title: "Atomic App Store",
      template: "src/index.ejs"
    }),
    new OfflinePlugin()
  ]
};

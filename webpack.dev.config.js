const base = require("./webpack.base.config");

const { merge } = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = merge(
  base({
    DEVELOPMENT: true
  }),
  {
    name: "development",
    mode: "development",
    devtool: "cheap-source-map"
  }
);

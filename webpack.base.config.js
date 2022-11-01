const MiniCSSExtractPlugin = require("mini-css-extract-plugin");
const pages = require("./.eb/pages.js");
const fs = require("fs");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { DefinePlugin } = require("webpack");

const contentScripts = require("./config/content_scripts.json");

const popupScript = path.resolve(
  "./src/popup",
  fs.readdirSync("./src/popup/").find(function (file) {
    return /index\.[tj]sx?$/.test(file);
  })
);
const backgroundScript = path.resolve(
  "./src/background",
  fs.readdirSync("./src/background/").find(function (file) {
    return /index\.[tj]s$/.test(file);
  })
);
const contentScriptEntries = Object.fromEntries(
  Object.entries(contentScripts).map(function (entry) {
    return [entry[0], path.resolve("./src/content", entry[1])];
  })
);

module.exports = function (env) {
  return {
    name: "base",
    entry: {
      popup: popupScript,
      background: backgroundScript,
      ...contentScriptEntries,
      ...pages.entries
    },
    output: {
      asyncChunks: true,
      filename: "[name].js",
      path: path.resolve(__dirname, "dist"),
      environment: {
        arrowFunction: false
      },
      assetModuleFilename: "assets/[name].[ext]"
    },
    resolve: {
      extensions: [".js", ".ts", ".jsx", ".tsx", ".css", ".scss"]
    },
    module: {
      rules: [
        {
          test: /\.s[ca]ss$/i,
          use: [MiniCSSExtractPlugin.loader, "css-loader", "sass-loader"]
        },
        {
          test: /\.css$/i,
          use: [MiniCSSExtractPlugin.loader, "css-loader"]
        },
        {
          test: /\.(png|jpg|jpeg|svg|ttf)$/i,
          type: "asset/resource"
        },
        {
          test: /\.tsx?$/i,
          use: [
            {
              loader: "ts-loader",
              options: {
                transpileOnly: true
              }
            },
            {
              loader: "ifdef-loader",
              options: env
            }
          ],
          type: "javascript/auto"
        },
        {
          test: /\.jsx?$/i,
          use: [
            {
              loader: "babel-loader",
              options: {
                presets: ["@babel/preset-env"]
              }
            },
            {
              loader: "ifdef-loader",
              options: env
            }
          ],
          type: "javascript/auto"
        }
      ]
    },
    plugins: [
      new DefinePlugin({
        "process.browser": "true"
      }),
      ...pages.plugins,
      new HtmlWebpackPlugin({
        template: "./src/popup/index.html",
        filename: `popup.html`,
        chunks: ["popup"],
        cache: true,
        inject: false,
        meta: {
          charset: "utf-8",
          page: "popup"
        }
      }),
      new MiniCSSExtractPlugin()
    ]
  };
};

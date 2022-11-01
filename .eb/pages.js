const fs = require("fs");
const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");

const pages = fs
  .readdirSync("./src/pages")
  .map(function (file) {
    return path.resolve(__dirname, "../src", "pages", file);
  })
  .filter(function (fileOrFolder) {
    return fs.lstatSync(fileOrFolder).isDirectory();
  });

const pageEntries = pages.map(function (pagePath) {
  const items = fs.readdirSync(pagePath);
  const indexTemplate = path.resolve(pagePath, "index.html");
  const indexScript = path.resolve(
    pagePath,
    items.find(function (file) {
      return /index\.[tj]sx?$/.test(file);
    })
  );

  return {
    name: path.basename(pagePath),
    template: indexTemplate,
    script: indexScript
  };
});

const plugins = pageEntries.map(function (entry) {
  return new HTMLWebpackPlugin({
    template: entry.template,
    filename: `pages/${entry.name}.html`,
    chunks: [`pages/${entry.name}`],
    inject: false,
    meta: {
      charset: "utf-8",
      page: entry.name
    }
  });
});

const entries = Object.fromEntries(
  pageEntries.map(function (entry) {
    return [`pages/${entry.name}`, entry.script];
  })
);

module.exports = {
  plugins,
  entries
};

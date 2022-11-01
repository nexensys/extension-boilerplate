const { webpack, Compilation, Compiler } = require("webpack");

const fs = require("fs");
const { WebSocketServer } = require("ws");
const http = require("http");
const path = require("path");
const { parse } = require("url");

const contentScripts = require("../config/content_scripts.json");

const server = new http.Server(function (req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Request-Method", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
});

const pagesWss = new WebSocketServer({ noServer: true, path: "/pages" });
const scriptWss = new WebSocketServer({ noServer: true, path: "/script" });
const popupWss = new WebSocketServer({ noServer: true, path: "/popup" });

server.listen(5001);
server.addListener("upgrade", function (req, ...args) {
  const { pathname } = parse(req.url);
  if (pathname === "/pages") {
    pagesWss.handleUpgrade(req, ...args, function (socket) {
      pagesWss.emit("connection", socket, req);
    });
  } else if (pathname === "/script") {
    scriptWss.handleUpgrade(req, ...args, function (socket) {
      scriptWss.emit("connection", socket, req);
    });
  } else if (pathname === "/popup") {
    popupWss.handleUpgrade(req, ...args, function (socket) {
      popupWss.emit("connection", socket, req);
    });
  }
});

class DevPlugin {
  /**
   *
   * @param {Compiler} compiler
   */
  apply(compiler) {
    const { hooks } = compiler;
    hooks.afterEmit.tap("developmentServer", function afterEmit(comp) {
      const emitted = comp.emittedAssets;
      const emittedArr = [...emitted];
      // Reload the popup
      if (emitted.has("popup.js")) {
        emitted.delete("popup.js");
        emitted.delete("popup.js.map");
        emitted.delete("popup.html");
        popupWss.clients.forEach(function (ws) {
          ws.send("reload");
        });
        console.log(
          chalk.blue.bold("[Livereload]"),
          "Change detected in popup code. Reloading..."
        );
      }
      // Reload a content or background script
      if (
        emittedArr.find(function (file) {
          return file.replace(/.js$/, "") in contentScripts;
        }) ||
        emitted.has("background.js")
      ) {
        emittedArr
          .filter(function (file) {
            return file.replace(/.js$/, "") in contentScripts;
          })
          .forEach(function (file) {
            emitted.delete(file);
          });
        emitted.delete("background.js");
        emitted.delete("pages/reload.html");
        scriptWss.clients.forEach(function (ws) {
          ws.send("reload");
        });
        console.log(
          chalk.blue.bold("[Livereload]"),
          "Change detected in background or content script code. Reloading..."
        );
      }
      // Reload a specific page of the extension
      const filename = emittedArr.find(function (filename) {
        return /pages\/.*\.js$/.test(filename);
      });
      if (filename) {
        const page = filename.match(/pages\/([^\.\/\\]+)/);
        if (page) {
          emittedArr
            .filter(function (filename) {
              return new RegExp(`pages\\/${page}`).test(filename);
            })
            .forEach(function (filename) {
              emitted.delete(filename);
            });
          pagesWss.clients.forEach(function (ws) {
            ws.send(page[1]);
          });
          console.log(
            chalk.blue.bold("[Livereload]"),
            `Change detected in the ${page[1]} page's code. Reloading...`
          );
        }
      }
      // If none matched, it's probably an asset, so reload pages and popup
      popupWss.clients.forEach(function (ws) {
        ws.send("reload");
      });
      pagesWss.clients.forEach(function (ws) {
        ws.send("*");
      });
    });
  }
}

const config = require("../webpack.dev.config");
const { default: chalk } = require("chalk");
config.plugins.push(new DevPlugin());
const compiler = webpack(config);

compiler.watch({}, function (error) {
  if (error) console.error(error);
});

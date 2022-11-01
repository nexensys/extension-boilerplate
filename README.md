<img src=".eb/banner.png">

# Extension Boilerplate

> This documentation is not yet complete, but the code is functional.

## Installation

Clone the repo and install the required dependencies:

```sh
git clone --depth 1 --branch main https://github.com/ErrorGamer2000/extension-boilerplate.git your-project-name
cd your-project-name
npm install
```

## Development

To start the development script, simply run

```sh
npm start
```

### Extension Manifest

The extension's manifest is pre-populated with a basic configuration, although it is most likely nothing like what you will need in the project. The only thing that needs to remain the same is the `tabs` permission, which is used for the livereloading of the background service worker.

### Adding Extension Pages

To add a web page to the extension, simply make a new directory in `src/pages`, and add an index file (js, ts, jsx, or tsx) and an `index.html` file with the following:

```html
<html>
  <head>
    <%= htmlWebpackPlugin.tags.headTags %>
  </head>
  <body>
    <%= htmlWebpackPlugin.tags.bodyTags %>
    <!-- Your elements here -->
  </body>
</html>
```

### Live Reload

This boilerplate supports live reload by default. All you have to do is import the correct file from the `livereload` folder. The background and popup scripts already have these imports, as well as the settings page. To add livereload to your page, simply add

```ts
import "../../livereload/page";
```

To the top of the script.

In order to reload the extension's service worker (because of MV3), the extension comes with, and will automatically open, a `reload` page, which connects to the livereload server and will send a message to the service worker, waking it up and reloading the extension. Closing this tab will disable livereload during development.

None of the livereload code will be added to the production code, thanks to the `if-def` webpack plugin, although the `reload` page will still be emitted.

The livereload server uses localhost port `5001` by default, but this can be canged in the `config/port.json` file;

### Additional Content Scripts

By default, the boilerplate ships with the configuration for a single content script.

# License

MIT &copy; [ErrorGamer2000](https://github.com/ErrorGamer2000)

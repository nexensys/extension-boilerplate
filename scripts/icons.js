const sharp = require("sharp");
const fs = require("fs-extra");
const path = require("path");

const iconPath = fs.readdirSync("./").find(function (fileOrFolder) {
  return /icon\.(svg|png|jpg|jpeg|bmp)$/.test(fileOrFolder);
});

(async function () {
  let fileBuffer = fs.readFileSync(iconPath);

  const icon = sharp(fileBuffer);

  fs.ensureDirSync("icons");

  icon
    .resize(256, 256, {
      fit: "cover"
    })
    .toFile("icons/x256.png");

  icon
    .resize(128, 128, {
      fit: "cover"
    })
    .toFile("icons/x128.png");

  icon
    .resize(48, 48, {
      fit: "cover"
    })
    .toFile("icons/x48.png");

  icon
    .resize(32, 32, {
      fit: "cover"
    })
    .toFile("icons/x32.png");

  icon
    .resize(24, 24, {
      fit: "cover"
    })
    .toFile("icons/x24.png");

  icon
    .resize(16, 16, {
      fit: "cover"
    })
    .toFile("icons/x16.png");
})().catch();

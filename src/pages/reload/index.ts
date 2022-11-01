import log from "../../../livereload/log";
import "../../../livereload/page";

import "./style.scss";
const ws = new WebSocket("ws://localhost:5001/script");

ws.addEventListener("open", log.onOpen);
ws.addEventListener("error", log.onError);
ws.addEventListener("message", function () {
  console.log("script");
  log.onMessage();
  document.querySelector("#msg")!.textContent =
    "Restarting... (This may take a moment id the service worker is asleep)";
  chrome.runtime.sendMessage("devReloadStart");
});

/// #if DEVELOPMENT
import log from "./log";
import port from "../config/port.json";
const ws = new WebSocket(`ws://localhost:${port}/pages`);
const pagename = (
  document.head.querySelector("meta[name='page']")! as HTMLMetaElement
).content;

ws.addEventListener("open", log.onOpen);
ws.addEventListener("error", log.onError);

ws.addEventListener("message", function (message: MessageEvent<string>) {
  if (message.data === pagename || message.data === "*") {
    log.onMessage();
    window.location.reload();
  }
});
/// #endif

export {};

/// #if DEVELOPMENT
import log from "./log";
import port from "../config/port.json";
const ws = new WebSocket(`ws://localhost:${port}/popup`);

ws.addEventListener("open", log.onOpen);
ws.addEventListener("error", log.onError);

ws.addEventListener("message", function () {
  log.onMessage();
  window.location.reload();
});
/// #endif
export {};

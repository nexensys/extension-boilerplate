/// <reference types="@ext_types/chrome" />
/// #if DEVELOPMENT
import log from "./log";
chrome.runtime.onInstalled.addListener(() =>
  chrome.tabs.create(
    { url: chrome.runtime.getURL("dist/pages/reload.html") },
    (tab) => {
      log.onOpen();
      chrome.tabs.update(tab.id!, { autoDiscardable: false });
    }
  )
);
chrome.runtime.onMessage.addListener(function (m, s) {
  console.log(s);
  if (m === "devReloadStart") {
    log.onMessage();
    chrome.tabs.remove([s.tab!.id!]);
    chrome.runtime.reload();
  }
});
/// #endif
export {};

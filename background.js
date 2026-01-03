const MessageType = {
  TRIGGER_INJECTION: 'TRIGGER_INJECTION'
};

// 1. Create Context Menu on Install
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "reload-script",
    title: "Reload Local Script",
    contexts: ["all"]
  });
});

// 2. Handle Context Menu Click
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "reload-script" && tab && tab.id) {
    chrome.tabs.sendMessage(tab.id, { type: MessageType.TRIGGER_INJECTION });
  }
});
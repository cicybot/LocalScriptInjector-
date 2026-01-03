// --- Constants ---
const INJECT_URL = "http://127.0.0.1:8282/inject.js";

const MessageType = {
  FETCH_SCRIPT: 'FETCH_SCRIPT',
  SCRIPT_LOADED: 'SCRIPT_LOADED',
  ERROR: 'ERROR',
  TRIGGER_INJECTION: 'TRIGGER_INJECTION'
};

// --- Background Logic ---

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

// 3. Handle Messages from Content Script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === MessageType.FETCH_SCRIPT) {
    handleFetchScript(sendResponse);
    return true; // Keep channel open for async response
  }
});

async function handleFetchScript(sendResponse) {
  try {
    console.log(`[Background] Fetching script from ${INJECT_URL}...`);
    
    // Fetch from localhost (Background Service Worker context allows this via host_permissions)
    const response = await fetch(INJECT_URL, {
      method: 'GET',
      cache: 'no-cache' 
    });

    if (!response.ok) {
      throw new Error(`Server returned ${response.status} ${response.statusText}`);
    }

    const code = await response.text();
    console.log(`[Background] Successfully fetched ${code.length} bytes.`);

    sendResponse({
      success: true,
      code: code
    });

  } catch (error) {
    console.error('[Background] Fetch error:', error);
    sendResponse({
      success: false,
      error: error.message || 'Failed to fetch script'
    });
  }
}
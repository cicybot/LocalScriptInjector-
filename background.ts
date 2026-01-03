import { MessageType, INJECT_URL, FetchScriptResponse } from './types';

declare var chrome: any;

// The background worker runs independent of the web page. 
// It has the 'host_permissions' to fetch from localhost without CORS issues, 
// unlike the content script which is bound by the page's security context.

// 1. Create Context Menu on Install
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "reload-script",
    title: "Reload Local Script",
    contexts: ["all"]
  });
});

// 2. Handle Context Menu Click
chrome.contextMenus.onClicked.addListener((info: any, tab: any) => {
  if (info.menuItemId === "reload-script" && tab?.id) {
    // Send message to content script to trigger the reload flow
    chrome.tabs.sendMessage(tab.id, { type: MessageType.TRIGGER_INJECTION });
  }
});

// 3. Handle Messages from Content Script
chrome.runtime.onMessage.addListener((message: any, sender: any, sendResponse: any) => {
  if (message.type === MessageType.FETCH_SCRIPT) {
    handleFetchScript(sendResponse);
    return true; // Indicates we will send a response asynchronously
  }
});

async function handleFetchScript(sendResponse: (response: FetchScriptResponse) => void) {
  try {
    console.log(`[Background] Fetching script from ${INJECT_URL}...`);
    
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

  } catch (error: any) {
    console.error('[Background] Fetch error:', error);
    sendResponse({
      success: false,
      error: error.message || 'Failed to fetch script'
    });
  }
}
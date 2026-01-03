import { MessageType, FetchScriptRequest, FetchScriptResponse } from './types';

declare var chrome: any;

const LOG_PREFIX = '%c[Injector]';
const LOG_STYLE = 'color: #00ff00; font-weight: bold;';
const ERR_STYLE = 'color: #ff0000; font-weight: bold;';

// --- Injection Logic ---

const injectScript = async (isAutoLoad = false) => {
  if(!isAutoLoad) {
     console.log(`${LOG_PREFIX} Requesting hot reload...`, LOG_STYLE);
  }

  // We ask the background worker to fetch the script to bypass CORS
  const message: FetchScriptRequest = { type: MessageType.FETCH_SCRIPT };

  try {
    const response = await chrome.runtime.sendMessage(message) as FetchScriptResponse;

    if (response.success && response.code) {
      executeScriptInPage(response.code);
      if(!isAutoLoad) {
        showToast('Script Reloaded');
      }
    } else {
      throw new Error(response.error);
    }
  } catch (err: any) {
    console.error(`${LOG_PREFIX} Injection Failed:`, ERR_STYLE, err);
    if(!isAutoLoad) {
      showToast(`Error: ${err.message}`, true);
    }
  }
};

const executeScriptInPage = (code: string) => {
  // Create a script tag
  const script = document.createElement('script');
  script.textContent = `
    (function() {
      try {
        console.log('${LOG_PREFIX} Running injected code...', '${LOG_STYLE}');
        ${code}
      } catch(e) {
        console.error('${LOG_PREFIX} Runtime Error:', e);
      }
    })();
  `;
  
  // Attach to body or head
  (document.body || document.head || document.documentElement).appendChild(script);
  
  // Clean up the tag immediately
  script.remove();
};

// --- UI Feedback (Toast) ---

const showToast = (msg: string, isError = false) => {
  const toastId = 'injector-toast-display';
  const existing = document.getElementById(toastId);
  if (existing) existing.remove();

  const div = document.createElement('div');
  div.id = toastId;
  div.textContent = msg;
  div.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 10px 20px;
    background: ${isError ? '#ff4444' : '#222'};
    color: white;
    border-radius: 4px;
    z-index: 999999;
    font-family: sans-serif;
    font-size: 14px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    transition: opacity 0.3s ease;
    pointer-events: none;
  `;
  document.body.appendChild(div);

  setTimeout(() => {
    div.style.opacity = '0';
    setTimeout(() => div.remove(), 300);
  }, 2000);
};

// --- Event Listeners ---

// 1. Auto Inject on Load
window.addEventListener('load', () => {
  console.log(`${LOG_PREFIX} Page loaded. Attempting auto-injection...`, LOG_STYLE);
  injectScript(true);
});

// 2. Hot Reload Shortcut (Cmd+I or Ctrl+I)
document.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'i') {
    e.preventDefault();
    injectScript(false);
  }
});

// 3. Listen for Context Menu Trigger
chrome.runtime.onMessage.addListener((message: any, sender: any, sendResponse: any) => {
  if (message.type === MessageType.TRIGGER_INJECTION) {
    injectScript(false);
  }
});
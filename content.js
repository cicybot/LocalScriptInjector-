// --- Constants ---
const INJECT_URL = "http://127.0.0.1:8282/inject.js";
const MessageType = {
  TRIGGER_INJECTION: 'TRIGGER_INJECTION'
};

const LOG_PREFIX = '%c[Injector]';
const LOG_STYLE = 'color: #00ff00; font-weight: bold;';

// --- Injection Logic ---

const injectScript = (isAutoLoad = false) => {
  if (!isAutoLoad) {
    console.log(`${LOG_PREFIX} Requesting hot reload...`, LOG_STYLE);
  }

  const script = document.createElement('script');
  // Add timestamp to bypass browser cache
  script.src = `${INJECT_URL}?t=${Date.now()}`;
  script.type = "text/javascript";
  
  script.onload = () => {
    console.log(`${LOG_PREFIX} Script loaded successfully`, LOG_STYLE);
    if (!isAutoLoad) showToast('Script Reloaded');
    // Optional: remove tag after loading to keep DOM clean
    script.remove();
  };

  script.onerror = (e) => {
    console.error(`${LOG_PREFIX} Failed to load script.`, e);
    if (!isAutoLoad) {
      showToast('Error loading script. Check console.', true);
    }
  };

  (document.head || document.body || document.documentElement).appendChild(script);
};

// --- UI Feedback (Toast) ---

const showToast = (msg, isError = false) => {
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
    z-index: 2147483647;
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

// 1. Auto Inject on Page Load
window.addEventListener('load', () => {
  injectScript(true);
});

// 2. Hot Reload Shortcut (Cmd+I / Ctrl+I)
document.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'i') {
    e.preventDefault();
    injectScript(false);
  }
});

// 3. Listen for Context Menu Trigger
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === MessageType.TRIGGER_INJECTION) {
    injectScript(false);
  }
});
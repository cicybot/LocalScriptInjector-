// Message types for communication between Content Script and Background Worker

export const INJECT_URL = "http://127.0.0.1:8282/inject.js";

export enum MessageType {
  FETCH_SCRIPT = 'FETCH_SCRIPT',
  SCRIPT_LOADED = 'SCRIPT_LOADED',
  ERROR = 'ERROR',
  TRIGGER_INJECTION = 'TRIGGER_INJECTION'
}

export interface FetchScriptRequest {
  type: MessageType.FETCH_SCRIPT;
}

export interface FetchScriptResponse {
  success: boolean;
  code?: string;
  error?: string;
}
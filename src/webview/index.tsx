import { VSCodeWebview } from 'vscode-webview-api';
import App from '../App';

declare global {
  interface Window {
    acquireVsCodeApi: () => VSCodeWebview;
  }
}

const vscode = window.acquireVsCodeApi();

// Initialize communication with extension
window.addEventListener('message', event => {
  const message = event.data;
  switch (message.type) {
    case 'apiKey':
      // Handle API key received from extension
      break;
    case 'scan':
      // Handle scan command from extension
      break;
  }
});
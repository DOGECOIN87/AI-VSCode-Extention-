import * as vscode from 'vscode';
import { getNonce } from './utils/getNonce';

export function activate(context: vscode.ExtensionContext) {
  const provider = new DashboardViewProvider(context.extensionUri);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(DashboardViewProvider.viewType, provider)
  );

  let disposable = vscode.commands.registerCommand('aiIdeAssistant.openDashboard', () => {
    vscode.commands.executeCommand('workbench.view.extension.ai-ide-assistant-view');
  });

  context.subscriptions.push(disposable);

  disposable = vscode.commands.registerCommand('aiIdeAssistant.scanProject', () => {
    provider.scanProject();
  });

  context.subscriptions.push(disposable);
}

class DashboardViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'ai-ide-assistant-view';

  private _view?: vscode.WebviewView;

  constructor(
    private readonly _extensionUri: vscode.Uri,
  ) { }

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken,
  ) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [
        this._extensionUri
      ]
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    webviewView.webview.onDidReceiveMessage(async (data) => {
      switch (data.type) {
        case 'getApiKey': {
          const config = vscode.workspace.getConfiguration('aiIdeAssistant');
          const apiKey = config.get<string>('openAiKey');
          this._view?.webview.postMessage({ type: 'apiKey', value: apiKey });
          break;
        }
        case 'saveApiKey': {
          const config = vscode.workspace.getConfiguration('aiIdeAssistant');
          await config.update('openAiKey', data.value, true);
          break;
        }
      }
    });
  }

  public scanProject() {
    if (this._view) {
      this._view.webview.postMessage({ type: 'scan' });
    }
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'dist', 'webview.js')
    );
    const styleUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'dist', 'style.css')
    );

    const nonce = getNonce();

    return `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
        <link href="${styleUri}" rel="stylesheet">
        <title>AI IDE Assistant</title>
      </head>
      <body>
        <div id="root"></div>
        <script nonce="${nonce}" src="${scriptUri}"></script>
      </body>
      </html>`;
  }
}
import * as path from 'path'
import { ExtensionContext, workspace } from 'vscode'
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind
} from 'vscode-languageclient/node'

let client: LanguageClient

/**
 * Activates the XML Language Client extension, configures the language server
 * options, and starts the client.
 */
export function activate(context: ExtensionContext): void {
  const serverModule = path.join(
    context.extensionPath,
    '..',
    'xml-language-server',
    'dist',
    'server.js'
  )

  console.log('XML Language Server module path:', serverModule)

  const serverOptions: ServerOptions = {
    run: {
      module: serverModule,
      transport: TransportKind.ipc
    },
    debug: {
      module: serverModule,
      transport: TransportKind.ipc,
      options: {
        execArgv: ['--nolazy', '--inspect=6009']
      }
    }
  }

  const clientOptions: LanguageClientOptions = {
    documentSelector: [
      { scheme: 'file', language: 'xml' }
    ],
    synchronize: {
      fileEvents: workspace.createFileSystemWatcher('**/*.xml')
    }
  }

  client = new LanguageClient(
    'xmlLanguageServer',
    'XML Language Server',
    serverOptions,
    clientOptions
  )

  client.start()

  context.subscriptions.push(client)

  console.log('XML Language Client activated successfully')
}

/**
 * Deactivates the extension by stopping the language client if it is running.
 */
export function deactivate(): Thenable<void> | undefined {
  if (!client) {
    return undefined
  }
  return client.stop()
}

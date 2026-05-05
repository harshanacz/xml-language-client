import * as path from 'path'
import { ExtensionContext, workspace } from 'vscode'
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind
} from 'vscode-languageclient/node'

let client: LanguageClient

export async function activate(context: ExtensionContext): Promise<void> {
  const serverModule = path.join(
    context.extensionPath,
    '..',
    'xml-language-server',
    'dist',
    'server.js'
  )

  const serverOptions: ServerOptions = {
    run: {
      command: process.execPath,
      args: [serverModule, '--stdio'],
      transport: TransportKind.stdio
    },
    debug: {
      command: process.execPath,
      args: ['--nolazy', '--inspect=6009', serverModule, '--stdio'],
      transport: TransportKind.stdio
    }
  }

  const clientOptions: LanguageClientOptions = {
    documentSelector: [
      { scheme: 'file', language: 'xml' },
      { scheme: 'untitled', language: 'xml' }
    ],
    synchronize: {
      fileEvents: workspace.createFileSystemWatcher('**/*.xml'),
      configurationSection: 'xmlLanguageServer'
    }
  }

  client = new LanguageClient(
    'xmlLanguageServer',
    'XML Language Server',
    serverOptions,
    clientOptions
  )

  try {
    await client.start() 
    console.log('XML Language Client started')
  } catch (error) {
    console.error('Failed to start XML Language Client:', error)
  }

  context.subscriptions.push(client)
}

export function deactivate(): Thenable<void> | undefined {
  if (!client) {
    return undefined
  }
  return client.stop()
}
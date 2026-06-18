import * as fs from 'fs'
import * as path from 'path'
import * as vscode from 'vscode'
import { ExtensionContext, workspace } from 'vscode'
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind
} from 'vscode-languageclient/node'

let client: LanguageClient

function getSchemaFolder(version: string): string {
  const parts = version.split('.')
  const major = parseInt(parts[0])
  const minor = parseInt(parts[1])

  if (major === 4 && minor <= 3) return '430'
  return '440'  // 4.4.0 and above including 4.5, 4.6 etc
}

function readProjectVersion(projectFolder: string): string | null {
  try {
    const pomPath = path.join(projectFolder, 'pom.xml')
    if (!fs.existsSync(pomPath)) return null
    const content = fs.readFileSync(pomPath, 'utf8')
    const match = content.match(/<project\.runtime\.version>([^<]+)<\/project\.runtime\.version>/)
    return match ? match[1] : null
  } catch {
    return null
  }
}

interface SchemaConfig {
  pattern: string
  schema: string   // '430' or '440'
}

function buildSchemasFromWorkspace(): SchemaConfig[] {
  const folders = vscode.workspace.workspaceFolders
  if (!folders) return []

  const schemas: SchemaConfig[] = []

  for (const workspaceFolder of folders) {
    const workspacePath = workspaceFolder.uri.fsPath

    // Check the workspace root itself
    console.log('[client] Checking for pom.xml at:', workspacePath)
    const rootVersion = readProjectVersion(workspacePath)
    if (rootVersion) {
      const schemaFolder = getSchemaFolder(rootVersion)
      schemas.push({ pattern: '**/*.xml', schema: schemaFolder })
      console.log(
        `[client] Found project at workspace root version: ${rootVersion} → schema: ${schemaFolder}`
      )
      continue  // root IS the project — skip child directory scan
    }

    // Scan direct child directories
    let children: fs.Dirent[]
    try {
      children = fs.readdirSync(workspacePath, { withFileTypes: true })
    } catch {
      continue
    }

    for (const childDir of children.filter(d => d.isDirectory())) {
      const childPath = path.join(workspacePath, childDir.name)
      console.log('[client] Checking for pom.xml at:', childPath)
      const version = readProjectVersion(childPath)
      if (version) {
        const schemaFolder = getSchemaFolder(version)
        const pattern = childDir.name + '/**/*.xml'
        schemas.push({ pattern, schema: schemaFolder })
        console.log(
          `[client] Found project: ${childDir.name} version: ${version} → schema: ${schemaFolder}`
        )
      }
    }
  }

  return schemas
}

export async function activate(context: ExtensionContext): Promise<void> {
  const serverModule = path.join(
    context.extensionPath,
    '..',
    'wso2-mi-language-server-ts',
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

  const initialSchemas = buildSchemasFromWorkspace()
  console.log(`[client] Initial schemas found: ${initialSchemas.length}`)

  const clientOptions: LanguageClientOptions = {
    documentSelector: [
      { scheme: 'file', language: 'xml' }
    ],
    synchronize: {
      fileEvents: workspace.createFileSystemWatcher('**/*.xml')
    },
    initializationOptions: {
      schemas: initialSchemas
    }
  }

  client = new LanguageClient(
    'wso2MiLanguageServer',
    'wso2-mi-language-server',
    serverOptions,
    clientOptions
  )

  try {
    await client.start()
    console.log('XML Language Client started')
  } catch (error) {
    console.error('Failed to start XML Language Client:', error)
  }

  // watch for new XML files opening in new projects
  vscode.workspace.onDidOpenTextDocument(async (doc) => {
    if (!doc.fileName.endsWith('.xml')) return

    const updatedSchemas = buildSchemasFromWorkspace()
    await client.sendNotification(
      'workspace/didChangeConfiguration',
      {
        settings: {
          xmlLanguageServer: {
            schemas: updatedSchemas
          }
        }
      }
    )
    console.log(`[client] Sent updated schemas: ${updatedSchemas.length}`)
  })

  // watch for workspace folder changes
  vscode.workspace.onDidChangeWorkspaceFolders(async () => {
    const updatedSchemas = buildSchemasFromWorkspace()
    await client.sendNotification(
      'workspace/didChangeConfiguration',
      {
        settings: {
          xmlLanguageServer: {
            schemas: updatedSchemas
          }
        }
      }
    )
  })

  context.subscriptions.push(client)
}

export function deactivate(): Thenable<void> | undefined {
  if (!client) {
    return undefined
  }
  return client.stop()
}

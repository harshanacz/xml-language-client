<p align="center">
  <img src="images/icon.png" alt="Schema-Aware XML icon" width="128" height="128">
</p>

<h1 align="center">Schema-Aware XML</h1>

<p align="center">
  JVM-free XML language support for Visual Studio Code, with schema-aware validation and completion.
</p>

<p align="center">
  <img alt="VS Code" src="https://img.shields.io/badge/VS%20Code-%5E1.85.0-007ACC?logo=visualstudiocode&logoColor=white">
  <img alt="Version" src="https://img.shields.io/badge/version-0.1.0%20preview-ff8a3d">
  <img alt="LSP" src="https://img.shields.io/badge/protocol-LSP-4a8dff">
</p>

<p align="center">
  <a href="https://marketplace.visualstudio.com/items?itemName=harshanacz.xml-language-client">VS Code Marketplace</a> · <a href="https://open-vsx.org/extension/harshanacz/xml-language-client">Open VSX</a> (Google Antigravity, VSCodium)
</p>

---

## Overview

**Schema-Aware XML** gives VS Code the editing features you expect for XML, and it
knows about your schemas. Open a `pom.xml`, a `web.xml` or any file that points at an
XSD, and completion, hover and validation follow the schema.

> **Preview release.** This is an early `0.1.0` version. Expect rough edges and
> missing settings; please [report problems](https://github.com/harshanacz/xml-language-client/issues).

## Why this extension

- **No Java or JVM.** Most XML language servers run on Java. This one is written in
  TypeScript, so there is no runtime to install or configure.
- **Real XSD validation.** Schemas are checked by Apache Xerces-C++ compiled to
  WebAssembly and bundled inside the extension.
- **Works on half-typed XML.** The parser is fault-tolerant, so completion and the
  outline keep working while you type.
- **Lightweight.** The extension activates only when you open an XML document.

## Features

- **Syntax checking** that reports mismatched tags and undefined entities as you type.
- **Schema-aware editing** for `pom.xml`, `web.xml`, `persistence.xml` and Spring bean files, using built-in XSDs.
- **Local schemas**: a document that declares `xsi:noNamespaceSchemaLocation` or
  `xsi:schemaLocation` pointing at a local `.xsd` is validated against it.
- **Editor features**: completion, hover, outline, folding, formatting, rename, go to definition and find references.
- **Workspace aware**: watches `**/*.xml` so the server stays up to date as files change.

## Supported files

| Extension | Description           |
| --------- | --------------------- |
| `.xml`    | XML documents         |
| `.xsd`    | XML Schema documents  |
| `.xsl`    | XSL stylesheets       |

## Requirements

- Visual Studio Code `1.85.0` or newer.
- Nothing else. The language server ships inside the extension.

## Known limitations (0.1.0)

- There are no extension settings yet, so custom schema associations cannot be configured from VS Code.
- Only documents saved as files are supported; untitled editors are not.
- The extension runs in desktop VS Code. It does not run in VS Code for the Web yet.

## Roadmap

- Extension settings, including custom schema associations.
- Support for untitled documents.
- VS Code for the Web support.

## Troubleshooting

| Problem                                  | Fix                                                                         |
| ---------------------------------------- | --------------------------------------------------------------------------- |
| Extension opens but XML features are off | Confirm the file language mode (bottom right of VS Code) is set to **XML**. |
| Need server logs                         | Open the **Output** panel and pick `xml-language-server` from the dropdown. |

## Links

- [Report an issue](https://github.com/harshanacz/xml-language-client/issues)
- [Language server](https://github.com/harshanacz/xml-language-server)
- [Language service](https://github.com/harshanacz/xml-language-service)

---

## For contributors

### How it works

```text
┌──────────────┐   LSP over stdio   ┌───────────────────────┐
│   VS Code    │ ◀────────────────▶ │  XML language server  │
│  (this ext.) │                    │      (server.js)      │
└──────────────┘                    └───────────────────────┘
```

This extension is a thin client. It starts the server, keeps it in sync with your
workspace and wires it into VS Code; the editing features come from the server.

When an XML file is opened, the extension looks for the server in this order:

1. `server/server.js` bundled inside the extension (packaged builds).
2. `../xml-language-server/dist/server.js` next to this repository (development checkouts).

### Development setup

The server depends on the service by relative path, so clone all three side by side:

```bash
mkdir xml-workspace
cd xml-workspace

git clone https://github.com/harshanacz/xml-language-service.git
git clone https://github.com/harshanacz/xml-language-server.git
git clone https://github.com/harshanacz/xml-language-client.git

cd xml-language-service
npm install
npm run build

cd ../xml-language-server
npm install
npm run bundle

cd ../xml-language-client
npm install
npm run build
```

Then open `xml-language-client` in VS Code, run the **Launch Extension** debug
configuration (or press `F5`), and open an XML file in the Extension Development Host.

If the server cannot be found, make sure `server/server.js` exists, or that
`../xml-language-server/dist/server.js` is built.

### Useful scripts

| Script                | What it does                                         |
| --------------------- | ---------------------------------------------------- |
| `npm run build`       | Type-checks and compiles with `tsc`.                 |
| `npm run build:watch` | Recompiles on every change.                          |
| `npm run bundle`      | Bundles the extension into `dist/extension.js`.      |
| `npm run package`     | Creates an installable `.vsix` package.              |

## License

[MIT](LICENSE)

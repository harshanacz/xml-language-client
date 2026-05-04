# XML Language Client

VS Code language client for XML support, powered by `xml-language-server` and
`xml-language-service`.

## Documentation

Full setup instructions are available at:

https://harshanacz.github.io/xml-language-client/

The source for the documentation site lives in [`docs/`](docs/).

## Architecture

```text
VS Code extension
  -> xml-language-client
  -> xml-language-server
  -> xml-language-service
```

The client activates when VS Code opens XML-family files and starts the language
server over stdio from `../xml-language-server/dist/server.js`.

## Repository Layout

During local development, keep the three repositories as siblings:

```text
xml-language-workspace/
  xml-language-service/
  xml-language-server/
  xml-language-client/
```

## Fresh Setup

```bash
mkdir xml-language-workspace
cd xml-language-workspace

git clone https://github.com/harshanacz/xml-language-service.git
git clone https://github.com/harshanacz/xml-language-server.git
git clone https://github.com/harshanacz/xml-language-client.git
```

Build in dependency order:

```bash
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

## Development

Open `xml-language-client` in VS Code and run the `Launch Extension` debug
configuration. In the Extension Development Host window, open an `.xml`, `.xsd`,
or `.xsl` file to activate the client.

For a sample XML workspace, use:

```bash
git clone https://github.com/harshanacz/xls-test.git
code xls-test
```

## Schema Configuration

Custom XSD associations can be configured in VS Code settings:

```json
{
  "xmlLanguageServer.schemas": [
    {
      "pattern": "config.xml",
      "xsdPath": "schemas/config.xsd"
    }
  ]
}
```

Relative `xsdPath` values are resolved from the workspace root.

## Package

```bash
npm run package
```

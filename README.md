# XML Language Client

VS Code language client for XML support, powered by `wso2-mi-xml-ls`.


## Architecture

```text
VS Code extension
  -> xml-language-client
  -> wso2-mi-xml-ls
```

## Connect the Language Server


```bash
mkdir wso2-mi-xml-workspace
cd wso2-mi-xml-workspace

git clone https://github.com/harshanacz/wso2-mi-xml-ls.git
git clone https://github.com/harshanacz/xml-language-client.git

cd wso2-mi-xml-ls
npm install
npm run bundle

cd ../xml-language-client
npm install
npm run build
```

Then open `xml-language-client` in VS Code, run the `Launch Extension` debug
configuration, and open an XML file in the Extension Development Host.

## Development

Open `xml-language-client` in VS Code and run the `Launch Extension` debug
configuration. In the Extension Development Host window, open an `.xml`, `.xsd`,
or `.xsl` file to activate the client.


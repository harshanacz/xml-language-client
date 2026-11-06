# Changelog

All notable changes to **Schema-Aware XML** are documented here.

## [0.1.0] - Preview

### Added

- Syntax diagnostics for mismatched end tags and undefined entities.
- Schema-aware validation and completion for `pom.xml`, `web.xml`, `persistence.xml` and Spring bean files, using bundled XSDs.
- Validation against a local XSD named by `xsi:noNamespaceSchemaLocation` or `xsi:schemaLocation`.
- Hover, document symbols, folding (including comments), formatting that keeps line endings, rename, go to definition and references.
- MIT `LICENSE`.

### Fixed

- Syntax errors at the end of a file no longer produce invalid diagnostic positions.
- Unclosed elements are no longer treated as self-closing.
- Go to definition and rename pick the correct closing tag for nested elements with the same name.

### Known limitations

- No extension settings yet.
- Only documents saved as files are supported.

## [0.0.1]

### Added

- Initial release.
- Language client for `.xml`, `.xsd` and `.xsl` files backed by an XML language server.
- Self-contained packaging with the language server bundled under `server/`.
- Extension icon, Marketplace metadata and refreshed README.

# CID-10 Brasil MCP Server

[![npm version](https://img.shields.io/npm/v/cid10-br-mcp.svg)](https://www.npmjs.com/package/cid10-br-mcp)
[![npm downloads](https://img.shields.io/npm/dm/cid10-br-mcp.svg)](https://www.npmjs.com/package/cid10-br-mcp)
[![node](https://img.shields.io/node/v/cid10-br-mcp)](https://www.npmjs.com/package/cid10-br-mcp)
[![MCP Registry](https://img.shields.io/badge/MCP-Registry-blue)](https://registry.modelcontextprotocol.io)
[![LobeHub](https://lobehub.com/badge/mcp/sidneybissoli-cid10-br-mcp)](https://lobehub.com/mcp/sidneybissoli-cid10-br-mcp)
[![GitHub stars](https://img.shields.io/github/stars/SidneyBissoli/cid10-br-mcp?style=flat&logo=github)](https://github.com/SidneyBissoli/cid10-br-mcp)
[![GitHub Sponsors](https://img.shields.io/github/sponsors/SidneyBissoli?logo=githubsponsors&label=Sponsor&color=db61a2)](https://github.com/sponsors/SidneyBissoli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

🇧🇷 [Leia em Português](README.pt-BR.md)

**MCP Server for Brazilian ICD-10 (DATASUS) - International Classification of Diseases**

A [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) server that provides access to the Brazilian version of ICD-10 (CID-10), maintained by DATASUS/Ministry of Health of Brazil.

## See it in action

Ask your assistant, in plain Portuguese:

- *"Qual o código CID-10 para infarto agudo do miocárdio?"* → `cid10_search` / `cid10_lookup`
- *"Liste todas as subcategorias do diabetes tipo 2 (E11)."* → `cid10_hierarchy`
- *"O código C50 é válido e pode ser causa de óbito?"* → `cid10_validar`

The answers come straight from the bundled DATASUS V2008 dataset — official codes and descriptions, not guesses from training data.

## Features

- **Search** - Search codes by term (code or description)
- **Lookup** - Get detailed information for a specific CID-10 code
- **Hierarchy** - Navigate the hierarchical structure (chapters, groups, categories, subcategories)
- **Statistics** - General statistics about the CID-10 database
- **Validation** - Validate codes for use in health systems (SUS)

## Installation

### Using with Claude Desktop

Add to your Claude Desktop configuration file:

**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`  
**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "cid10-br": {
      "command": "npx",
      "args": ["cid10-br-mcp"]
    }
  }
}
```

### Global Installation

```bash
npm install -g cid10-br-mcp
```

Then add to Claude Desktop config:

```json
{
  "mcpServers": {
    "cid10-br": {
      "command": "cid10-br-mcp"
    }
  }
}
```

## Available Tools

| Tool | Description |
|------|-------------|
| `cid10_search` | Search CID-10 codes by term (code or description) |
| `cid10_lookup` | Get detailed information for a specific code |
| `cid10_hierarchy` | Get all codes under a category/prefix |
| `cid10_capitulos` | List all 22 chapters of CID-10 |
| `cid10_stats` | General statistics about the database |
| `cid10_validar` | Validate a code for use in health systems |

## Usage Examples

Once configured, you can ask Claude:

- *"What is CID-10 code A90?"*
- *"Search for diabetes codes in CID-10"*
- *"List all codes under category E11"*
- *"What are the chapters of CID-10?"*
- *"Is F32.1 a valid code for medical records?"*

## Data Source

The data comes from official DATASUS sources:
- **CID-10-CAPITULOS.CSV** - 22 chapters
- **CID-10-GRUPOS.CSV** - Groups within chapters
- **CID-10-CATEGORIAS.CSV** - 3-character categories
- **CID-10-SUBCATEGORIAS.CSV** - Detailed subcategories

Source: [DATASUS - CID-10](http://www2.datasus.gov.br/cid10/V2008/cid10.htm)

## Development

### Prerequisites

- Node.js >= 18.0.0
- npm

### Setup

```bash
# Clone the repository
git clone https://github.com/SidneyBissoli/cid10-br-mcp.git
cd cid10-br-mcp

# Install dependencies
npm install

# Build
npm run build

# Run locally
npm start
```

### Testing with MCP Inspector

```bash
npx @modelcontextprotocol/inspector node dist/index.js
```

## Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**Sidney Bissoli**
- GitHub: [@SidneyBissoli](https://github.com/SidneyBissoli)
- Email: sbissoli76@gmail.com

## Links

- [npm package](https://www.npmjs.com/package/cid10-br-mcp)
- [MCP Registry](https://registry.modelcontextprotocol.io/?search=cid10)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [DATASUS CID-10](http://www2.datasus.gov.br/cid10/V2008/cid10.htm)

---

Made for the Brazilian health community

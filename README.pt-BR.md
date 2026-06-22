# CID-10 Brasil MCP Server

[![npm version](https://img.shields.io/npm/v/cid10-br-mcp.svg)](https://www.npmjs.com/package/cid10-br-mcp)
[![npm downloads](https://img.shields.io/npm/dm/cid10-br-mcp.svg)](https://www.npmjs.com/package/cid10-br-mcp)
[![node](https://img.shields.io/node/v/cid10-br-mcp)](https://www.npmjs.com/package/cid10-br-mcp)
[![MCP Registry](https://img.shields.io/badge/MCP-Registry-blue)](https://registry.modelcontextprotocol.io)
[![LobeHub](https://lobehub.com/badge/mcp/sidneybissoli-cid10-br-mcp)](https://lobehub.com/mcp/sidneybissoli-cid10-br-mcp)
[![GitHub stars](https://img.shields.io/github/stars/SidneyBissoli/cid10-br-mcp?style=flat&logo=github)](https://github.com/SidneyBissoli/cid10-br-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

🇺🇸 [Read in English](README.md)

**Servidor MCP para a CID-10 brasileira (DATASUS) - Classificação Internacional de Doenças**

Um servidor [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) que dá acesso à versão brasileira da CID-10, mantida pelo DATASUS/Ministério da Saúde do Brasil.

## Veja na prática

Pergunte ao seu assistente, em português:

- *"Qual o código CID-10 para infarto agudo do miocárdio?"* → `cid10_search` / `cid10_lookup`
- *"Liste todas as subcategorias do diabetes tipo 2 (E11)."* → `cid10_hierarchy`
- *"O código C50 é válido e pode ser causa de óbito?"* → `cid10_validar`

As respostas vêm direto do dataset DATASUS V2008 embutido — códigos e descrições oficiais, não chutes do treino.

## Funcionalidades

- **Busca** - Pesquisa códigos por termo (código ou descrição)
- **Consulta** - Obtém informações detalhadas de um código CID-10 específico
- **Hierarquia** - Navega a estrutura hierárquica (capítulos, grupos, categorias, subcategorias)
- **Estatísticas** - Estatísticas gerais sobre a base CID-10
- **Validação** - Valida códigos para uso em sistemas de saúde (SUS)

## Instalação

### Usando com o Claude Desktop

Adicione ao arquivo de configuração do Claude Desktop:

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

### Instalação global

```bash
npm install -g cid10-br-mcp
```

Depois, adicione à configuração do Claude Desktop:

```json
{
  "mcpServers": {
    "cid10-br": {
      "command": "cid10-br-mcp"
    }
  }
}
```

## Ferramentas disponíveis

| Ferramenta | Descrição |
|------|-------------|
| `cid10_search` | Busca códigos CID-10 por termo (código ou descrição) |
| `cid10_lookup` | Obtém informações detalhadas de um código específico |
| `cid10_hierarchy` | Retorna todos os códigos sob uma categoria/prefixo |
| `cid10_capitulos` | Lista os 22 capítulos da CID-10 |
| `cid10_stats` | Estatísticas gerais sobre a base de dados |
| `cid10_validar` | Valida um código para uso em sistemas de saúde |

## Exemplos de uso

Depois de configurado, você pode pedir ao Claude:

- *"Qual é o código CID-10 A90?"*
- *"Busque códigos de diabetes na CID-10"*
- *"Liste todos os códigos sob a categoria E11"*
- *"Quais são os capítulos da CID-10?"*
- *"F32.1 é um código válido para prontuário?"*

## Fonte de dados

Os dados vêm de fontes oficiais do DATASUS:
- **CID-10-CAPITULOS.CSV** - 22 capítulos
- **CID-10-GRUPOS.CSV** - Grupos dentro dos capítulos
- **CID-10-CATEGORIAS.CSV** - Categorias de 3 caracteres
- **CID-10-SUBCATEGORIAS.CSV** - Subcategorias detalhadas

Fonte: [DATASUS - CID-10](http://www2.datasus.gov.br/cid10/V2008/cid10.htm)

## Desenvolvimento

### Pré-requisitos

- Node.js >= 18.0.0
- npm

### Configuração

```bash
# Clone o repositório
git clone https://github.com/SidneyBissoli/cid10-br-mcp.git
cd cid10-br-mcp

# Instale as dependências
npm install

# Build
npm run build

# Rode localmente
npm start
```

### Testando com o MCP Inspector

```bash
npx @modelcontextprotocol/inspector node dist/index.js
```

## Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer um fork do repositório
2. Criar um branch de feature (`git checkout -b feature/nova-feature`)
3. Commitar suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Fazer push do branch (`git push origin feature/nova-feature`)
5. Abrir um Pull Request

## Licença

Este projeto é licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## Autor

**Sidney Bissoli**
- GitHub: [@SidneyBissoli](https://github.com/SidneyBissoli)
- Email: sbissoli76@gmail.com

## Links

- [Pacote npm](https://www.npmjs.com/package/cid10-br-mcp)
- [MCP Registry](https://registry.modelcontextprotocol.io/?search=cid10)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [DATASUS CID-10](http://www2.datasus.gov.br/cid10/V2008/cid10.htm)

---

Feito para a comunidade brasileira de saúde

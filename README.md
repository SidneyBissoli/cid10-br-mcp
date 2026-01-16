# 🏥 CID-10 BR MCP Server

[![npm version](https://badge.fury.io/js/%40SidneyBissoli%2Fcid10-br-mcp.svg)](https://www.npmjs.com/package/@SidneyBissoli/cid10-br-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**MCP Server para a CID-10 Brasileira (DATASUS)**

Um servidor [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) que fornece acesso à Classificação Internacional de Doenças e Problemas Relacionados à Saúde (CID-10), versão brasileira mantida pelo DATASUS/Ministério da Saúde.

<!-- mcp-name: io.github.SidneyBissoli/cid10-br-mcp -->

---

## ✨ Funcionalidades

| Ferramenta | Descrição |
|------------|-----------|
| `cid10_search` | Busca códigos por termo (código ou descrição) |
| `cid10_lookup` | Consulta detalhes de um código específico |
| `cid10_hierarchy` | Lista todas as subcategorias de um prefixo |
| `cid10_capitulos` | Lista os 22 capítulos da CID-10 |
| `cid10_stats` | Estatísticas da base de dados |
| `cid10_validar` | Valida código para uso em sistemas de saúde |

### Dados incluídos

- **12.454+** subcategorias (códigos de 4 caracteres)
- **2.036** categorias (códigos de 3 caracteres)
- **243** grupos de categorias
- **22** capítulos

---

## 🚀 Instalação

### Via npm (recomendado)

```bash
npm install -g @SidneyBissoli/cid10-br-mcp
```

### Configuração no Claude Desktop

Adicione ao arquivo de configuração:

**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Linux**: `~/.config/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "cid10-br": {
      "command": "npx",
      "args": ["@SidneyBissoli/cid10-br-mcp"]
    }
  }
}
```

---

## 📖 Exemplos de Uso

### Buscar por termo

```
Busque códigos CID-10 relacionados a "diabetes"
```

Retorna códigos como E10 (tipo 1), E11 (tipo 2), etc.

### Consultar código específico

```
Qual a descrição do código CID-10 I10?
```

Retorna: "Hipertensão essencial (primária)"

### Ver hierarquia

```
Liste todas as subcategorias de E11 (diabetes tipo 2)
```

Retorna E11.0 a E11.9 com suas descrições.

### Validar código

```
O código J45.0 é válido para codificação de morbidade?
```

Retorna informações de validade e restrições.

---

## 🔧 Desenvolvimento

### Requisitos

- Node.js 18+
- npm ou yarn

### Instalação local

```bash
git clone https://github.com/SidneyBissoli/cid10-br-mcp.git
cd cid10-br-mcp
npm install
npm run build
```

### Testar com MCP Inspector

```bash
npx @modelcontextprotocol/inspector node dist/index.js
```

---

## 📊 Fonte dos Dados

Os dados são provenientes do **DATASUS** (Departamento de Informática do SUS):

- **URL**: http://www2.datasus.gov.br/cid10/V2008/cid10.htm
- **Versão**: 2008 (versão oficial brasileira)
- **Licença**: Dados públicos do governo brasileiro

### Campos específicos da versão brasileira

| Campo | Descrição |
|-------|-----------|
| `restricao_sexo` | M (masculino), F (feminino), ou vazio |
| `pode_causar_obito` | Se o código pode ser causa básica de óbito |
| `classificacao` | Cruz (+) ou asterisco (*) para dupla classificação |

---

## 🤝 Contribuições

Contribuições são bem-vindas! Por favor:

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

### Sugestões de melhorias

- [ ] Adicionar ICSAP (Internações por Condições Sensíveis à Atenção Primária)
- [ ] Incluir CID-O (Morfologia de Neoplasias)
- [ ] Suporte a busca fonética
- [ ] Cache de resultados frequentes

---

## 📄 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

## 🙏 Agradecimentos

- **DATASUS** - Por disponibilizar os dados da CID-10 brasileira
- **Anthropic** - Pelo protocolo MCP e ferramentas de desenvolvimento
- **Comunidade MCP** - Pela documentação e exemplos

---

## 📬 Contato

- **GitHub**: [@SidneyBissoli](https://github.com/SidneyBissoli)
- **Issues**: [Reportar problema](https://github.com/SidneyBissoli/cid10-br-mcp/issues)

---

*Desenvolvido com ❤️ para a comunidade de saúde brasileira*

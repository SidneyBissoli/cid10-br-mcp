# 🏥 Guia Completo: MCP Server CID-10 Brasileira

## Do Zero à Publicação no Registro Oficial MCP

Este guia vai te levar desde a criação até a disponibilização pública de um conector MCP para a CID-10 brasileira (DATASUS).

---

## 📋 Pré-requisitos

Antes de começar, você precisa ter instalado:

- **Node.js** (versão 18 ou superior): https://nodejs.org/
- **Git**: https://git-scm.com/
- **VS Code** (opcional, mas recomendado): https://code.visualstudio.com/

E criar contas em:

- **GitHub**: https://github.com/ (para autenticação no registro MCP)
- **npm**: https://www.npmjs.com/ (para publicar o pacote)

---

## 🚀 PASSO 1: Criar a Estrutura do Projeto

### 1.1 Criar pasta e inicializar

Abra o terminal e execute:

```bash
# Criar pasta do projeto
mkdir cid10-br-mcp
cd cid10-br-mcp

# Inicializar projeto npm
npm init -y
```

### 1.2 Instalar dependências

```bash
# Dependências de produção
npm install @modelcontextprotocol/sdk zod

# Dependências de desenvolvimento
npm install -D typescript @types/node tsx
```

### 1.3 Inicializar TypeScript

```bash
npx tsc --init
```

---

## 📥 PASSO 2: Baixar Dados da CID-10

### 2.1 Baixar do DATASUS

1. Acesse: http://www2.datasus.gov.br/cid10/V2008/download.htm
2. Clique em "arquivos em formato CSV"
3. Baixe o arquivo **CID10CSV.ZIP** (≈297 KB)
4. Extraia o conteúdo

### 2.2 Organizar os arquivos

Crie uma pasta `data/` no projeto e copie os arquivos CSV:

```
cid10-br-mcp/
├── data/
│   ├── CID-10-CAPITULOS.CSV
│   ├── CID-10-GRUPOS.CSV
│   ├── CID-10-CATEGORIAS.CSV
│   └── CID-10-SUBCATEGORIAS.CSV
```

### 2.3 Converter encoding (importante!)

Os arquivos do DATASUS usam encoding Windows-1252. Para converter para UTF-8:

**No Linux/Mac:**
```bash
cd data
for f in *.CSV; do
  iconv -f WINDOWS-1252 -t UTF-8 "$f" > "${f%.CSV}_utf8.csv"
  mv "${f%.CSV}_utf8.csv" "$f"
done
cd ..
```

**No Windows (PowerShell):**
```powershell
cd data
Get-ChildItem *.CSV | ForEach-Object {
  $content = Get-Content $_.FullName -Encoding Default
  $content | Out-File $_.FullName -Encoding UTF8
}
cd ..
```

---

## 💻 PASSO 3: Criar os Arquivos do Projeto

### 3.1 Estrutura final do projeto

```
cid10-br-mcp/
├── data/
│   ├── CID-10-CAPITULOS.CSV
│   ├── CID-10-GRUPOS.CSV
│   ├── CID-10-CATEGORIAS.CSV
│   └── CID-10-SUBCATEGORIAS.CSV
├── src/
│   ├── index.ts          # Servidor MCP principal
│   ├── data-loader.ts    # Carregador de dados CSV
│   └── types.ts          # Tipos TypeScript
├── package.json
├── tsconfig.json
├── server.json           # Metadados para o registro MCP
├── README.md
└── LICENSE
```

Os arquivos de código estão nesta mesma pasta. Copie-os para seu projeto.

---

## 🔧 PASSO 4: Configurar o Projeto

### 4.1 Editar package.json

Substitua o conteúdo do `package.json` pelo arquivo fornecido nesta pasta.

**Importante**: Substitua `SEU_USUARIO_GITHUB` pelo seu usuário real do GitHub.

### 4.2 Editar tsconfig.json

Substitua pelo arquivo `tsconfig.json` fornecido.

---

## 🧪 PASSO 5: Testar Localmente

### 5.1 Compilar o projeto

```bash
npm run build
```

### 5.2 Testar com MCP Inspector

```bash
npx @modelcontextprotocol/inspector node dist/index.js
```

Isso abrirá uma interface no navegador onde você pode testar as ferramentas.

### 5.3 Testar no Claude Desktop (opcional)

Adicione ao arquivo de configuração do Claude Desktop:

**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
**Mac**: `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "cid10-br": {
      "command": "node",
      "args": ["C:/caminho/para/cid10-br-mcp/dist/index.js"]
    }
  }
}
```

---

## 📦 PASSO 6: Publicar no npm

### 6.1 Fazer login no npm

```bash
npm login
```

Siga as instruções para autenticar.

### 6.2 Publicar o pacote

```bash
npm publish --access public
```

### 6.3 Verificar publicação

Acesse: `https://www.npmjs.com/package/@SEU_USUARIO/cid10-br-mcp`

---

## 🌐 PASSO 7: Publicar no Registro MCP Oficial

### 7.1 Instalar o CLI do MCP Publisher

```bash
# Baixar o binário
npx @anthropic-ai/mcp-publisher --version

# Ou clonar e compilar
git clone https://github.com/modelcontextprotocol/registry
cd registry
make publisher
```

### 7.2 Editar server.json

O arquivo `server.json` já está criado. Edite:

- Substitua `SEU_USUARIO_GITHUB` pelo seu usuário
- Atualize a descrição se desejar

### 7.3 Autenticar no registro

```bash
npx @anthropic-ai/mcp-publisher login github
```

Isso abrirá o navegador para autenticação OAuth com GitHub.

### 7.4 Validar antes de publicar

```bash
npx @anthropic-ai/mcp-publisher publish --dry-run
```

### 7.5 Publicar no registro

```bash
npx @anthropic-ai/mcp-publisher publish
```

---

## ✅ PASSO 8: Verificar Publicação

### 8.1 No registro oficial

Acesse: https://registry.modelcontextprotocol.io/

Busque por "cid10" ou seu nome de usuário.

### 8.2 Testar instalação

Outros usuários poderão instalar com:

```bash
npm install -g @SEU_USUARIO/cid10-br-mcp
```

---

## 🔄 Atualizações Futuras

Para publicar atualizações:

1. Atualize o código
2. Incremente a versão em `package.json` e `server.json`
3. Recompile: `npm run build`
4. Publique no npm: `npm publish`
5. Publique no registro: `npx @anthropic-ai/mcp-publisher publish`

---

## 📚 Recursos Adicionais

- **MCP Documentation**: https://modelcontextprotocol.io/
- **MCP Registry**: https://registry.modelcontextprotocol.io/
- **TypeScript SDK**: https://github.com/modelcontextprotocol/typescript-sdk
- **DATASUS CID-10**: http://www2.datasus.gov.br/cid10/V2008/cid10.htm

---

## 🤝 Contribuições

Após publicar, considere:

- Adicionar mais ferramentas (ICSAP, CID-O, etc.)
- Aceitar contribuições via GitHub
- Manter a documentação atualizada

---

**Parabéns!** 🎉 Seu conector CID-10 agora está disponível para todos os usuários do Claude e outros clientes MCP!

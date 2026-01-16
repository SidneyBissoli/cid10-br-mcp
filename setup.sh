#!/bin/bash
# Script de setup para CID-10 BR MCP Server
# Baixa e converte os dados do DATASUS

set -e

echo "🏥 CID-10 BR MCP Server - Setup"
echo "================================"
echo ""

# Criar pasta data se não existir
mkdir -p data
cd data

# Verificar se os arquivos já existem
if [ -f "CID-10-SUBCATEGORIAS.CSV" ]; then
    echo "✅ Arquivos CSV já existem em data/"
    echo "   Para re-baixar, delete a pasta data/ e execute novamente."
    exit 0
fi

echo "📥 Baixando dados da CID-10 do DATASUS..."

# Baixar arquivo ZIP
curl -L -o CID10CSV.ZIP "http://www2.datasus.gov.br/cid10/V2008/cid10csv.zip" 2>/dev/null || \
wget -O CID10CSV.ZIP "http://www2.datasus.gov.br/cid10/V2008/cid10csv.zip" 2>/dev/null || \
{
    echo "❌ Erro ao baixar. Por favor, baixe manualmente de:"
    echo "   http://www2.datasus.gov.br/cid10/V2008/download.htm"
    exit 1
}

echo "📦 Extraindo arquivos..."
unzip -o CID10CSV.ZIP

echo "🔄 Convertendo encoding para UTF-8..."
for f in *.CSV; do
    if [ -f "$f" ]; then
        iconv -f WINDOWS-1252 -t UTF-8 "$f" > temp.csv 2>/dev/null && mv temp.csv "$f" || \
        echo "   ⚠️  Não foi possível converter $f (pode já estar em UTF-8)"
    fi
done

# Limpar arquivo ZIP
rm -f CID10CSV.ZIP

cd ..

echo ""
echo "✅ Setup concluído!"
echo ""
echo "Arquivos disponíveis em data/:"
ls -la data/*.CSV 2>/dev/null || echo "   (nenhum arquivo CSV encontrado)"
echo ""
echo "Próximos passos:"
echo "  1. npm install"
echo "  2. npm run build"
echo "  3. npm run start"

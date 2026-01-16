# Script de setup para CID-10 BR MCP Server (Windows)
# Baixa e converte os dados do DATASUS

Write-Host "🏥 CID-10 BR MCP Server - Setup" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Criar pasta data se não existir
if (-not (Test-Path "data")) {
    New-Item -ItemType Directory -Path "data" | Out-Null
}

Set-Location "data"

# Verificar se os arquivos já existem
if (Test-Path "CID-10-SUBCATEGORIAS.CSV") {
    Write-Host "✅ Arquivos CSV já existem em data/" -ForegroundColor Green
    Write-Host "   Para re-baixar, delete a pasta data/ e execute novamente."
    Set-Location ".."
    exit 0
}

Write-Host "📥 Baixando dados da CID-10 do DATASUS..." -ForegroundColor Yellow

try {
    # Baixar arquivo ZIP
    $url = "http://www2.datasus.gov.br/cid10/V2008/cid10csv.zip"
    $output = "CID10CSV.ZIP"
    
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    Invoke-WebRequest -Uri $url -OutFile $output -UseBasicParsing
    
    Write-Host "📦 Extraindo arquivos..." -ForegroundColor Yellow
    Expand-Archive -Path $output -DestinationPath "." -Force
    
    Write-Host "🔄 Convertendo encoding para UTF-8..." -ForegroundColor Yellow
    Get-ChildItem -Filter "*.CSV" | ForEach-Object {
        $content = Get-Content $_.FullName -Encoding Default -Raw
        [System.IO.File]::WriteAllText($_.FullName, $content, [System.Text.Encoding]::UTF8)
        Write-Host "   Convertido: $($_.Name)" -ForegroundColor Gray
    }
    
    # Limpar arquivo ZIP
    Remove-Item $output -Force
    
} catch {
    Write-Host "❌ Erro ao baixar. Por favor, baixe manualmente de:" -ForegroundColor Red
    Write-Host "   http://www2.datasus.gov.br/cid10/V2008/download.htm" -ForegroundColor Yellow
    Set-Location ".."
    exit 1
}

Set-Location ".."

Write-Host ""
Write-Host "✅ Setup concluído!" -ForegroundColor Green
Write-Host ""
Write-Host "Arquivos disponíveis em data/:" -ForegroundColor Cyan
Get-ChildItem -Path "data" -Filter "*.CSV" | ForEach-Object { Write-Host "   $($_.Name)" }
Write-Host ""
Write-Host "Próximos passos:" -ForegroundColor Cyan
Write-Host "  1. npm install"
Write-Host "  2. npm run build"
Write-Host "  3. npm run start"

# 📥 Dados da CID-10 Brasileira

Esta pasta deve conter os arquivos CSV da CID-10 brasileira do DATASUS.

## Como obter os dados

1. Acesse: http://www2.datasus.gov.br/cid10/V2008/download.htm
2. Clique em "arquivos em formato CSV"
3. Baixe o arquivo **CID10CSV.ZIP**
4. Extraia os arquivos nesta pasta

## Arquivos necessários

Após extrair, você deve ter:

- `CID-10-CAPITULOS.CSV` - Capítulos da CID-10
- `CID-10-GRUPOS.CSV` - Grupos de categorias
- `CID-10-CATEGORIAS.CSV` - Categorias (3 caracteres)
- `CID-10-SUBCATEGORIAS.CSV` - Subcategorias (4 caracteres) **[PRINCIPAL]**

## Conversão de Encoding

Os arquivos do DATASUS usam encoding Windows-1252. Converta para UTF-8:

### Linux/Mac:
```bash
for f in *.CSV; do
  iconv -f WINDOWS-1252 -t UTF-8 "$f" > temp.csv
  mv temp.csv "$f"
done
```

### Windows (PowerShell):
```powershell
Get-ChildItem *.CSV | ForEach-Object {
  $content = Get-Content $_.FullName -Encoding Default
  $content | Out-File $_.FullName -Encoding UTF8
}
```

## Estrutura do CSV

Os arquivos usam:
- **Delimitador**: ponto-e-vírgula (;)
- **Encoding original**: Windows-1252 (converter para UTF-8)

### CID-10-SUBCATEGORIAS.CSV (principal)

| Coluna | Descrição |
|--------|-----------|
| SUBCAT | Código sem ponto (ex: E112) |
| CLASSIF | Classificação cruz/asterisco |
| RESTRSEXO | M, F ou vazio |
| CAUSAOBITO | N se não pode causar óbito |
| DESCRICAO | Descrição completa |
| DESCRABREV | Descrição abreviada |
| REFER | Referências |
| EXCLUIDOS | Códigos excluídos |

---

**Fonte**: DATASUS/Ministério da Saúde - Brasil
**Versão**: 2008

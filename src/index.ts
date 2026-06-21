#!/usr/bin/env node
/**
 * MCP Server para CID-10 Brasileira (DATASUS)
 * 
 * Fornece acesso à Classificação Internacional de Doenças
 * versão brasileira mantida pelo DATASUS/Ministério da Saúde.
 * 
 * @author SEU_NOME
 * @license MIT
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import {
  loadCID10Data,
  searchSubcategorias,
  lookupSubcategoria,
  getHierarchy,
  findCapitulo,
  findGrupo
} from './data-loader.js';
import type { CID10Data } from './types.js';

// Carregar dados na inicialização
let cid10Data: CID10Data;

try {
  cid10Data = loadCID10Data();
} catch (error) {
  console.error('Erro ao carregar dados da CID-10:', error);
  process.exit(1);
}

// Criar servidor MCP
const server = new McpServer({
  name: 'cid10-br-mcp',
  version: '1.0.3'
});

// ============================================================
// FERRAMENTA: cid10_search
// ============================================================
server.tool(
  'cid10_search',
  'Busca códigos CID-10 por termo (código ou descrição). Pesquisa na tabela brasileira da CID-10 (DATASUS). Aceita códigos parciais ou termos de busca na descrição. Exemplos: "diabetes", "E11", "hipertensão", "infarto".',
  {
    query: z.string()
      .min(1)
      .describe('Termo de busca: código CID-10 (ex: E11, I10) ou palavra-chave na descrição (ex: diabetes, asma)'),
    limit: z.number()
      .min(1)
      .max(100)
      .default(20)
      .describe('Número máximo de resultados (1-100, padrão: 20)'),
    offset: z.number()
      .min(0)
      .default(0)
      .describe('Deslocamento para paginação (padrão: 0)')
  },
  async ({ query, limit, offset }) => {
    const results = searchSubcategorias(cid10Data, query, limit, offset);

    if (results.length === 0) {
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            encontrados: 0,
            mensagem: `Nenhum código CID-10 encontrado para "${query}". Tente termos mais genéricos ou verifique a grafia.`
          }, null, 2)
        }]
      };
    }

    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          encontrados: results.length,
          offset,
          resultados: results.map(r => ({
            codigo: r.codigo,
            descricao: r.descricao,
            restricao_sexo: r.restricaosexo || null,
            pode_causar_obito: r.causaobito,
            classificacao: r.classif || null
          }))
        }, null, 2)
      }]
    };
  }
);

// ============================================================
// FERRAMENTA: cid10_lookup
// ============================================================
server.tool(
  'cid10_lookup',
  'Consulta detalhes de um código CID-10 específico. Retorna informações completas incluindo descrição, restrições de sexo, se pode ser causa de óbito, e classificação cruz/asterisco.',
  {
    codigo: z.string()
      .min(3)
      .max(6)
      .describe('Código CID-10 com ou sem ponto. Exemplos: "E11.2", "E112", "I10", "J45.0"')
  },
  async ({ codigo }) => {
    const result = lookupSubcategoria(cid10Data, codigo);

    if (!result) {
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            erro: `Código "${codigo}" não encontrado na CID-10 brasileira. Verifique se o código está correto.`
          }, null, 2)
        }]
      };
    }

    // Buscar contexto hierárquico
    const capitulo = findCapitulo(cid10Data, result.subcat);
    const grupo = findGrupo(cid10Data, result.subcat);

    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          codigo: result.codigo,
          descricao: result.descricao,
          descricao_abreviada: result.descrabrev,
          capitulo: capitulo ? {
            numero: capitulo.numero,
            descricao: capitulo.descricao
          } : null,
          grupo: grupo ? {
            intervalo: `${grupo.catinic}-${grupo.catfim}`,
            descricao: grupo.descricao
          } : null,
          restricao_sexo: result.restricaosexo || null,
          pode_causar_obito: result.causaobito,
          classificacao_cruz_asterisco: result.classif || null,
          referencias: result.referencia || null,
          excluidos: result.excluidos || null
        }, null, 2)
      }]
    };
  }
);

// ============================================================
// FERRAMENTA: cid10_hierarchy
// ============================================================
server.tool(
  'cid10_hierarchy',
  'Retorna todos os códigos CID-10 sob uma categoria/prefixo. Útil para obter todas as subcategorias de uma condição. Exemplo: prefixo "E11" retorna todos os tipos de diabetes mellitus tipo 2.',
  {
    prefixo: z.string()
      .min(1)
      .max(4)
      .describe('Prefixo do código CID-10. Exemplos: "E11" (diabetes tipo 2), "I10" (hipertensão), "J45" (asma)')
  },
  async ({ prefixo }) => {
    const results = getHierarchy(cid10Data, prefixo);
    const capitulo = findCapitulo(cid10Data, prefixo);
    const grupo = findGrupo(cid10Data, prefixo);

    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          prefixo: prefixo.toUpperCase(),
          capitulo: capitulo?.descricao || null,
          grupo: grupo?.descricao || null,
          total_subcategorias: results.length,
          subcategorias: results.map(r => ({
            codigo: r.codigo,
            descricao: r.descricao,
            pode_causar_obito: r.causaobito
          }))
        }, null, 2)
      }]
    };
  }
);

// ============================================================
// FERRAMENTA: cid10_capitulos
// ============================================================
server.tool(
  'cid10_capitulos',
  'Lista todos os 22 capítulos da CID-10 brasileira. Útil para navegação e entendimento da estrutura hierárquica da classificação.',
  {},
  async () => {
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          total: cid10Data.capitulos.length,
          capitulos: cid10Data.capitulos.map(c => ({
            numero: c.numero,
            intervalo: `${c.catinic}-${c.catfim}`,
            descricao: c.descricao
          }))
        }, null, 2)
      }]
    };
  }
);

// ============================================================
// FERRAMENTA: cid10_stats
// ============================================================
server.tool(
  'cid10_stats',
  'Retorna estatísticas gerais da base de dados CID-10 brasileira carregada.',
  {},
  async () => {
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          versao: '2008',
          fonte: 'DATASUS/Ministério da Saúde - Brasil',
          url_fonte: 'http://www2.datasus.gov.br/cid10/V2008/cid10.htm',
          estatisticas: {
            total_capitulos: cid10Data.capitulos.length,
            total_grupos: cid10Data.grupos.length,
            total_categorias: cid10Data.categorias.length,
            total_subcategorias: cid10Data.subcategorias.length
          },
          observacoes: [
            'Versão brasileira da CID-10 adaptada pelo DATASUS',
            'Inclui campos específicos: restrição por sexo, causa de óbito',
            'Classificação cruz/asterisco para dupla codificação'
          ]
        }, null, 2)
      }]
    };
  }
);

// ============================================================
// FERRAMENTA: cid10_validar
// ============================================================
server.tool(
  'cid10_validar',
  'Valida se um código CID-10 existe e retorna informações sobre sua validade para uso em sistemas de saúde (AIH, APAC, SIM, etc.).',
  {
    codigo: z.string()
      .min(3)
      .max(6)
      .describe('Código CID-10 a ser validado')
  },
  async ({ codigo }) => {
    const result = lookupSubcategoria(cid10Data, codigo);
    const codigoNormalizado = codigo.toUpperCase().replace(/\./g, '');

    if (!result) {
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            codigo_informado: codigo,
            valido: false,
            motivo: 'Código não encontrado na tabela CID-10 brasileira'
          }, null, 2)
        }]
      };
    }

    // Verificar se é categoria sem subcategoria válida
    const isCategoriaSemSubcat = codigoNormalizado.length === 3;

    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          codigo_informado: codigo,
          codigo_normalizado: result.codigo,
          valido: true,
          tipo: isCategoriaSemSubcat ? 'categoria' : 'subcategoria',
          uso_permitido: {
            codificacao_morbidade: result.classif !== '*',
            codificacao_mortalidade: result.causaobito && result.classif !== '*',
            restricao_sexo: result.restricaosexo || 'nenhuma'
          },
          descricao: result.descricao
        }, null, 2)
      }]
    };
  }
);

// ============================================================
// INICIAR SERVIDOR
// ============================================================
async function main() {
  console.error('Iniciando MCP Server CID-10 Brasileira...');

  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error('Servidor MCP CID-10 iniciado com sucesso!');
  console.error(`Ferramentas disponíveis: cid10_search, cid10_lookup, cid10_hierarchy, cid10_capitulos, cid10_stats, cid10_validar`);
}

main().catch((error) => {
  console.error('Erro fatal:', error);
  process.exit(1);
});

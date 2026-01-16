/**
 * Carregador de dados CSV da CID-10 Brasileira (DATASUS)
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import type { CID10Data, Capitulo, Grupo, Categoria, Subcategoria } from './types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Caminho para a pasta de dados
const DATA_PATH = join(__dirname, '..', 'data');

/**
 * Parseia uma linha CSV considerando o delimitador ;
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (const char of line) {
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ';' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());

  return result;
}

/**
 * Lê um arquivo CSV e retorna array de objetos
 */
function readCSV<T>(filename: string, mapper: (fields: string[], headers: string[]) => T): T[] {
  const filepath = join(DATA_PATH, filename);
  const content = readFileSync(filepath, 'utf-8');
  const lines = content.split('\n').filter(line => line.trim());

  if (lines.length === 0) return [];

  const headers = parseCSVLine(lines[0]).map(h => h.toLowerCase());
  const results: T[] = [];

  for (let i = 1; i < lines.length; i++) {
    const fields = parseCSVLine(lines[i]);
    if (fields.length >= headers.length - 1) {
      try {
        results.push(mapper(fields, headers));
      } catch (e) {
        // Ignora linhas com erro de parsing
        console.error(`Erro na linha ${i}: ${e}`);
      }
    }
  }

  return results;
}

/**
 * Formata código CID-10 com ponto (A000 -> A00.0)
 */
function formatarCodigo(codigo: string): string {
  if (codigo.length === 4) {
    return `${codigo.slice(0, 3)}.${codigo.slice(3)}`;
  }
  return codigo;
}

/**
 * Carrega todos os dados da CID-10
 */
export function loadCID10Data(): CID10Data {
  console.error('Carregando dados da CID-10 brasileira...');

  // Carregar capítulos
  const capitulos = readCSV<Capitulo>('CID-10-CAPITULOS.CSV', (fields, headers) => ({
    numero: fields[headers.indexOf('numcap')] || fields[0] || '',
    catinic: fields[headers.indexOf('catinic')] || fields[1] || '',
    catfim: fields[headers.indexOf('catfim')] || fields[2] || '',
    descricao: fields[headers.indexOf('descricao')] || fields[3] || '',
    descrabrev: fields[headers.indexOf('descrabrev')] || fields[4] || ''
  }));

  // Carregar grupos
  const grupos = readCSV<Grupo>('CID-10-GRUPOS.CSV', (fields, headers) => ({
    catinic: fields[headers.indexOf('catinic')] || fields[0] || '',
    catfim: fields[headers.indexOf('catfim')] || fields[1] || '',
    descricao: fields[headers.indexOf('descricao')] || fields[2] || '',
    descrabrev: fields[headers.indexOf('descrabrev')] || fields[3] || ''
  }));

  // Carregar categorias
  const categorias = readCSV<Categoria>('CID-10-CATEGORIAS.CSV', (fields, headers) => ({
    cat: fields[headers.indexOf('cat')] || fields[0] || '',
    classif: fields[headers.indexOf('classif')] || fields[1] || '',
    restricaosexo: fields[headers.indexOf('restrsexo')] || fields[2] || '',
    causaobito: fields[headers.indexOf('causaobito')] || fields[3] || '',
    descricao: fields[headers.indexOf('descricao')] || fields[4] || '',
    descrabrev: fields[headers.indexOf('descrabrev')] || fields[5] || '',
    referencia: fields[headers.indexOf('refer')] || fields[6] || '',
    excluidos: fields[headers.indexOf('excluidos')] || fields[7] || ''
  }));

  // Carregar subcategorias (principal)
  const subcategorias = readCSV<Subcategoria>('CID-10-SUBCATEGORIAS.CSV', (fields, headers) => {
    const subcat = fields[headers.indexOf('subcat')] || fields[0] || '';
    return {
      subcat,
      codigo: formatarCodigo(subcat),
      classif: fields[headers.indexOf('classif')] || fields[1] || '',
      restricaosexo: fields[headers.indexOf('restrsexo')] || fields[2] || '',
      causaobito: (fields[headers.indexOf('causaobito')] || fields[3] || '') !== 'N',
      descricao: fields[headers.indexOf('descricao')] || fields[4] || '',
      descrabrev: fields[headers.indexOf('descrabrev')] || fields[5] || '',
      referencia: fields[headers.indexOf('refer')] || fields[6] || '',
      excluidos: fields[headers.indexOf('excluidos')] || fields[7] || ''
    };
  });

  console.error(`Carregados: ${capitulos.length} capítulos, ${grupos.length} grupos, ${categorias.length} categorias, ${subcategorias.length} subcategorias`);

  return {
    capitulos,
    grupos,
    categorias,
    subcategorias
  };
}

/**
 * Busca subcategorias por termo (código ou descrição)
 */
export function searchSubcategorias(
  data: CID10Data,
  query: string,
  limit: number = 20,
  offset: number = 0
): Subcategoria[] {
  const queryUpper = query.toUpperCase().replace(/\./g, '');
  const queryLower = query.toLowerCase();

  const results = data.subcategorias.filter(item => {
    // Busca por código
    if (item.subcat.includes(queryUpper)) return true;
    // Busca por descrição
    if (item.descricao.toLowerCase().includes(queryLower)) return true;
    if (item.descrabrev.toLowerCase().includes(queryLower)) return true;
    return false;
  });

  return results.slice(offset, offset + limit);
}

/**
 * Busca uma subcategoria específica por código
 */
export function lookupSubcategoria(
  data: CID10Data,
  codigo: string
): Subcategoria | undefined {
  const codigoNormalizado = codigo.toUpperCase().replace(/\./g, '');
  return data.subcategorias.find(item => item.subcat === codigoNormalizado);
}

/**
 * Retorna todas as subcategorias de um prefixo
 */
export function getHierarchy(
  data: CID10Data,
  prefixo: string
): Subcategoria[] {
  const prefixoNormalizado = prefixo.toUpperCase().replace(/\./g, '');
  return data.subcategorias.filter(item =>
    item.subcat.startsWith(prefixoNormalizado)
  );
}

/**
 * Busca capítulo por código de categoria
 */
export function findCapitulo(
  data: CID10Data,
  codigo: string
): Capitulo | undefined {
  const cat = codigo.toUpperCase().slice(0, 3);
  return data.capitulos.find(cap => {
    return cat >= cap.catinic && cat <= cap.catfim;
  });
}

/**
 * Busca grupo por código de categoria
 */
export function findGrupo(
  data: CID10Data,
  codigo: string
): Grupo | undefined {
  const cat = codigo.toUpperCase().slice(0, 3);
  return data.grupos.find(grupo => {
    return cat >= grupo.catinic && cat <= grupo.catfim;
  });
}

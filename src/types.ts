/**
 * Tipos para o MCP Server CID-10 Brasileira
 */

/** Capítulo da CID-10 */
export interface Capitulo {
  numero: string;
  catinic: string;
  catfim: string;
  descricao: string;
  descrabrev: string;
}

/** Grupo de categorias da CID-10 */
export interface Grupo {
  catinic: string;
  catfim: string;
  descricao: string;
  descrabrev: string;
}

/** Categoria da CID-10 (3 caracteres) */
export interface Categoria {
  cat: string;
  classif: string;
  restricaosexo: string;
  causaobito: string;
  descricao: string;
  descrabrev: string;
  referencia: string;
  excluidos: string;
}

/** Subcategoria da CID-10 (4 caracteres) */
export interface Subcategoria {
  /** Código sem ponto (ex: E112) */
  subcat: string;
  /** Código formatado com ponto (ex: E11.2) */
  codigo: string;
  /** Classificação cruz/asterisco */
  classif: string;
  /** Restrição por sexo (M/F/vazio) */
  restricaosexo: string;
  /** Se pode causar óbito */
  causaobito: boolean;
  /** Descrição completa */
  descricao: string;
  /** Descrição abreviada */
  descrabrev: string;
  /** Referência a outras categorias */
  referencia: string;
  /** Códigos excluídos */
  excluidos: string;
}

/** Dados completos da CID-10 carregados em memória */
export interface CID10Data {
  capitulos: Capitulo[];
  grupos: Grupo[];
  categorias: Categoria[];
  subcategorias: Subcategoria[];
}

/** Resultado de busca */
export interface SearchResult {
  encontrados: number;
  resultados: Subcategoria[];
  pagina?: number;
  total_paginas?: number;
}

/** Resultado de hierarquia */
export interface HierarchyResult {
  prefixo: string;
  capitulo?: Capitulo;
  grupo?: Grupo;
  categoria?: Categoria;
  subcategorias: Subcategoria[];
  total: number;
}

/** Estatísticas da base */
export interface StatsResult {
  total_capitulos: number;
  total_grupos: number;
  total_categorias: number;
  total_subcategorias: number;
  versao: string;
  fonte: string;
}

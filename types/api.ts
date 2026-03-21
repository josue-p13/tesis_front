// Tipos para /documents/extraer
export interface ReferenciaCruda {
  raw: string;
  titulo: string;
  autores: string;
  año: string;
  publicacion: string;
  doi: string;
  url: string;
  volumen: string;
  paginas: string;
}

export interface EstiloCitacion {
  nombre: string;
  descripcion: string;
}

export interface ExtraerResponse {
  total_referencias: number;
  estilo_citacion: EstiloCitacion;
  referencias: ReferenciaCruda[];
  serper_api_key: string;
  usar_serper: boolean;
}

// Tipos para /documents/validar
export interface ValidacionDetalle {
  encontrado: boolean;
  fuente?: string;
  titulo_verificado?: string;
  doi_encontrado?: string;
  citaciones?: number;
  url?: string;
  autores_verificados?: string;
  desde_bd?: boolean;
  es_link_busqueda?: boolean;
}

export interface ReferenciaValidada {
  indice: number;
  titulo_original: string;
  autores: string;
  año: string;
  doi_original: string;
  estado: string;
  doi_sugerido?: string;
  validacion: ValidacionDetalle;
}

export interface EstadisticasBD {
  servidas_desde_bd: number;
  nuevas_guardadas_en_bd: number;
}

export interface EstadisticasGoogleScholar {
  encontradas_por_serper: number;
  serper_habilitado: boolean;
}

export interface SerperError {
  ocurrio: boolean;
  codigo: number;
  mensaje: string;
}

export interface ValidarResponse {
  total: number;
  encontradas: number;
  no_encontradas: number;
  con_doi_original: number;
  sin_doi_original: number;
  porcentaje_verificadas: number;
  estadisticas_bd: EstadisticasBD;
  estadisticas_google_scholar: EstadisticasGoogleScholar;
  referencias: ReferenciaValidada[];
  serper_error?: SerperError;
}

export type EstadoReferencia =
  | "VERIFICADA"
  | "VERIFICADA (BD)"
  | "VERIFICADA (BD por score)"
  | "ENCONTRADA_POR_TITULO"
  | "ENCONTRADA_POR_TITULO (DOI fallido)"
  | "ENCONTRADA_GOOGLE_SCHOLAR"
  | "DOI_NO_ENCONTRADO"
  | "REFERENCIA_WEB"
  | "URL_NO_ACCESIBLE"
  | "NO_ENCONTRADA"
  | "SIN_DATOS_PARA_BUSCAR";

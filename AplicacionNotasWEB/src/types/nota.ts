export interface Nota {
  id: number;
  usuarioId: number;
  titulo: string;
  contenido?: string;
  favorito: boolean;
  archivado: boolean;
  etiquetas?: string[];
  fechaCreacion: string;
  fechaActualizacion: string;
  carpetaId?: number;
  nombreCarpeta?: string;
  colorCarpeta?: string;
}

export interface CrearNotaPayload {
  titulo: string;
  contenido?: string;
  carpetaId?: number;
  favorito?: boolean;
  etiquetas?: string[];
}

export interface ActualizarNotaPayload {
  titulo: string;
  contenido?: string;
  carpetaId?: number;
  favorito?: boolean;
  etiquetas?: string[];
}

export interface BuscarNotasPayload {
  termino?: string;
  carpetaId?: number;
  favorito?: boolean;
  archivado?: boolean;
  etiquetas?: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
} 
export interface Carpeta {
  id: number;
  usuarioId: number;
  nombre: string;
  descripcion?: string;
  color?: string;
  icono?: string;
  orden?: number;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface CrearCarpetaPayload {
  nombre: string;
  descripcion?: string;
  color?: string;
  icono?: string;
}

export interface ActualizarCarpetaPayload {
  nombre: string;
  descripcion?: string;
  color?: string;
  icono?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
} 
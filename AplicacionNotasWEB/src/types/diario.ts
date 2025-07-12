export interface DiarioEntradaDto {
  id: number;
  usuarioId: number;
  fechaEntrada: string; // ISO date string
  titulo?: string;
  contenido?: string;
  estadoAnimo?: number;
  estadoAnimoTexto: string;
  fechaCreacion: string;
  fechaActualizacion: string;
  requierePin: boolean;
  tieneContenido: boolean;
  tieneTitulo: boolean;
  tituloDisplay: string;
  vistaPrevia: string;
  emojiEstadoAnimo: string;
  colorEstadoAnimo: string;
  cantidadPalabras: number;
  diaSemana: string;
}

export interface CrearEntradaDiarioDto {
  fechaEntrada: string; // ISO date string
  titulo?: string;
  contenido?: string;
  estadoAnimo?: number;
  pin: string;
}

export interface ActualizarEntradaDiarioDto {
  titulo?: string;
  contenido?: string;
  estadoAnimo?: number;
  pin: string;
} 
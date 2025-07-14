import { getToken, logout } from '../utils/authUtils';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface DiarioEntrada {
  fechaEntrada: string;
  titulo?: string;
  contenido?: string;
  estadoAnimo?: number;
  tieneTitulo: boolean;
  tieneContenido: boolean;
  cantidadPalabras: number;
}

export interface CrearEntradaDiario {
  titulo?: string;
  contenido?: string;
  estadoAnimo?: number;
}

export interface ActualizarEntradaDiario {
  titulo?: string;
  contenido?: string;
  estadoAnimo?: number;
}

export interface BuscarEntradasDiario {
  termino?: string;
  estadoAnimo?: number;
  fechaInicio?: string;
  fechaFin?: string;
  pagina: number;
  tamañoPagina: number;
}

export interface VerificarPinDiario {
  pin: string;
}

export interface CrearPinDiario {
  pin: string;
}

class DiarioService {
  onUnauthorized?: () => void;

  setOnUnauthorized(cb: () => void) {
    this.onUnauthorized = cb;
  }

  private getHeaders(): HeadersInit {
    const token = getToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  // Obtener entradas del diario por mes y año
  async getEntradas(mes: number, año: number): Promise<DiarioEntrada[]> {
    const response = await fetch(`${API_URL}/Diario?mes=${mes}&año=${año}`, {
      headers: this.getHeaders()
    });

    if (response.status === 401) {
      logout();
      if (typeof this.onUnauthorized === 'function') this.onUnauthorized();
      throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
    }
    if (!response.ok) {
      throw new Error('Error al obtener entradas del diario');
    }

    const data = await response.json();
    return data.data;
  }

  // Obtener entrada específica por fecha
  async getEntrada(fecha: string): Promise<DiarioEntrada> {
    const response = await fetch(`${API_URL}/Diario/${fecha}`, {
      headers: this.getHeaders()
    });

    if (response.status === 401) {
      logout();
      if (typeof this.onUnauthorized === 'function') this.onUnauthorized();
      throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
    }
    if (!response.ok) {
      throw new Error('Error al obtener entrada del diario');
    }

    const data = await response.json();
    return data.data;
  }

  // Crear nueva entrada
  async crearEntrada(entrada: CrearEntradaDiario): Promise<DiarioEntrada> {
    const response = await fetch(`${API_URL}/Diario`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(entrada)
    });

    if (response.status === 401) {
      logout();
      if (typeof this.onUnauthorized === 'function') this.onUnauthorized();
      throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
    }
    if (!response.ok) {
      // Lanza un error con el status code
      const error = new Error('Error al crear entrada del diario');
      (error as any).status = response.status;
      throw error;
    }

    const data = await response.json();
    return data.data;
  }

  // Actualizar entrada existente
  async actualizarEntrada(fecha: string, entrada: ActualizarEntradaDiario): Promise<DiarioEntrada> {
    const response = await fetch(`${API_URL}/Diario/${fecha}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(entrada)
    });

    if (!response.ok) {
      throw new Error('Error al actualizar entrada del diario');
    }

    const data = await response.json();
    return data.data;
  }

  // Eliminar entrada
  async eliminarEntrada(fecha: string): Promise<void> {
    const response = await fetch(`${API_URL}/Diario/${fecha}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });

    if (!response.ok) {
      throw new Error('Error al eliminar entrada del diario');
    }
  }

  // Buscar entradas
  async buscarEntradas(criterios: BuscarEntradasDiario): Promise<{
    resultados: DiarioEntrada[];
    total: number;
    pagina: number;
    tamañoPagina: number;
    totalPaginas: number;
  }> {
    const response = await fetch(`${API_URL}/Diario/buscar`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(criterios)
    });

    if (response.status === 401) {
      logout();
      if (typeof this.onUnauthorized === 'function') this.onUnauthorized();
      throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
    }
    if (!response.ok) {
      throw new Error('Error al buscar entradas del diario');
    }

    const data = await response.json();
    return data.data;
  }

  // Obtener estadísticas
  async getEstadisticas(mes?: number, año?: number): Promise<any> {
    const params = new URLSearchParams();
    if (mes) params.append('mes', mes.toString());
    if (año) params.append('año', año.toString());

    const response = await fetch(`${API_URL}/Diario/estadisticas?${params}`, {
      headers: this.getHeaders()
    });

    if (!response.ok) {
      throw new Error('Error al obtener estadísticas del diario');
    }

    const data = await response.json();
    return data.data;
  }

  // Obtener estados de ánimo
  async getEstadosAnimo(): Promise<any[]> {
    const response = await fetch(`${API_URL}/Diario/estados-animo`, {
      headers: this.getHeaders()
    });

    if (!response.ok) {
      throw new Error('Error al obtener estados de ánimo');
    }

    const data = await response.json();
    return data.data;
  }

  // ===== MÉTODOS PARA EL SISTEMA DE PIN =====

  // Verificar si el usuario tiene PIN configurado
  async tienePin(): Promise<boolean> {
    const response = await fetch(`${API_URL}/usuario/diario/tiene-pin`, {
      headers: this.getHeaders()
    });

    if (response.status === 401) {
      logout();
      if (typeof this.onUnauthorized === 'function') this.onUnauthorized();
      throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
    }
    if (!response.ok) {
      throw new Error('Error al verificar PIN');
    }

    const data = await response.json();
    return data.tienePin;
  }

  // Crear PIN de diario
  async crearPin(pin: string): Promise<void> {
    const response = await fetch(`${API_URL}/usuario/diario/pin`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ pin })
    });

    if (response.status === 401) {
      logout();
      if (typeof this.onUnauthorized === 'function') this.onUnauthorized();
      throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
    }
    if (!response.ok) {
      throw new Error('Error al crear PIN');
    }
  }

  // Verificar PIN de diario
  async verificarPin(pin: string): Promise<boolean> {
    const response = await fetch(`${API_URL}/usuario/diario/verificar-pin`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ pin })
    });

    if (response.status === 401) {
      logout();
      if (typeof this.onUnauthorized === 'function') this.onUnauthorized();
      throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
    }
    if (!response.ok) {
      throw new Error('Error al verificar PIN');
    }

    const data = await response.json();
    return data.success;
  }
}

export const diarioService = new DiarioService(); 
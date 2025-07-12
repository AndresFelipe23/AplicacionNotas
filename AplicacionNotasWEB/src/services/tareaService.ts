import { getToken, redirectToLogin } from '../utils/authUtils';

export interface Tarea {
  id: number;
  titulo: string;
  descripcion?: string;
  completada: boolean;
  prioridad: 1 | 2 | 3 | 4;
  fechaVencimiento?: string;
  fechaCreacion?: string;
  fechaActualizacion?: string;
  estado?: string; // Nuevo campo para el flujo Kanban
}

export interface CrearTareaDto {
  titulo: string;
  descripcion?: string;
  prioridad: 1 | 2 | 3 | 4;
  fechaVencimiento?: string;
  estado?: string; // Nuevo campo para el flujo Kanban
}

const API_URL = `${import.meta.env.VITE_API_URL}/Tareas`;

function getAuthHeaders() {
  const token = getToken();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    console.log('Token válido encontrado');
  } else {
    console.warn('No se encontró token válido');
    redirectToLogin();
  }
  
  return headers;
}

async function handleResponse(res: Response, errorMessage: string) {
  if (!res.ok) {
    if (res.status === 401) {
      console.error('Error 401: Token inválido o expirado');
      redirectToLogin();
      throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
    }
    throw new Error(`${errorMessage}: ${res.status} ${res.statusText}`);
  }
  
  const json = await res.json();
  return json;
}

export async function getTareas(): Promise<Tarea[]> {
  try {
    const res = await fetch(API_URL, {
      headers: getAuthHeaders(),
    });
    const json = await handleResponse(res, 'Error al obtener tareas');
    return json.data || [];
  } catch (error) {
    console.error('Error en getTareas:', error);
    throw error;
  }
}

export async function getTareasKanban(): Promise<Tarea[]> {
  try {
    console.log('Obteniendo tareas del Kanban desde:', `${API_URL}/kanban`);
    const res = await fetch(`${API_URL}/kanban`, {
      headers: getAuthHeaders(),
    });
    const json = await handleResponse(res, 'Error al obtener tareas del Kanban');
    return json.data || [];
  } catch (error) {
    console.error('Error en getTareasKanban:', error);
    throw error;
  }
}

export async function getTareasPorEstado(estado: string): Promise<Tarea[]> {
  try {
    const res = await fetch(`${API_URL}/estado/${estado}`, {
      headers: getAuthHeaders(),
    });
    const json = await handleResponse(res, `Error al obtener tareas con estado ${estado}`);
    return json.data || [];
  } catch (error) {
    console.error('Error en getTareasPorEstado:', error);
    throw error;
  }
}

export async function crearTarea(data: CrearTareaDto): Promise<Tarea> {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const json = await handleResponse(res, 'Error al crear tarea');
    return json.data;
  } catch (error) {
    console.error('Error en crearTarea:', error);
    throw error;
  }
}

export async function cambiarEstadoTarea(tareaId: number, nuevoEstado: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/${tareaId}/estado`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(nuevoEstado),
    });
    const json = await handleResponse(res, 'Error al cambiar estado de la tarea');
    return json.success;
  } catch (error) {
    console.error('Error en cambiarEstadoTarea:', error);
    throw error;
  }
}

export async function toggleCompletada(tareaId: number): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/${tareaId}/completar`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    const json = await handleResponse(res, 'Error al cambiar estado de completada');
    return json.success;
  } catch (error) {
    console.error('Error en toggleCompletada:', error);
    throw error;
  }
}

export async function eliminarTarea(tareaId: number): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/${tareaId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const json = await handleResponse(res, 'Error al eliminar tarea');
    return json.success;
  } catch (error) {
    console.error('Error en eliminarTarea:', error);
    throw error;
  }
}

export async function actualizarTarea(tareaId: number, data: Partial<CrearTareaDto>): Promise<Tarea> {
  try {
    const res = await fetch(`${API_URL}/${tareaId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const json = await handleResponse(res, 'Error al actualizar tarea');
    return json.data;
  } catch (error) {
    console.error('Error en actualizarTarea:', error);
    throw error;
  }
} 
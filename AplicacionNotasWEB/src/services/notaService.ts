import axios from 'axios';
import type { CrearNotaPayload, ActualizarNotaPayload, Nota, ApiResponse, BuscarNotasPayload } from '../types/nota';

const API_URL = import.meta.env.VITE_API_URL;

// Función de validación
export function validateNotaPayload(payload: CrearNotaPayload): string[] {
  const errors: string[] = [];

  if (!payload.titulo || !payload.titulo.trim()) {
    errors.push('El título es requerido');
  } else if (payload.titulo.length > 500) {
    errors.push('El título no puede exceder 500 caracteres');
  }

  if (payload.contenido && payload.contenido.length > 10000) {
    errors.push('El contenido no puede exceder 10,000 caracteres');
  }

  if (payload.etiquetas) {
    if (payload.etiquetas.length > 10) {
      errors.push('No se pueden agregar más de 10 etiquetas');
    }
    
    for (const etiqueta of payload.etiquetas) {
      if (etiqueta.length > 50) {
        errors.push('Cada etiqueta no puede exceder 50 caracteres');
        break;
      }
    }
  }

  return errors;
}

export async function crearNota(payload: CrearNotaPayload) {
  // Validar antes de enviar
  const errors = validateNotaPayload(payload);
  if (errors.length > 0) {
    throw new Error(errors.join(', '));
  }

  const token = localStorage.getItem('token');
  if (!token) throw new Error('Usuario no autenticado');
  
  const url = `${API_URL}/notas`;
  console.log('URL:', url);
  console.log('Payload:', payload);

  try {
    const response = await axios.post(
      url,
      payload, // Enviamos directamente el payload sin mapeo adicional
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error al crear nota:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al crear la nota');
    } else {
      console.error('Error desconocido al crear nota:', error);
      throw new Error('Error desconocido al crear la nota');
    }
  }
}

export async function obtenerNotas(): Promise<Nota[]> {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Usuario no autenticado');
  
  const url = `${API_URL}/notas`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });
    
    return response.data.data || [];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error al obtener notas:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al obtener las notas');
    } else {
      console.error('Error desconocido al obtener notas:', error);
      throw new Error('Error desconocido al obtener las notas');
    }
  }
}

export async function obtenerNotaPorId(id: number): Promise<Nota> {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Usuario no autenticado');
  
  const url = `${API_URL}/notas/${id}`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });
    
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error al obtener nota:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al obtener la nota');
    } else {
      console.error('Error desconocido al obtener nota:', error);
      throw new Error('Error desconocido al obtener la nota');
    }
  }
}

export async function buscarNotas(termino: string): Promise<Nota[]> {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Usuario no autenticado');
  
  const url = `${API_URL}/notas/buscar?termino=${encodeURIComponent(termino)}`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });
    
    return response.data.data || [];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error al buscar notas:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al buscar las notas');
    } else {
      console.error('Error desconocido al buscar notas:', error);
      throw new Error('Error desconocido al buscar las notas');
    }
  }
}

export async function obtenerNotasFavoritas(): Promise<Nota[]> {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Usuario no autenticado');
  
  const url = `${API_URL}/notas/favoritas`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });
    
    return response.data.data || [];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error al obtener notas favoritas:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al obtener las notas favoritas');
    } else {
      console.error('Error desconocido al obtener notas favoritas:', error);
      throw new Error('Error desconocido al obtener las notas favoritas');
    }
  }
}

export async function toggleFavorito(id: number): Promise<boolean> {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Usuario no autenticado');
  
  const url = `${API_URL}/notas/${id}/favorito`;

  try {
    const response = await axios.post(url, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });
    
    return response.data.success;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error al cambiar favorito:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al cambiar el estado de favorito');
    } else {
      console.error('Error desconocido al cambiar favorito:', error);
      throw new Error('Error desconocido al cambiar el estado de favorito');
    }
  }
}

export async function actualizarNota(id: number, payload: ActualizarNotaPayload): Promise<Nota> {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Usuario no autenticado');
  
  const url = `${API_URL}/notas/${id}`;

  try {
    const response = await axios.put(url, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });
    
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error al actualizar nota:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al actualizar la nota');
    } else {
      console.error('Error desconocido al actualizar nota:', error);
      throw new Error('Error desconocido al actualizar la nota');
    }
  }
}

export async function eliminarNota(id: number): Promise<boolean> {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Usuario no autenticado');
  
  const url = `${API_URL}/notas/${id}`;

  try {
    const response = await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });
    
    return response.data.success;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error al eliminar nota:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al eliminar la nota');
    } else {
      console.error('Error desconocido al eliminar nota:', error);
      throw new Error('Error desconocido al eliminar la nota');
    }
  }
}

export async function buscarNotasAvanzada(filtros: BuscarNotasPayload): Promise<Nota[]> {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Usuario no autenticado');
  
  const url = `${API_URL}/notas/buscar-avanzada`;

  try {
    const response = await axios.post(url, filtros, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });
    
    return response.data.data || [];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error al buscar notas avanzada:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al buscar las notas');
    } else {
      console.error('Error desconocido al buscar notas avanzada:', error);
      throw new Error('Error desconocido al buscar las notas');
    }
  }
}

export async function moverNota(id: number, carpetaId: number | null): Promise<Nota> {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Usuario no autenticado');
  
  const url = `${API_URL}/notas/${id}/mover`;

  try {
    const response = await axios.post(
      url,
      { nuevaCarpetaId: carpetaId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      }
    );
    
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error al mover nota:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al mover la nota');
    } else {
      console.error('Error desconocido al mover nota:', error);
      throw new Error('Error desconocido al mover la nota');
    }
  }
}

export function getUserIdFromToken(): number | undefined {
  const token = localStorage.getItem('token');
  if (!token) return undefined;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload['nameid'];
  } catch {
    return undefined;
  }
}
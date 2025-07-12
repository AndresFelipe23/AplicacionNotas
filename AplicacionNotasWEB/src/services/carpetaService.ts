import { getAuthToken } from '../utils/auth';
import type { Carpeta, CrearCarpetaPayload, ActualizarCarpetaPayload, ApiResponse } from '../types/carpeta';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Obtener todas las carpetas del usuario
export const getCarpetas = async (): Promise<Carpeta[]> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('No hay token de autenticación');
  }

  const response = await fetch(`${API_BASE_URL}/carpetas`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
      });

      if (!response.ok) {
        throw new Error('Error al obtener carpetas');
      }

  const result: ApiResponse<Carpeta[]> = await response.json();
  return result.data || [];
};

// Obtener una carpeta específica
export const getCarpeta = async (id: number): Promise<Carpeta> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('No hay token de autenticación');
  }

  const response = await fetch(`${API_BASE_URL}/carpetas/${id}`, {
        method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
      });

      if (!response.ok) {
    throw new Error('Error al obtener la carpeta');
  }

  const result: ApiResponse<Carpeta> = await response.json();
  if (!result.data) {
    throw new Error('Carpeta no encontrada');
  }

  return result.data;
};

// Crear una nueva carpeta
export const crearCarpeta = async (payload: CrearCarpetaPayload): Promise<Carpeta> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('No hay token de autenticación');
  }

  const response = await fetch(`${API_BASE_URL}/carpetas`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
      });

      if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al crear la carpeta');
  }

  const result: ApiResponse<Carpeta> = await response.json();
  if (!result.data) {
    throw new Error('Error al crear la carpeta');
  }

  return result.data;
};

// Actualizar una carpeta existente
export const actualizarCarpeta = async (id: number, payload: ActualizarCarpetaPayload): Promise<Carpeta> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('No hay token de autenticación');
  }

  const response = await fetch(`${API_BASE_URL}/carpetas/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
      });

      if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al actualizar la carpeta');
  }

  const result: ApiResponse<Carpeta> = await response.json();
  if (!result.data) {
    throw new Error('Error al actualizar la carpeta');
  }

  return result.data;
};

// Eliminar una carpeta
export const eliminarCarpeta = async (id: number): Promise<void> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('No hay token de autenticación');
  }

  const response = await fetch(`${API_BASE_URL}/carpetas/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
      });

      if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al eliminar la carpeta');
  }
}; 
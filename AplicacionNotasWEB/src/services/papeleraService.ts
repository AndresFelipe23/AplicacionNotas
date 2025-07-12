import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export interface ElementoPapelera {
  tipo: string;
  id: number;
  titulo: string;
  fechaEliminacion: string;
  nombreCarpeta?: string;
}

export const papeleraService = {
  async obtenerElementos(): Promise<ElementoPapelera[]> {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Usuario no autenticado');

    const response = await axios.get(`${API_URL}/papelera`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data.data || [];
  },

  async restaurarElemento(tipo: string, id: number): Promise<void> {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Usuario no autenticado');

    const endpoint = tipo === 'Nota' ? 'notas' : tipo === 'Tarea' ? 'tareas' : 'carpetas';
    
    await axios.post(`${API_URL}/${endpoint}/${id}/restaurar`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  },

  async eliminarPermanente(tipo: string, id: number): Promise<void> {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Usuario no autenticado');

    // Corregido: usar el endpoint de papelera
    await axios.delete(`${API_URL}/papelera/${tipo.toLowerCase()}/${id}/permanente`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  },

  async vaciarPapelera(): Promise<void> {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Usuario no autenticado');

    await axios.delete(`${API_URL}/papelera/vaciar`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  },

  async obtenerContador(): Promise<number> {
    const token = localStorage.getItem('token');
    if (!token) return 0;

    try {
      const response = await axios.get(`${API_URL}/papelera/contador`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data.data.contador || 0;
    } catch (error) {
      console.error('Error al obtener contador de papelera:', error);
      return 0;
    }
  }
}; 
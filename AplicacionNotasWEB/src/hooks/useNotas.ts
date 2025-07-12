import { useState, useEffect, useCallback } from 'react';
import { 
  crearNota, 
  obtenerNotas, 
  obtenerNotaPorId, 
  buscarNotas, 
  obtenerNotasFavoritas,
  toggleFavorito,
  buscarNotasAvanzada
} from '../services/notaService';
import type { CrearNotaPayload, Nota, BuscarNotasPayload } from '../types/nota';

interface UseNotasReturn {
  crearNota: (payload: CrearNotaPayload) => Promise<void>;
  obtenerNotas: () => Promise<void>;
  obtenerNotaPorId: (id: number) => Promise<void>;
  buscarNotas: (termino: string) => Promise<void>;
  obtenerNotasFavoritas: () => Promise<void>;
  toggleFavorito: (id: number) => Promise<void>;
  buscarNotasAvanzada: (filtros: BuscarNotasPayload) => Promise<void>;
  refetch: () => Promise<void>;
  notas: Nota[];
  notaSeleccionada: Nota | null;
  loading: boolean;
  error: string | null;
  success: boolean;
  clearError: () => void;
  clearSuccess: () => void;
}

export function useNotas(): UseNotasReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [notas, setNotas] = useState<Nota[]>([]);
  const [notaSeleccionada, setNotaSeleccionada] = useState<Nota | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const handleCrearNota = useCallback(async (payload: CrearNotaPayload) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await crearNota(payload);
      setSuccess(true);
      // Recargar notas después de crear una nueva
      await handleObtenerNotas();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleObtenerNotas = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const notasData = await obtenerNotas();
      setNotas(notasData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleObtenerNotaPorId = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);

    try {
      const nota = await obtenerNotaPorId(id);
      setNotaSeleccionada(nota);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleBuscarNotas = useCallback(async (termino: string) => {
    setLoading(true);
    setError(null);

    try {
      const notasData = await buscarNotas(termino);
      setNotas(notasData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleObtenerNotasFavoritas = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const notasData = await obtenerNotasFavoritas();
      setNotas(notasData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleToggleFavorito = useCallback(async (id: number) => {
    setError(null);
    setSuccess(false);

    try {
      await toggleFavorito(id);
      setSuccess(true);
      // Recargar notas para actualizar el estado
      await handleObtenerNotas();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    }
  }, [handleObtenerNotas]);

  const handleBuscarNotasAvanzada = useCallback(async (filtros: BuscarNotasPayload) => {
    setLoading(true);
    setError(null);

    try {
      const notasData = await buscarNotasAvanzada(filtros);
      setNotas(notasData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    await handleObtenerNotas();
  }, [handleObtenerNotas]);

  const clearError = useCallback(() => setError(null), []);
  const clearSuccess = useCallback(() => setSuccess(false), []);

  // Cargar notas solo una vez al inicializar el hook
  useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true);
      handleObtenerNotas();
    }
  }, [isInitialized, handleObtenerNotas]);

  return {
    crearNota: handleCrearNota,
    obtenerNotas: handleObtenerNotas,
    obtenerNotaPorId: handleObtenerNotaPorId,
    buscarNotas: handleBuscarNotas,
    obtenerNotasFavoritas: handleObtenerNotasFavoritas,
    toggleFavorito: handleToggleFavorito,
    buscarNotasAvanzada: handleBuscarNotasAvanzada,
    refetch,
    notas,
    notaSeleccionada,
    loading,
    error,
    success,
    clearError,
    clearSuccess,
  };
} 
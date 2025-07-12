import { useState, useEffect, useCallback } from 'react';

interface DraftData {
  titulo: string;
  contenido: string;
  timestamp: number;
}

interface UseLocalStorageReturn {
  saveDraft: (notaId: number, titulo: string, contenido: string) => void;
  loadDraft: (notaId: number) => DraftData | null;
  clearDraft: (notaId: number) => void;
  hasDraft: (notaId: number) => boolean;
  getDraftTimestamp: (notaId: number) => number | null;
}

export function useLocalStorage(): UseLocalStorageReturn {
  const getStorageKey = (notaId: number) => `nota_${notaId}_draft`;

  const saveDraft = useCallback((notaId: number, titulo: string, contenido: string) => {
    try {
      const draft: DraftData = {
        titulo,
        contenido,
        timestamp: Date.now()
      };
      localStorage.setItem(getStorageKey(notaId), JSON.stringify(draft));
    } catch (error) {
      console.error('Error guardando borrador en localStorage:', error);
    }
  }, []);

  const loadDraft = useCallback((notaId: number): DraftData | null => {
    try {
      const saved = localStorage.getItem(getStorageKey(notaId));
      if (saved) {
        const draft = JSON.parse(saved);
        return draft;
      }
    } catch (error) {
      console.error('Error cargando borrador desde localStorage:', error);
    }
    return null;
  }, []);

  const clearDraft = useCallback((notaId: number) => {
    try {
      localStorage.removeItem(getStorageKey(notaId));
    } catch (error) {
      console.error('Error limpiando borrador de localStorage:', error);
    }
  }, []);

  const hasDraft = useCallback((notaId: number): boolean => {
    try {
      return localStorage.getItem(getStorageKey(notaId)) !== null;
    } catch (error) {
      return false;
    }
  }, []);

  const getDraftTimestamp = useCallback((notaId: number): number | null => {
    try {
      const saved = localStorage.getItem(getStorageKey(notaId));
      if (saved) {
        const draft = JSON.parse(saved);
        return draft.timestamp;
      }
    } catch (error) {
      console.error('Error obteniendo timestamp del borrador:', error);
    }
    return null;
  }, []);

  return {
    saveDraft,
    loadDraft,
    clearDraft,
    hasDraft,
    getDraftTimestamp
  };
} 
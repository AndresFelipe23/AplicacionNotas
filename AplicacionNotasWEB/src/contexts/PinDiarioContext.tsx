import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { diarioService } from '../services/diarioService';

interface PinDiarioContextType {
  isPinAuthenticated: boolean;
  hasPin: boolean;
  isLoading: boolean;
  error: string | null;
  authenticatePin: (pin: string) => Promise<boolean>;
  createPin: (pin: string) => Promise<void>;
  checkPinStatus: () => Promise<void>;
  logout: () => void;
}

const PinDiarioContext = createContext<PinDiarioContextType | undefined>(undefined);

export const usePinDiario = () => {
  const context = useContext(PinDiarioContext);
  if (context === undefined) {
    throw new Error('usePinDiario debe ser usado dentro de un PinDiarioProvider');
  }
  return context;
};

interface PinDiarioProviderProps {
  children: ReactNode;
}

export const PinDiarioProvider: React.FC<PinDiarioProviderProps> = ({ children }) => {
  const [isPinAuthenticated, setIsPinAuthenticated] = useState(false);
  const [hasPin, setHasPin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkPinStatus = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const tienePin = await diarioService.tienePin();
      setHasPin(tienePin);
      
      // Si no tiene PIN, automáticamente está "autenticado"
      if (!tienePin) {
        setIsPinAuthenticated(true);
      }
    } catch (err: any) {
      // Si el error es 404, probablemente el endpoint no existe, así que asumimos que no hay PIN
      if (err.message?.includes('404') || err.message?.includes('Not Found')) {
        setHasPin(false);
        setIsPinAuthenticated(true);
        setError(null);
      } else {
        setError('Error al verificar estado del PIN');
        console.error('Error checking PIN status:', err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const authenticatePin = async (pin: string): Promise<boolean> => {
    try {
      setError(null);
      const isValid = await diarioService.verificarPin(pin);
      
      if (isValid) {
        setIsPinAuthenticated(true);
        // Guardar en localStorage para persistir la sesión
        localStorage.setItem('diarioPinAuthenticated', 'true');
      }
      
      return isValid;
    } catch (err) {
      setError('Error al verificar PIN');
      console.error('Error authenticating PIN:', err);
      return false;
    }
  };

  const createPin = async (pin: string): Promise<void> => {
    try {
      setError(null);
      await diarioService.crearPin(pin);
      setHasPin(true);
      setIsPinAuthenticated(true);
      localStorage.setItem('diarioPinAuthenticated', 'true');
    } catch (err) {
      setError('Error al crear PIN');
      console.error('Error creating PIN:', err);
      throw err;
    }
  };

  const logout = () => {
    setIsPinAuthenticated(false);
    localStorage.removeItem('diarioPinAuthenticated');
  };

  useEffect(() => {
    // Verificar si ya está autenticado desde localStorage
    const isAuthenticated = localStorage.getItem('diarioPinAuthenticated') === 'true';
    if (isAuthenticated) {
      setIsPinAuthenticated(true);
    }
    
    checkPinStatus();
  }, []);

  const value: PinDiarioContextType = {
    isPinAuthenticated,
    hasPin,
    isLoading,
    error,
    authenticatePin,
    createPin,
    checkPinStatus,
    logout
  };

  return (
    <PinDiarioContext.Provider value={value}>
      {children}
    </PinDiarioContext.Provider>
  );
}; 
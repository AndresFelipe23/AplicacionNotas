import React, { createContext, useContext, useState, useCallback } from 'react';
import { papeleraService } from '../services/papeleraService';

interface PapeleraContextProps {
  contador: number;
  actualizarContador: () => Promise<void>;
  setContador: React.Dispatch<React.SetStateAction<number>>;
}

const PapeleraContext = createContext<PapeleraContextProps | undefined>(undefined);

export const PapeleraProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [contador, setContador] = useState(0);

  const actualizarContador = useCallback(async () => {
    const count = await papeleraService.obtenerContador();
    setContador(count);
  }, []);

  return (
    <PapeleraContext.Provider value={{ contador, actualizarContador, setContador }}>
      {children}
    </PapeleraContext.Provider>
  );
};

export const usePapelera = () => {
  const context = useContext(PapeleraContext);
  if (!context) throw new Error('usePapelera debe usarse dentro de PapeleraProvider');
  return context;
}; 
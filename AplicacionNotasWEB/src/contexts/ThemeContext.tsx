import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Tipos para las configuraciones de apariencia
export interface ThemeConfig {
  mode: 'light' | 'dark' | 'auto';
  sidebarColor: string;
  buttonColor: string;
  accentColor: string;
  borderRadius: 'sm' | 'md' | 'lg' | 'xl';
  animationSpeed: 'slow' | 'normal' | 'fast';
}

// Configuraciones predefinidas de colores
export const colorSchemes = {
  sidebar: {
    auto: { name: 'Automático', class: 'bg-auto', hover: 'hover:bg-auto' },
    white: { name: 'Blanco', class: 'bg-white', hover: 'hover:bg-slate-50' },
    black: { name: 'Negro', class: 'bg-slate-900', hover: 'hover:bg-slate-800' },
    blue: { name: 'Azul', class: 'bg-blue-600', hover: 'hover:bg-blue-700' },
    purple: { name: 'Púrpura', class: 'bg-purple-600', hover: 'hover:bg-purple-700' },
    green: { name: 'Verde', class: 'bg-green-600', hover: 'hover:bg-green-700' },
    red: { name: 'Rojo', class: 'bg-red-600', hover: 'hover:bg-red-700' },
    orange: { name: 'Naranja', class: 'bg-orange-600', hover: 'hover:bg-orange-700' },
    indigo: { name: 'Índigo', class: 'bg-indigo-600', hover: 'hover:bg-indigo-700' },
    teal: { name: 'Verde azulado', class: 'bg-teal-600', hover: 'hover:bg-teal-700' },
    pink: { name: 'Rosa', class: 'bg-pink-600', hover: 'hover:bg-pink-700' }
  },
  button: {
    blue: { name: 'Azul', class: 'bg-blue-600 hover:bg-blue-700', gradient: 'from-blue-600 to-blue-700' },
    purple: { name: 'Púrpura', class: 'bg-purple-600 hover:bg-purple-700', gradient: 'from-purple-600 to-purple-700' },
    green: { name: 'Verde', class: 'bg-green-600 hover:bg-green-700', gradient: 'from-green-600 to-green-700' },
    red: { name: 'Rojo', class: 'bg-red-600 hover:bg-red-700', gradient: 'from-red-600 to-red-700' },
    orange: { name: 'Naranja', class: 'bg-orange-600 hover:bg-orange-700', gradient: 'from-orange-600 to-orange-700' },
    indigo: { name: 'Índigo', class: 'bg-indigo-600 hover:bg-indigo-700', gradient: 'from-indigo-600 to-indigo-700' },
    teal: { name: 'Verde azulado', class: 'bg-teal-600 hover:bg-teal-700', gradient: 'from-teal-600 to-teal-700' },
    pink: { name: 'Rosa', class: 'bg-pink-600 hover:bg-pink-700', gradient: 'from-pink-600 to-pink-700' }
  },
  accent: {
    blue: { name: 'Azul', class: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
    purple: { name: 'Púrpura', class: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
    green: { name: 'Verde', class: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
    red: { name: 'Rojo', class: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
    orange: { name: 'Naranja', class: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
    indigo: { name: 'Índigo', class: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200' },
    teal: { name: 'Verde azulado', class: 'text-teal-600', bg: 'bg-teal-50', border: 'border-teal-200' },
    pink: { name: 'Rosa', class: 'text-pink-600', bg: 'bg-pink-50', border: 'border-pink-200' }
  }
};

// Configuración por defecto
const defaultTheme: ThemeConfig = {
  mode: 'light',
  sidebarColor: 'auto',
  buttonColor: 'blue',
  accentColor: 'blue',
  borderRadius: 'lg',
  animationSpeed: 'normal'
};

interface ThemeContextType {
  theme: ThemeConfig;
  updateTheme: (updates: Partial<ThemeConfig>) => void;
  resetTheme: () => void;
  isDarkMode: boolean;
  getSidebarClasses: () => string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe ser usado dentro de un ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeConfig>(() => {
    // Cargar configuración guardada del localStorage
    const saved = localStorage.getItem('theme-config');
    if (saved) {
      try {
        return { ...defaultTheme, ...JSON.parse(saved) };
      } catch {
        return defaultTheme;
      }
    }
    return defaultTheme;
  });

  const [isDarkMode, setIsDarkMode] = useState(false);

  // Detectar modo oscuro del sistema
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (theme.mode === 'auto') {
        setIsDarkMode(mediaQuery.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    handleChange(); // Verificar estado inicial

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme.mode]);

  // Aplicar tema al documento
  useEffect(() => {
    const root = document.documentElement;
    
    // Aplicar modo oscuro/claro
    if (theme.mode === 'dark' || (theme.mode === 'auto' && isDarkMode)) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Aplicar variables CSS personalizadas
    root.style.setProperty('--border-radius', 
      theme.borderRadius === 'sm' ? '0.375rem' :
      theme.borderRadius === 'md' ? '0.5rem' :
      theme.borderRadius === 'lg' ? '0.75rem' : '1rem'
    );

    root.style.setProperty('--animation-speed', 
      theme.animationSpeed === 'slow' ? '0.5s' :
      theme.animationSpeed === 'normal' ? '0.3s' : '0.15s'
    );

  }, [theme, isDarkMode]);

  // Guardar configuración en localStorage
  useEffect(() => {
    localStorage.setItem('theme-config', JSON.stringify(theme));
  }, [theme]);

  const updateTheme = (updates: Partial<ThemeConfig>) => {
    setTheme(prev => ({ ...prev, ...updates }));
  };

  const resetTheme = () => {
    setTheme(defaultTheme);
  };

  // Función para obtener las clases del sidebar según el tema
  const getSidebarClasses = () => {
    const currentDarkMode = theme.mode === 'dark' || (theme.mode === 'auto' && isDarkMode);
    
    if (theme.sidebarColor === 'auto') {
      return currentDarkMode ? 'bg-slate-900' : 'bg-white';
    } else if (theme.sidebarColor === 'white') {
      return 'bg-white';
    } else if (theme.sidebarColor === 'black') {
      return 'bg-slate-900';
    } else {
      return colorSchemes.sidebar[theme.sidebarColor as keyof typeof colorSchemes.sidebar].class;
    }
  };

  const value: ThemeContextType = {
    theme,
    updateTheme,
    resetTheme,
    isDarkMode,
    getSidebarClasses
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}; 
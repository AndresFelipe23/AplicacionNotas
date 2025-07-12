import { useTheme, colorSchemes } from '../contexts/ThemeContext';

export const useThemeStyles = () => {
  const { theme, getSidebarClasses } = useTheme();

  const getSidebarClassesWithAuto = () => {
    return getSidebarClasses();
  };

  const getButtonClasses = (variant: 'primary' | 'secondary' | 'outline' | 'ghost' = 'primary') => {
    const buttonColor = colorSchemes.button[theme.buttonColor as keyof typeof colorSchemes.button];
    
    const variants = {
      primary: `${buttonColor.class} text-white`,
      secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
      outline: `border-2 border-${theme.buttonColor}-500 text-${theme.buttonColor}-600 hover:bg-${theme.buttonColor}-50`,
      ghost: `text-${theme.buttonColor}-600 hover:bg-${theme.buttonColor}-50`
    };
    
    return variants[variant];
  };

  const getAccentClasses = () => {
    const accentColor = colorSchemes.accent[theme.accentColor as keyof typeof colorSchemes.accent];
    return {
      text: accentColor.class,
      bg: accentColor.bg,
      border: accentColor.border
    };
  };

  const getBorderRadius = () => {
    const radiusMap = {
      sm: 'rounded',
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl'
    };
    return radiusMap[theme.borderRadius];
  };

  const getAnimationSpeed = () => {
    const speedMap = {
      slow: 'duration-500',
      normal: 'duration-300',
      fast: 'duration-150'
    };
    return speedMap[theme.animationSpeed];
  };

  // Función para obtener las clases de texto del sidebar
  const getSidebarTextClasses = () => {
    const sidebarColor = theme.sidebarColor;
    const isDarkMode = theme.mode === 'dark' || (theme.mode === 'auto' && document.documentElement.classList.contains('dark'));
    
    if (sidebarColor === 'auto') {
      return isDarkMode ? 'text-white' : 'text-slate-900';
    } else if (sidebarColor === 'white') {
      return 'text-slate-900';
    } else if (sidebarColor === 'black') {
      return 'text-white';
    } else {
      return 'text-white'; // Para colores de tema
    }
  };

  // Función para obtener las clases de hover del sidebar
  const getSidebarHoverClasses = () => {
    const sidebarColor = theme.sidebarColor;
    const isDarkMode = theme.mode === 'dark' || (theme.mode === 'auto' && document.documentElement.classList.contains('dark'));
    
    if (sidebarColor === 'auto') {
      return isDarkMode ? 'hover:bg-white/10' : 'hover:bg-slate-100';
    } else if (sidebarColor === 'white') {
      return 'hover:bg-slate-100';
    } else if (sidebarColor === 'black') {
      return 'hover:bg-white/10';
    } else {
      return 'hover:bg-white/10'; // Para colores de tema
    }
  };

  // Función para obtener las clases de borde del sidebar
  const getSidebarBorderClasses = () => {
    const sidebarColor = theme.sidebarColor;
    const isDarkMode = theme.mode === 'dark' || (theme.mode === 'auto' && document.documentElement.classList.contains('dark'));
    
    if (sidebarColor === 'auto') {
      return isDarkMode ? 'border-slate-700' : 'border-slate-200';
    } else if (sidebarColor === 'white') {
      return 'border-slate-200';
    } else if (sidebarColor === 'black') {
      return 'border-slate-700';
    } else {
      return 'border-slate-700'; // Para colores de tema
    }
  };

  return {
    getSidebarClasses: getSidebarClassesWithAuto,
    getSidebarTextClasses,
    getSidebarHoverClasses,
    getSidebarBorderClasses,
    getButtonClasses,
    getAccentClasses,
    getBorderRadius,
    getAnimationSpeed,
    theme
  };
}; 
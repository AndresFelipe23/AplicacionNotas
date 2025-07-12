// Utilidades para organizar clases de Tailwind CSS
export const tailwindClasses = {
  // Layout
  container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  section: 'py-16 md:py-20 lg:py-24',
  
  // Typography
  heading: {
    h1: 'text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight',
    h2: 'text-3xl md:text-5xl font-bold text-gray-900',
    h3: 'text-2xl font-bold text-gray-900',
    h4: 'text-xl font-semibold text-gray-900',
  },
  
  // Gradients
  gradients: {
    primary: 'bg-gradient-to-r from-blue-600 to-purple-600',
    secondary: 'bg-gradient-to-r from-gray-50 to-white',
    hero: 'bg-gradient-to-br from-gray-50 via-white to-blue-50/30',
    cta: 'bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700',
  },
  
  // Buttons
  button: {
    base: 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
    primary: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 shadow-sm hover:shadow-md',
    outline: 'border-2 border-gray-200 text-gray-700 hover:border-blue-600 hover:text-blue-600 bg-white',
    ghost: 'text-gray-600 hover:text-blue-600 hover:bg-blue-50',
  },
  
  // Cards
  card: {
    base: 'bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100',
    feature: 'group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100',
  },
  
  // Icons
  icon: {
    small: 'w-5 h-5',
    medium: 'w-6 h-6',
    large: 'w-7 h-7',
    container: 'w-14 h-14 bg-gradient-to-r rounded-2xl flex items-center justify-center shadow-lg',
  },
  
  // Spacing
  spacing: {
    section: 'py-16 md:py-20 lg:py-24',
    container: 'px-4 sm:px-6 lg:px-8',
    gap: 'gap-6 md:gap-8',
  },
  
  // Colors
  colors: {
    text: {
      primary: 'text-gray-900',
      secondary: 'text-gray-600',
      light: 'text-gray-400',
      white: 'text-white',
    },
    bg: {
      primary: 'bg-white',
      secondary: 'bg-gray-50',
      dark: 'bg-gray-900',
    },
  },
  
  // Transitions
  transitions: {
    fast: 'transition-all duration-200',
    normal: 'transition-all duration-300',
    slow: 'transition-all duration-500',
  },
  
  // Responsive
  responsive: {
    grid: 'grid md:grid-cols-2 lg:grid-cols-3',
    flex: 'flex flex-col sm:flex-row',
    text: 'text-center md:text-left',
  },
};

// Función helper para combinar clases
export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

// Función helper para clases condicionales
export const classNames = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
}; 
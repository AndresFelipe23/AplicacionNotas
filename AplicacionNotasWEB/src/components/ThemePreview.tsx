import React from 'react';
import { useTheme, colorSchemes } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';

const ThemePreview: React.FC = () => {
  const { theme } = useTheme();

  const sidebarColor = colorSchemes.sidebar[theme.sidebarColor as keyof typeof colorSchemes.sidebar];
  const buttonColor = colorSchemes.button[theme.buttonColor as keyof typeof colorSchemes.button];
  const accentColor = colorSchemes.accent[theme.accentColor as keyof typeof colorSchemes.accent];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Vista Previa del Tema</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Sidebar Preview */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-slate-600 dark:text-slate-400">Sidebar</h4>
          <div className={`w-full h-16 ${sidebarColor.class} rounded-lg flex items-center justify-center`}>
            <span className="text-white font-medium">Sidebar</span>
          </div>
          <div className="space-y-2">
            <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded"></div>
            <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
          </div>
        </div>

        {/* Button Preview */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-slate-600 dark:text-slate-400">Botones</h4>
          <div className={`w-full h-16 ${buttonColor.class} rounded-lg flex items-center justify-center`}>
            <span className="text-white font-medium">Botón</span>
          </div>
          <div className="space-y-2">
            <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded"></div>
            <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
          </div>
        </div>

        {/* Accent Preview */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-slate-600 dark:text-slate-400">Acentos</h4>
          <div className={`w-full h-16 ${accentColor.bg} ${accentColor.border} rounded-lg flex items-center justify-center`}>
            <span className={`text-sm font-medium ${accentColor.class}`}>Acento</span>
          </div>
          <div className="space-y-2">
            <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded"></div>
            <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
          </div>
        </div>
      </div>

      {/* Configuración actual */}
      <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
        <h4 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">Configuración Actual</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
            <span className="text-slate-500 dark:text-slate-400">Tema:</span>
            <div className="font-medium text-slate-900 dark:text-white capitalize">{theme.mode}</div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
            <span className="text-slate-500 dark:text-slate-400">Sidebar:</span>
            <div className="font-medium text-slate-900 dark:text-white capitalize">{sidebarColor.name}</div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
            <span className="text-slate-500 dark:text-slate-400">Botones:</span>
            <div className="font-medium text-slate-900 dark:text-white capitalize">{buttonColor.name}</div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
            <span className="text-slate-500 dark:text-slate-400">Acentos:</span>
            <div className="font-medium text-slate-900 dark:text-white capitalize">{accentColor.name}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemePreview; 
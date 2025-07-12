import React from 'react';
import { Tag, Star, Calendar, Folder } from 'lucide-react';
import type { Nota } from '../types/nota';
import { getContentSummary } from '../utils/draft';

interface NotaMiniCardProps {
  nota: Nota;
  selected?: boolean;
  onClick?: () => void;
}

const NotaMiniCard: React.FC<NotaMiniCardProps> = ({ nota, selected, onClick }) => {
  const contenidoResumen = getContentSummary(nota.contenido || '');
  const fechaActualizacion = new Date(nota.fechaActualizacion);
  const esHoy = fechaActualizacion.toDateString() === new Date().toDateString();
  
  return (
    <div
      className={`rounded-lg p-4 mb-3 cursor-pointer transition-all duration-200 border
        ${selected 
          ? 'bg-blue-50 border-blue-300 shadow-md' 
          : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm'
        }
      `}
      onClick={onClick}
    >
      {/* Header con título y favorito */}
      <div className="flex items-start justify-between mb-2">
        <div className="font-semibold text-gray-900 truncate flex-1 mr-2">
          {nota.titulo}
        </div>
        {nota.favorito && (
          <Star className="w-4 h-4 text-amber-500 fill-current flex-shrink-0" />
        )}
      </div>
      
      {/* Resumen del contenido */}
      <div className="text-sm text-gray-600 line-clamp-2 mb-3">
        {contenidoResumen || 'Sin contenido...'}
      </div>
      
      {/* Etiquetas */}
      {nota.etiquetas && nota.etiquetas.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {nota.etiquetas.slice(0, 3).map((etiqueta, i) => (
            <span 
              key={i} 
              className="bg-blue-100 text-blue-700 text-xs rounded-full px-2 py-1 flex items-center gap-1"
              title={etiqueta}
            >
              <Tag className="w-3 h-3" />
              <span className="truncate max-w-16">{etiqueta}</span>
            </span>
          ))}
          {nota.etiquetas.length > 3 && (
            <span className="bg-gray-100 text-gray-600 text-xs rounded-full px-2 py-1">
              +{nota.etiquetas.length - 3}
            </span>
          )}
        </div>
      )}
      
      {/* Footer con información adicional */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {esHoy ? 'Hoy' : fechaActualizacion.toLocaleDateString()}
        </div>
        
        <div className="flex items-center gap-1">
          {nota.carpetaId && nota.nombreCarpeta ? (
            <div className="flex items-center gap-1 bg-blue-100 text-blue-600 px-2 py-0.5 rounded">
              <Folder className="w-3 h-3" />
              <span className="truncate max-w-16">{nota.nombreCarpeta}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 bg-gray-100 text-gray-500 px-2 py-0.5 rounded">
              <Folder className="w-3 h-3" />
              <span className="truncate max-w-16">Sin carpeta</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotaMiniCard; 
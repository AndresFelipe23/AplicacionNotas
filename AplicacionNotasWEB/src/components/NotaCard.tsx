import React from 'react';
import { Star, Archive, Folder, Tag, Calendar, Clock } from 'lucide-react';
import type { Nota } from '../types/nota';

interface NotaCardProps {
  nota: Nota;
  onClick?: () => void;
  selected?: boolean;
}

const NotaCard = React.memo<NotaCardProps>(({ nota, onClick, selected = false }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div
      className={`bg-neutral-800 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:bg-neutral-700 border-2 ${
        selected ? 'border-blue-500 bg-neutral-700' : 'border-transparent'
      }`}
      onClick={onClick}
    >
      {/* Header con título y acciones */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-white line-clamp-2">
          {nota.titulo}
        </h3>
        <div className="flex items-center gap-1 ml-2">
          {nota.favorito && (
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
          )}
          {nota.archivado && (
            <Archive className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </div>

      {/* Contenido */}
      {nota.contenido && (
        <p className="text-gray-300 text-sm mb-3 line-clamp-3">
          {truncateText(nota.contenido, 150)}
        </p>
      )}

      {/* Etiquetas */}
      {nota.etiquetas && nota.etiquetas.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {nota.etiquetas.slice(0, 3).map((etiqueta, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full flex items-center gap-1"
            >
              <Tag className="w-3 h-3" />
              {etiqueta}
            </span>
          ))}
          {nota.etiquetas.length > 3 && (
            <span className="px-2 py-1 bg-gray-600 text-gray-300 text-xs rounded-full">
              +{nota.etiquetas.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Footer con información */}
      <div className="flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center gap-3">
          {/* Carpeta */}
          {nota.nombreCarpeta && (
            <div className="flex items-center gap-1">
              <Folder className="w-3 h-3" />
              <span>{nota.nombreCarpeta}</span>
            </div>
          )}
          
          {/* Fecha de actualización */}
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{formatTime(nota.fechaActualizacion)}</span>
          </div>
        </div>

        {/* Fecha de creación */}
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          <span>{formatDate(nota.fechaCreacion)}</span>
        </div>
      </div>
    </div>
  );
});

NotaCard.displayName = 'NotaCard';

export default NotaCard; 
import { useState } from 'react';
import { Edit, Trash2, Folder, MoreVertical } from 'lucide-react';
import { Carpeta } from '../services/carpetaService';

interface CarpetaCardProps {
  carpeta: Carpeta;
  onEdit: (carpeta: Carpeta) => void;
  onDelete: (id: number) => void;
  onClick: (carpeta: Carpeta) => void;
}

export default function CarpetaCard({ carpeta, onEdit, onDelete, onClick }: CarpetaCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    onEdit(carpeta);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    onDelete(carpeta.id);
  };

  return (
    <div 
      className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-100 hover:border-gray-200 overflow-hidden"
      onClick={() => onClick(carpeta)}
    >
      {/* Header con color de fondo */}
      <div 
        className="h-20 flex items-center justify-center relative"
        style={{ backgroundColor: carpeta.color }}
      >
        <Folder className="w-8 h-8 text-white" />
        
        {/* Menú de opciones */}
        <div className="absolute top-2 right-2">
          <button
            onClick={handleMenuClick}
            className="p-1 rounded-lg bg-white bg-opacity-20 hover:bg-opacity-30 transition-all opacity-0 group-hover:opacity-100"
          >
            <MoreVertical className="w-4 h-4 text-white" />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 top-8 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 min-w-[120px]">
              <button
                onClick={handleEdit}
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Editar
              </button>
              <button
                onClick={handleDelete}
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600"
              >
                <Trash2 className="w-4 h-4" />
                Eliminar
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Contenido */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 truncate">
          {carpeta.nombre}
        </h3>
        
        {carpeta.descripcion && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {carpeta.descripcion}
          </p>
        )}
        
        <div className="flex items-center justify-between text-sm">
          <span className={`font-medium ${
            carpeta.estaVacia ? 'text-gray-500' : 'text-gray-700'
          }`}>
            {carpeta.descripcionContenido}
          </span>
          <span className="text-xs text-gray-500">
            {new Date(carpeta.fechaCreacion).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
} 
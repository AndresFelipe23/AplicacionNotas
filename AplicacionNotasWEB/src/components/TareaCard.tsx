import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import { motion, AnimatePresence } from 'framer-motion';
import { Tarea } from '../services/tareaService';
import { 
  CheckCircle, 
  Circle, 
  MoreHorizontal, 
  Calendar,
  Edit3,
  Trash2,
  AlertCircle
} from 'lucide-react';

// Tipos para react-dnd
const ItemTypes = {
  TAREA: 'tarea'
};

interface TareaCardProps {
  tarea: Tarea;
  onToggleCompletada: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (tarea: Tarea) => void;
}

export default function TareaCard({ 
  tarea, 
  onToggleCompletada, 
  onDelete, 
  onEdit 
}: TareaCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.TAREA,
    item: { id: tarea.id, type: ItemTypes.TAREA },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const prioridadConfig = {
    1: { color: 'bg-slate-100 text-slate-600', border: 'border-slate-200', dot: 'bg-slate-400' },
    2: { color: 'bg-blue-100 text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500' },
    3: { color: 'bg-amber-100 text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' },
    4: { color: 'bg-red-100 text-red-700', border: 'border-red-200', dot: 'bg-red-500' }
  };

  const isVencida = tarea.fechaVencimiento && new Date(tarea.fechaVencimiento) < new Date() && !tarea.completada;
  const config = prioridadConfig[tarea.prioridad];

  const prioridadTexto = {
    1: 'Baja',
    2: 'Media',
    3: 'Alta',
    4: 'Urgente'
  };

  return (
    <motion.div
      ref={drag}
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -2 }}
      className={`
        group relative bg-white rounded-2xl border transition-all duration-200 cursor-grab
        ${isDragging ? 'opacity-50 rotate-1' : 'hover:shadow-lg'}
        ${tarea.completada ? 'opacity-70' : ''}
        ${isVencida ? 'border-red-300 bg-red-50/50' : 'border-slate-200'}
      `}
    >
      {/* Header de la tarjeta */}
      <div className="p-4 pb-0">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <button
              onClick={() => onToggleCompletada(tarea.id)}
              className={`shrink-0 transition-colors ${
                tarea.completada 
                  ? 'text-green-600 hover:text-green-700' 
                  : 'text-slate-300 hover:text-green-600'
              }`}
            >
              {tarea.completada ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <Circle className="w-5 h-5" />
              )}
            </button>
            
            <h3 className={`font-medium text-slate-900 leading-snug truncate ${
              tarea.completada ? 'line-through text-slate-500' : ''
            }`}>
              {tarea.titulo}
            </h3>
          </div>

          <div className="relative shrink-0">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors opacity-0 group-hover:opacity-100"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {/* Menú desplegable */}
            <AnimatePresence>
              {showMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowMenu(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-xl border border-slate-200 py-1 z-20 min-w-32"
                  >
                    <button
                      onClick={() => {
                        onEdit(tarea);
                        setShowMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      <Edit3 className="w-3 h-3" />
                      Editar
                    </button>
                    <button
                      onClick={() => {
                        onDelete(tarea.id);
                        setShowMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-3 h-3" />
                      Eliminar
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Descripción */}
        {tarea.descripcion && (
          <p className="text-slate-600 text-sm mb-3 line-clamp-2 leading-relaxed ml-7">
            {tarea.descripcion}
          </p>
        )}
      </div>

      {/* Footer con metadatos */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Prioridad */}
            <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${config.color} ${config.border} border`}>
              <div className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
              <span>{prioridadTexto[tarea.prioridad]}</span>
            </div>

            {/* Fecha de vencimiento */}
            {tarea.fechaVencimiento && (
              <div className={`flex items-center gap-1 text-xs ${
                isVencida ? 'text-red-600' : 'text-slate-500'
              }`}>
                {isVencida ? (
                  <AlertCircle className="w-3 h-3" />
                ) : (
                  <Calendar className="w-3 h-3" />
                )}
                <span>
                  {new Date(tarea.fechaVencimiento).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'short'
                  })}
                </span>
                {isVencida && (
                  <span className="font-medium ml-1">(Vencida)</span>
                )}
              </div>
            )}
          </div>

          {/* Indicador de arrastre */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-1 h-1 bg-slate-300 rounded-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
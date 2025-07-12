import React from 'react';
import { Plus, Clock, CheckCircle, ListTodo } from 'lucide-react';
import { Tarea } from '../services/tareaService';
import TareaCard from './TareaCard';

interface KanbanColumnProps {
  title: string;
  estado: string;
  tareas: Tarea[];
  onToggleCompletada: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (tarea: Tarea) => void;
  onDrop: (estado: string, tareaId: number) => void;
  onCrearTarea?: () => void;
  isLoading?: boolean;
}

const columnConfig = {
  'pendiente': {
    title: 'Mis Tareas',
    icon: ListTodo,
    color: 'blue',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700'
  },
  'en_progreso': {
    title: 'En Progreso',
    icon: Clock,
    color: 'yellow',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    textColor: 'text-yellow-700'
  },
  'completada': {
    title: 'Completadas',
    icon: CheckCircle,
    color: 'green',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-700'
  }
};

export default function KanbanColumn({
  title,
  estado,
  tareas,
  onToggleCompletada,
  onDelete,
  onEdit,
  onDrop,
  onCrearTarea,
  isLoading = false
}: KanbanColumnProps) {
  const config = columnConfig[estado as keyof typeof columnConfig] || columnConfig.pendiente;
  const Icon = config.icon;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('bg-opacity-20');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('bg-opacity-20');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-opacity-20');
    
    const tareaId = e.dataTransfer.getData('text/plain');
    if (tareaId) {
      onDrop(estado, parseInt(tareaId));
    }
  };

  return (
    <div className="flex-1 min-w-[320px] max-w-[400px]">
      <div className={`rounded-xl border-2 ${config.borderColor} ${config.bgColor} p-4 h-full flex flex-col`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Icon className={`w-5 h-5 ${config.textColor}`} />
            <h2 className={`text-lg font-bold ${config.textColor}`}>
              {title}
            </h2>
            <span className={`px-2 py-1 rounded-full text-xs font-bold bg-white ${config.textColor}`}>
              {tareas.length}
            </span>
          </div>
          
          {estado === 'pendiente' && onCrearTarea && (
            <button
              onClick={onCrearTarea}
              className={`flex items-center gap-1 px-3 py-1 bg-${config.color}-600 text-white rounded-lg hover:bg-${config.color}-700 text-sm font-medium transition-colors`}
            >
              <Plus className="w-4 h-4" />
              Nueva
            </button>
          )}
        </div>

        {/* Content */}
        <div 
          className={`flex-1 space-y-3 min-h-[400px] p-2 rounded-lg border-2 border-dashed border-transparent transition-colors ${
            isLoading ? 'bg-gray-100' : ''
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-400">Cargando...</div>
            </div>
          ) : tareas.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-400 text-center">
              <div>
                <Icon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No hay tareas</p>
              </div>
            </div>
          ) : (
            tareas.map(tarea => (
              <TareaCard
                key={tarea.id}
                tarea={tarea}
                onToggleCompletada={onToggleCompletada}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
} 
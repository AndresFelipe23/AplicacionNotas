import React, { useEffect, useState } from 'react';
import { DndProvider, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { motion, AnimatePresence } from 'framer-motion';
import { Tarea, getTareasKanban, cambiarEstadoTarea, toggleCompletada, eliminarTarea } from '../services/tareaService';
import { confirmDelete, showSuccess, showError } from '../utils/sweetalert';
import { usePapelera } from '../contexts/PapeleraContext';
import TareaCard from '../components/TareaCard';
import CrearTareaModal from '../components/CrearTareaModal';
import EditarTareaModal from '../components/EditarTareaModal';
import { 
  Plus, 
  Target,
  Zap,
  Pause,
  CheckCircle,
  AlertCircle,
  Circle,
  Calendar
} from 'lucide-react';

// Tipos para react-dnd
const ItemTypes = {
  TAREA: 'tarea'
};

interface DragItem {
  id: number;
  type: string;
}

// Componente de columna mejorado
const ColumnContainer = ({ estado, children, onDrop, titulo, icon: Icon, count, showAddButton, onAddClick }: {
  estado: string;
  children: React.ReactNode;
  onDrop: (estado: string, tareaId: number) => void;
  titulo: string;
  icon: any;
  count: number;
  showAddButton?: boolean;
  onAddClick?: () => void;
}) => {
  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.TAREA,
    drop: (item: DragItem) => {
      onDrop(estado, item.id);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const columnColors = {
    pendiente: 'border-blue-200 bg-blue-50/30',
    en_progreso: 'border-amber-200 bg-amber-50/30',
    completada: 'border-green-200 bg-green-50/30'
  };

  return (
    <div
      ref={drop}
      className={`
        flex-1 min-w-[300px] max-w-[380px] bg-slate-50/50 rounded-3xl p-4 transition-all duration-300
        ${isOver ? `border-2 ${columnColors[estado as keyof typeof columnColors]}` : 'border border-slate-200'}
      `}
    >
      {/* Header de columna */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${
            estado === 'pendiente' ? 'bg-blue-100' :
            estado === 'en_progreso' ? 'bg-amber-100' : 'bg-green-100'
          }`}>
            <Icon className={`w-5 h-5 ${
              estado === 'pendiente' ? 'text-blue-600' :
              estado === 'en_progreso' ? 'text-amber-600' : 'text-green-600'
            }`} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{titulo}</h2>
            <p className="text-sm text-slate-500">{count} tareas</p>
          </div>
        </div>
        
        {showAddButton && (
          <button
            onClick={onAddClick}
            className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
            title="Nueva tarea"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Contenido de la columna */}
      <div className="space-y-3 min-h-[400px]">
        {children}
      </div>
    </div>
  );
};

export default function Tareas() {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCrearTareaModal, setShowCrearTareaModal] = useState(false);
  const [showEditarTareaModal, setShowEditarTareaModal] = useState(false);
  const [tareaAEditar, setTareaAEditar] = useState<Tarea | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const { actualizarContador } = usePapelera();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchTareas = async () => {
    setLoading(true);
    try {
      const data = await getTareasKanban();
      setTareas(data);
    } catch (err) {
      console.error('Error al cargar tareas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTareas();
  }, []);

  // Separar tareas por estado
  const tareasPendientes = tareas.filter(t => t.estado === 'pendiente');
  const tareasEnProgreso = tareas.filter(t => t.estado === 'en_progreso');
  const tareasCompletadas = tareas.filter(t => t.estado === 'completada');

  const handleToggleCompletada = async (id: number) => {
    try {
      await toggleCompletada(id);
      await fetchTareas();
    } catch (err) {
      console.error('Error al cambiar estado de completada:', err);
    }
  };

  const handleDelete = async (id: number) => {
    const result = await confirmDelete(
      '¿Eliminar tarea?',
      'La tarea se enviará a la papelera y podrás restaurarla desde allí.'
    );
    if (result.isConfirmed) {
      try {
        await eliminarTarea(id);
        await showSuccess('Tarea eliminada', 'La tarea se ha enviado a la papelera');
        await fetchTareas();
        await actualizarContador();
      } catch (error) {
        console.error('Error al eliminar tarea:', error);
        await showError('Error', 'No se pudo eliminar la tarea');
      }
    }
  };

  const handleEdit = (tarea: Tarea) => {
    setTareaAEditar(tarea);
    setShowEditarTareaModal(true);
  };

  const handleDrop = async (nuevoEstado: string, tareaId: number) => {
    try {
      await cambiarEstadoTarea(tareaId, nuevoEstado);
      await fetchTareas();
    } catch (err) {
      console.error('Error al cambiar estado de la tarea:', err);
    }
  };

  const renderColumn = (estado: string, tareas: Tarea[], titulo: string, Icon: any) => (
    <ColumnContainer 
      estado={estado} 
      onDrop={handleDrop} 
      titulo={titulo} 
      icon={Icon}
      count={tareas.length}
      showAddButton={estado === 'pendiente'}
      onAddClick={() => setShowCrearTareaModal(true)}
    >
      <AnimatePresence>
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="flex items-center gap-2 text-slate-400">
              <div className="w-4 h-4 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin" />
              <span className="text-sm">Cargando...</span>
            </div>
          </div>
        ) : tareas.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-center py-8">
            <Icon className="w-12 h-12 text-slate-200 mb-3" />
            <p className="text-sm text-slate-400 font-medium">No hay tareas</p>
            <p className="text-xs text-slate-300">Las tareas aparecerán aquí</p>
          </div>
        ) : (
          tareas.map((tarea) => (
            <TareaCard
              key={tarea.id}
              tarea={tarea}
              onToggleCompletada={handleToggleCompletada}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))
        )}
      </AnimatePresence>
    </ColumnContainer>
  );

  const totalTareas = tareas.length;
  const tareasVencidas = tareas.filter(t => 
    t.fechaVencimiento && 
    new Date(t.fechaVencimiento) < new Date() && 
    !t.completada
  ).length;

  const completionRate = totalTareas > 0 ? (tareasCompletadas.length / totalTareas) * 100 : 0;
  
  // Nuevas métricas mejoradas
  const tareasEnProgresoCount = tareasEnProgreso.length;
  const tareasPendientesCount = tareasPendientes.length;
  const tareasCompletadasCount = tareasCompletadas.length;
  
  // Tareas con alta prioridad (3-4)
  const tareasAltaPrioridad = tareas.filter(t => t.prioridad >= 3 && !t.completada).length;
  
  // Tareas que vencen hoy
  const hoy = new Date().toISOString().split('T')[0];
  const tareasVencenHoy = tareas.filter(t => 
    t.fechaVencimiento === hoy && !t.completada
  ).length;
  
  // Tareas que vencen esta semana
  const finDeSemana = new Date();
  finDeSemana.setDate(finDeSemana.getDate() + 7);
  const tareasVencenEstaSemana = tareas.filter(t => 
    t.fechaVencimiento && 
    new Date(t.fechaVencimiento) <= finDeSemana && 
    new Date(t.fechaVencimiento) >= new Date() &&
    !t.completada
  ).length;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/20 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header principal */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
                  Gestión de Tareas
                </h1>
                <p className="text-slate-600 text-lg">
                  Organiza tu trabajo y aumenta tu productividad
                </p>
              </div>
              
              {/* Estadísticas mejoradas en el header */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full lg:w-auto">
                {/* Total de tareas */}
                <div className="bg-white rounded-2xl px-4 py-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-xl">
                    <Target className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-600">Total</p>
                      <p className="text-2xl font-bold text-slate-900">{totalTareas}</p>
                    </div>
                  </div>
                </div>
                
                {/* Progreso de completado */}
                <div className="bg-white rounded-2xl px-4 py-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-xl">
                      <Zap className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-600">Completadas</p>
                      <p className="text-2xl font-bold text-green-600">{tareasCompletadasCount}</p>
                      {totalTareas > 0 && (
                        <p className="text-xs text-slate-500">{Math.round(completionRate)}% del total</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* En progreso */}
                <div className="bg-white rounded-2xl px-4 py-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-100 rounded-xl">
                      <Pause className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-600">En Progreso</p>
                      <p className="text-2xl font-bold text-amber-600">{tareasEnProgresoCount}</p>
                    </div>
                  </div>
                </div>

                {/* Pendientes */}
                <div className="bg-white rounded-2xl px-4 py-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded-xl">
                      <Circle className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-600">Pendientes</p>
                      <p className="text-2xl font-bold text-slate-600">{tareasPendientesCount}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Métricas adicionales */}
          <div className="mb-8">
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Alta prioridad */}
              {tareasAltaPrioridad > 0 && (
                <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-2xl px-4 py-3 border border-red-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-200 rounded-xl">
                      <AlertCircle className="w-4 h-4 text-red-700" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-red-700">Alta Prioridad</p>
                      <p className="text-lg font-bold text-red-800">{tareasAltaPrioridad}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Vencen hoy */}
              {tareasVencenHoy > 0 && (
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl px-4 py-3 border border-orange-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-200 rounded-xl">
                      <Calendar className="w-4 h-4 text-orange-700" />
                    </div>
                      <div>
                      <p className="text-sm font-medium text-orange-700">Vencen Hoy</p>
                      <p className="text-lg font-bold text-orange-800">{tareasVencenHoy}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Vencen esta semana */}
              {tareasVencenEstaSemana > 0 && (
                <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-2xl px-4 py-3 border border-yellow-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-200 rounded-xl">
                      <Calendar className="w-4 h-4 text-yellow-700" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-yellow-700">Esta Semana</p>
                      <p className="text-lg font-bold text-yellow-800">{tareasVencenEstaSemana}</p>
                      </div>
                    </div>
                  </div>
                )}

              {/* Vencidas */}
                {tareasVencidas > 0 && (
                <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-2xl px-4 py-3 border border-red-200">
                    <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-200 rounded-xl">
                      <AlertCircle className="w-4 h-4 text-red-700" />
                    </div>
                      <div>
                      <p className="text-sm font-medium text-red-700">Vencidas</p>
                      <p className="text-lg font-bold text-red-800">{tareasVencidas}</p>
                    </div>
                    </div>
                  </div>
                )}

              {/* Barra de progreso general */}
              <div className="bg-white rounded-2xl px-4 py-3 border border-slate-200 shadow-sm col-span-2 lg:col-span-1">
                <div className="text-center">
                  <p className="text-sm font-medium text-slate-600 mb-2">Progreso General</p>
                  <div className="relative">
                    <div className="w-full bg-slate-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${completionRate}%` }}
                      />
                    </div>
                    <p className="text-lg font-bold text-slate-900 mt-1">{Math.round(completionRate)}%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tablero Kanban */}
          <div className={`flex gap-6 ${isMobile ? 'flex-col' : 'overflow-x-auto'} pb-6`}>
            {renderColumn('pendiente', tareasPendientes, 'Pendientes', Target)}
            {renderColumn('en_progreso', tareasEnProgreso, 'En Progreso', Pause)}
            {renderColumn('completada', tareasCompletadas, 'Completadas', CheckCircle)}
          </div>
        </div>

        {/* Modal para crear tarea */}
        <CrearTareaModal
          isOpen={showCrearTareaModal}
          onClose={() => setShowCrearTareaModal(false)}
          onTareaCreated={() => fetchTareas()}
        />

        {/* Modal para editar tarea */}
        <EditarTareaModal
          isOpen={showEditarTareaModal}
          onClose={() => {
            setShowEditarTareaModal(false);
            setTareaAEditar(null);
          }}
          onTareaUpdated={fetchTareas}
          tarea={tareaAEditar}
        />
      </div>
    </DndProvider>
  );
}
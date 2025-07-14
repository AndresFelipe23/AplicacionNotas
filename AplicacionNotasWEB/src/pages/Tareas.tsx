import React, { useEffect, useState } from 'react';
import { DndProvider, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { AnimatePresence } from 'framer-motion';
import type { Tarea } from '../services/tareaService';
import { getTareasKanban, cambiarEstadoTarea, toggleCompletada, eliminarTarea } from '../services/tareaService';
import { confirmDelete, showSuccess, showError } from '../utils/sweetalert';
import { usePapelera } from '../contexts/PapeleraContext';
import TareaCard from '../components/TareaCard';
import CrearTareaModal from '../components/CrearTareaModal';
import EditarTareaModal from '../components/EditarTareaModal';
import { 
  Plus, 
  Circle,
  Clock,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Calendar,
  BarChart3,
  Menu,
  X,
  Activity,
  Zap
} from 'lucide-react';

// Tipos para react-dnd
const ItemTypes = {
  TAREA: 'tarea'
};

interface DragItem {
  id: number;
  type: string;
}

// Componente de columna minimalista
const ColumnContainer = ({ estado, children, onDrop, titulo, count, showAddButton, onAddClick }: {
  estado: string;
  children: React.ReactNode;
  onDrop: (estado: string, tareaId: number) => void;
  titulo: string;
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

  return (
    <div
      ref={drop as unknown as React.RefObject<HTMLDivElement>}
      className={`
        flex-1 min-w-[280px] max-w-[320px] transition-all duration-200
        ${isOver ? 'bg-slate-50 rounded-lg' : ''}
      `}
    >
      {/* Header simple */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${
            estado === 'pendiente' ? 'bg-slate-400' :
            estado === 'en_progreso' ? 'bg-blue-500' : 'bg-green-500'
          }`} />
          <h3 className="font-medium text-slate-700">{titulo}</h3>
          <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
            {count}
          </span>
        </div>
        
        {showAddButton && (
          <button
            onClick={onAddClick}
            className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
            title="Nueva tarea"
          >
            <Plus className="w-3 h-3 text-slate-600" />
          </button>
        )}
      </div>

      {/* Contenido */}
      <div className="space-y-2 min-h-[200px]">
        {children}
      </div>
    </div>
  );
};

export default function MinimalKanban() {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCrearTareaModal, setShowCrearTareaModal] = useState(false);
  const [showEditarTareaModal, setShowEditarTareaModal] = useState(false);
  const [tareaAEditar, setTareaAEditar] = useState<Tarea | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { actualizarContador } = usePapelera();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(false);
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

  const renderColumn = (estado: string, tareas: Tarea[], titulo: string) => (
    <ColumnContainer 
      estado={estado} 
      onDrop={handleDrop} 
      titulo={titulo} 
      count={tareas.length}
      showAddButton={estado === 'pendiente'}
      onAddClick={() => setShowCrearTareaModal(true)}
    >
      <AnimatePresence>
        {loading ? (
          <div className="flex items-center justify-center h-24">
            <div className="w-4 h-4 border border-slate-200 border-t-slate-400 rounded-full animate-spin" />
          </div>
        ) : tareas.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-24 text-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
              estado === 'pendiente' ? 'bg-slate-100' :
              estado === 'en_progreso' ? 'bg-blue-50' : 'bg-green-50'
            }`}>
              {estado === 'pendiente' ? <Circle className="w-4 h-4 text-slate-400" /> :
               estado === 'en_progreso' ? <Clock className="w-4 h-4 text-blue-400" /> :
               <CheckCircle2 className="w-4 h-4 text-green-400" />}
            </div>
            <p className="text-xs text-slate-400">Sin tareas</p>
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

  // Métricas calculadas
  const totalTareas = tareas.length;
  const completionRate = totalTareas > 0 ? (tareasCompletadas.length / totalTareas) * 100 : 0;
  
  const tareasVencidas = tareas.filter(t => 
    t.fechaVencimiento && 
    new Date(t.fechaVencimiento) < new Date() && 
    !t.completada
  ).length;

  const tareasAltaPrioridad = tareas.filter(t => t.prioridad >= 3 && !t.completada).length;
  
  const hoy = new Date().toISOString().split('T')[0];
  const tareasVencenHoy = tareas.filter(t => 
    t.fechaVencimiento === hoy && !t.completada
  ).length;

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
      <div className="min-h-screen bg-white flex">
        {/* Overlay móvil */}
        {isMobile && sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`
          ${isMobile ? 'fixed' : 'relative'} top-0 left-0 z-50 h-full
          bg-slate-50 border-r border-slate-200 flex flex-col
          transition-all duration-300 ease-in-out
          ${isMobile 
            ? (sidebarOpen ? 'translate-x-0 w-80' : '-translate-x-full w-80')
            : 'w-80'
          }
        `}>
          {/* Header del sidebar */}
          <div className="p-6 border-b border-slate-200 shrink-0">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Panel de Control</h2>
                <p className="text-sm text-slate-500">Resumen de tareas</p>
              </div>
              {isMobile && (
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <X className="w-4 h-4 text-slate-600" />
                </button>
              )}
            </div>
            
            {/* Botón Nueva tarea en el header */}
            <button
              onClick={() => setShowCrearTareaModal(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Nueva tarea
            </button>
          </div>

          {/* Contenido del sidebar con scroll */}
          <div className="flex-1 overflow-y-auto min-h-0">
            <div className="p-6 space-y-6">
              {/* Progreso general */}
              <div className="bg-white rounded-lg p-4 border border-slate-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900">Progreso General</h3>
                    <p className="text-sm text-slate-500">{totalTareas} tareas totales</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Completado</span>
                    <span className="font-medium text-slate-900">{Math.round(completionRate)}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${completionRate}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Estados de tareas */}
              <div className="space-y-3">
                <h3 className="font-medium text-slate-900 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Estados
                </h3>
                
                <div className="space-y-2">
                  <div className="bg-white rounded-lg p-3 border border-slate-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-slate-400 rounded-full" />
                        <span className="text-sm text-slate-600">Por hacer</span>
                      </div>
                      <span className="font-semibold text-slate-900">{tareasPendientes.length}</span>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-3 border border-slate-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        <span className="text-sm text-slate-600">En progreso</span>
                      </div>
                      <span className="font-semibold text-blue-600">{tareasEnProgreso.length}</span>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-3 border border-slate-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <span className="text-sm text-slate-600">Completadas</span>
                      </div>
                      <span className="font-semibold text-green-600">{tareasCompletadas.length}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Alertas */}
              {(tareasVencidas > 0 || tareasAltaPrioridad > 0 || tareasVencenHoy > 0) && (
                <div className="space-y-3">
                  <h3 className="font-medium text-slate-900 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Alertas
                  </h3>
                  
                  <div className="space-y-2">
                    {tareasVencidas > 0 && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="w-3 h-3 text-red-500" />
                            <span className="text-sm text-red-700">Vencidas</span>
                          </div>
                          <span className="font-semibold text-red-700">{tareasVencidas}</span>
                        </div>
                      </div>
                    )}
                    
                    {tareasVencenHoy > 0 && (
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3 h-3 text-orange-500" />
                            <span className="text-sm text-orange-700">Vencen hoy</span>
                          </div>
                          <span className="font-semibold text-orange-700">{tareasVencenHoy}</span>
                        </div>
                      </div>
                    )}
                    
                    {tareasAltaPrioridad > 0 && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Zap className="w-3 h-3 text-yellow-600" />
                            <span className="text-sm text-yellow-700">Alta prioridad</span>
                          </div>
                          <span className="font-semibold text-yellow-700">{tareasAltaPrioridad}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Próximas fechas */}
              {tareasVencenEstaSemana > 0 && (
                <div className="bg-white rounded-lg p-4 border border-slate-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Calendar className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-900">Esta Semana</h3>
                      <p className="text-sm text-slate-500">Tareas por vencer</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <span className="text-2xl font-bold text-purple-600">{tareasVencenEstaSemana}</span>
                    <p className="text-xs text-slate-500">próximas a vencer</p>
                  </div>
                </div>
              )}

              {/* Estadísticas adicionales */}
              <div className="space-y-3">
                <h3 className="font-medium text-slate-900 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Estadísticas
                </h3>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white rounded-lg p-3 border border-slate-200 text-center">
                    <p className="text-lg font-bold text-slate-900">{totalTareas}</p>
                    <p className="text-xs text-slate-500">Total</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-slate-200 text-center">
                    <p className="text-lg font-bold text-green-600">{tareasCompletadas.length}</p>
                    <p className="text-xs text-slate-500">Terminadas</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Contenido principal */}
        <main className="flex-1 flex flex-col">
          {/* Header principal */}
          <header className="bg-white border-b border-slate-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {isMobile && (
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <Menu className="w-5 h-5 text-slate-600" />
                  </button>
                )}
                <div>
                  <h1 className="text-xl font-semibold text-slate-900">
                    Tablero Kanban
                  </h1>
                  <p className="text-sm text-slate-500">
                    Gestiona tus tareas de forma visual
                  </p>
                </div>
              </div>
              
              {!isMobile && (
                <button
                  onClick={() => setShowCrearTareaModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Nueva tarea
                </button>
              )}
            </div>
          </header>

          {/* Área del tablero */}
          <div className="flex-1 p-6 overflow-x-auto">
            <div className="flex gap-6 min-w-fit">
              {renderColumn('pendiente', tareasPendientes, 'Por hacer')}
              {renderColumn('en_progreso', tareasEnProgreso, 'En progreso')}
              {renderColumn('completada', tareasCompletadas, 'Completadas')}
            </div>
          </div>
        </main>

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
import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { es } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { 
  getTareasKanban, 
  crearTarea
} from '../services/tareaService';
import type { Tarea, CrearTareaDto } from '../services/tareaService';
import { showSuccess, showError } from '../utils/sweetalert';
import CrearTareaModal from '../components/CrearTareaModal';
import EditarTareaModal from '../components/EditarTareaModal';
import DetalleTareaModal from '../components/DetalleTareaModal';
import { 
  Calendar as CalendarIconComponent,
  Filter,
  Plus,
  Target,
  Pause,
  CheckCircle,
  AlertCircle,
  Menu,
  X,
  BarChart3,
  Activity
} from 'lucide-react';

// Configuración del localizador para español
const locales = {
  'es': es,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Tipos para el calendario
interface CalendarEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  resource: Tarea;
  backgroundColor?: string;
  borderColor?: string;
}

export default function MinimalCalendar() {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCrearTareaModal, setShowCrearTareaModal] = useState(false);
  const [showEditarTareaModal, setShowEditarTareaModal] = useState(false);
  const [showDetalleTareaModal, setShowDetalleTareaModal] = useState(false);
  const [tareaAEditar, setTareaAEditar] = useState<Tarea | null>(null);
  const [tareaDetalle, setTareaDetalle] = useState<Tarea | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [filtros, setFiltros] = useState({
    pendiente: true,
    en_progreso: true,
    completada: true,
    altaPrioridad: false,
    vencidas: false
  });

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

  // Colores por estado y prioridad
  const getEventColors = (tarea: Tarea) => {
    const priorityColors = {
      1: { bg: '#64748b', border: '#475569' },
      2: { bg: '#3b82f6', border: '#2563eb' },
      3: { bg: '#f59e0b', border: '#d97706' },
      4: { bg: '#ef4444', border: '#dc2626' }
    };

    const priorityColor = priorityColors[tarea.prioridad];

    return {
      backgroundColor: priorityColor.bg,
      borderColor: priorityColor.border
    };
  };

  // Convertir tareas a eventos del calendario
  const convertTareasToEvents = useCallback((tareasData: Tarea[]): CalendarEvent[] => {
    return tareasData
      .filter(tarea => {
        // Aplicar filtros
        if (!filtros[tarea.estado as keyof typeof filtros]) return false;
        if (filtros.altaPrioridad && tarea.prioridad < 3) return false;
        if (filtros.vencidas) {
          return tarea.fechaVencimiento && new Date(tarea.fechaVencimiento) < new Date();
        }
        return true;
      })
      .map(tarea => {
        const fechaVencimiento = tarea.fechaVencimiento ? new Date(tarea.fechaVencimiento) : new Date();
        const colors = getEventColors(tarea);
        
        return {
          id: tarea.id,
          title: tarea.titulo,
          start: fechaVencimiento,
          end: fechaVencimiento,
          resource: tarea,
          backgroundColor: colors.backgroundColor,
          borderColor: colors.borderColor
        };
      });
  }, [filtros]);

  // Cargar tareas
  const fetchTareas = async () => {
    setLoading(true);
    try {
      const data = await getTareasKanban();
      setTareas(data);
      const calendarEvents = convertTareasToEvents(data);
      setEvents(calendarEvents);
    } catch (err) {
      console.error('Error al cargar tareas:', err);
      await showError('Error', 'No se pudieron cargar las tareas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTareas();
  }, [convertTareasToEvents]);

  // Manejar selección de evento
  const handleSelectEvent = (event: CalendarEvent) => {
    setTareaDetalle(event.resource);
    setShowDetalleTareaModal(true);
  };

  // Manejar selección de slot (fecha)
  const handleSelectSlot = ({ start }: { start: Date }) => {
    setSelectedDate(start);
    setShowCrearTareaModal(true);
  };

  // Manejar cambio de filtros
  const handleFilterChange = (filterKey: keyof typeof filtros) => {
    setFiltros(prev => ({
      ...prev,
      [filterKey]: !prev[filterKey]
    }));
  };

  // Crear tarea desde el calendario
  const handleTareaCreated = async (tareaData: CrearTareaDto) => {
    if (selectedDate) {
      tareaData.fechaVencimiento = selectedDate.toISOString().split('T')[0];
    }
    try {
      await crearTarea(tareaData);
      await showSuccess('Tarea creada', 'La tarea se ha creado exitosamente');
      await fetchTareas();
      setShowCrearTareaModal(false);
      setSelectedDate(null);
    } catch (error) {
      console.error('Error al crear tarea:', error);
      await showError('Error', 'No se pudo crear la tarea');
    }
  };

  // Manejar edición desde el modal de detalle
  const handleEditFromDetail = (tarea: Tarea) => {
    setTareaAEditar(tarea);
    setShowEditarTareaModal(true);
    setShowDetalleTareaModal(false);
  };

  // Manejar eliminación desde el modal de detalle
  const handleDeleteFromDetail = async () => {
    await fetchTareas();
  };

  // Componente personalizado para eventos
  const EventComponent = ({ event }: { event: CalendarEvent }) => (
    <div className="text-xs p-1">
      <div className="font-medium truncate">{event.title}</div>
    </div>
  );

  // Métricas calculadas
  const totalEventos = events.length;
  const completadas = events.filter(e => e.resource.completada).length;
  const enProgreso = events.filter(e => e.resource.estado === 'en_progreso').length;
  const altaPrioridad = events.filter(e => e.resource.prioridad >= 3).length;

  return (
    <div className="h-full bg-white flex">
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
              <p className="text-sm text-slate-500">Filtros y estadísticas</p>
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
          
          {/* Botón Nueva tarea */}
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
            {/* Filtros */}
            <div className="space-y-3">
              <h3 className="font-medium text-slate-900 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filtros
              </h3>
              
              <div className="space-y-2">
                <button
                  onClick={() => handleFilterChange('pendiente')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                    filtros.pendiente 
                      ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                      : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Target className="w-3 h-3" />
                    <span>Pendientes</span>
                  </div>
                </button>
                
                <button
                  onClick={() => handleFilterChange('en_progreso')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                    filtros.en_progreso 
                      ? 'bg-amber-100 text-amber-700 border border-amber-200' 
                      : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Pause className="w-3 h-3" />
                    <span>En progreso</span>
                  </div>
                </button>
                
                <button
                  onClick={() => handleFilterChange('completada')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                    filtros.completada 
                      ? 'bg-green-100 text-green-700 border border-green-200' 
                      : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3" />
                    <span>Completadas</span>
                  </div>
                </button>
                
                <button
                  onClick={() => handleFilterChange('altaPrioridad')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                    filtros.altaPrioridad 
                      ? 'bg-red-100 text-red-700 border border-red-200' 
                      : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-3 h-3" />
                    <span>Alta prioridad</span>
                  </div>
                </button>
                
                <button
                  onClick={() => handleFilterChange('vencidas')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                    filtros.vencidas 
                      ? 'bg-orange-100 text-orange-700 border border-orange-200' 
                      : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <CalendarIconComponent className="w-3 h-3" />
                    <span>Vencidas</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Estadísticas */}
            <div className="space-y-3">
              <h3 className="font-medium text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Estadísticas
              </h3>
              
              <div className="space-y-2">
                <div className="bg-white rounded-lg p-3 border border-slate-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <span className="text-sm text-slate-600">Total eventos</span>
                    </div>
                    <span className="font-semibold text-slate-900">{totalEventos}</span>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-3 border border-slate-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-sm text-slate-600">Completadas</span>
                    </div>
                    <span className="font-semibold text-green-600">{completadas}</span>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-3 border border-slate-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-amber-500 rounded-full" />
                      <span className="text-sm text-slate-600">En progreso</span>
                    </div>
                    <span className="font-semibold text-amber-600">{enProgreso}</span>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-3 border border-slate-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full" />
                      <span className="text-sm text-slate-600">Alta prioridad</span>
                    </div>
                    <span className="font-semibold text-red-600">{altaPrioridad}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Progreso */}
            {totalEventos > 0 && (
              <div className="bg-white rounded-lg p-4 border border-slate-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Activity className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900">Progreso</h3>
                    <p className="text-sm text-slate-500">Tareas completadas</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Completado</span>
                    <span className="font-medium text-slate-900">
                      {Math.round((completadas / totalEventos) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(completadas / totalEventos) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
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
                  Calendario
                </h1>
                <p className="text-sm text-slate-500">
                  Visualiza y gestiona tus tareas
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

        {/* Área del calendario */}
        <div className="flex-1 p-0">
          <div className="bg-white overflow-hidden h-full">
            {loading ? (
              <div className="flex items-center justify-center h-96">
                <div className="flex items-center gap-3 text-slate-500">
                  <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
                  <span>Cargando calendario...</span>
                </div>
              </div>
            ) : (
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ 
                  height: isMobile ? 500 : 600,
                  minHeight: isMobile ? 500 : 600 
                }}
                onSelectEvent={handleSelectEvent}
                onSelectSlot={handleSelectSlot}
                selectable
                popup
                tooltipAccessor={(event) => `${event.title} - ${event.resource.descripcion || 'Sin descripción'}`}
                components={{
                  event: EventComponent
                }}
                views={isMobile ? ['month', 'agenda'] : ['month', 'week', 'day', 'agenda']}
                defaultView="month"
                step={60}
                timeslots={1}
                messages={{
                  next: "Siguiente",
                  previous: "Anterior",
                  today: "Hoy",
                  month: "Mes",
                  week: "Semana",
                  day: "Día",
                  agenda: "Agenda",
                  noEventsInRange: "No hay tareas en este período",
                  showMore: (total: number) => `+ ${total} más`
                }}
                className="minimal-calendar"
              />
            )}
          </div>
        </div>
      </main>

      {/* Modales */}
      <CrearTareaModal
        isOpen={showCrearTareaModal}
        onClose={() => {
          setShowCrearTareaModal(false);
          setSelectedDate(null);
        }}
        onTareaCreated={handleTareaCreated}
        fechaPreseleccionada={selectedDate}
      />

      <EditarTareaModal
        isOpen={showEditarTareaModal}
        onClose={() => {
          setShowEditarTareaModal(false);
          setTareaAEditar(null);
        }}
        onTareaUpdated={fetchTareas}
        tarea={tareaAEditar}
      />

      <DetalleTareaModal
        isOpen={showDetalleTareaModal}
        onClose={() => {
          setShowDetalleTareaModal(false);
          setTareaDetalle(null);
        }}
        tarea={tareaDetalle}
        onEdit={handleEditFromDetail}
        onTareaDeleted={handleDeleteFromDetail}
      />

      {/* Estilos minimalistas */}
      <style>{`
        .minimal-calendar .rbc-calendar {
          font-family: inherit;
          font-size: 14px;
        }
        
        .minimal-calendar .rbc-header {
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
          padding: 12px 8px;
          font-weight: 600;
          color: #475569;
          font-size: 0.875rem;
        }
        
        .minimal-calendar .rbc-event {
          border-radius: 6px;
          border: none;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          font-weight: 500;
          font-size: 0.75rem;
          padding: 2px 6px;
          margin: 1px;
          transition: all 0.2s ease;
        }
        
        .minimal-calendar .rbc-event:hover {
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }
        
        .minimal-calendar .rbc-today {
          background: #f0f9ff;
          border: 1px solid #0ea5e9;
        }
        
        .minimal-calendar .rbc-off-range-bg {
          background: #f8fafc;
        }
        
        .minimal-calendar .rbc-toolbar {
          padding: 16px;
          background: white;
          border-bottom: 1px solid #e2e8f0;
          margin-bottom: 0;
        }
        
        .minimal-calendar .rbc-toolbar button {
          border-radius: 6px;
          border: 1px solid #d1d5db;
          background: white;
          color: #374151;
          padding: 8px 16px;
          font-weight: 500;
          font-size: 0.875rem;
          transition: all 0.2s ease;
          margin: 0 2px;
        }
        
        .minimal-calendar .rbc-toolbar button:hover {
          background: #f9fafb;
          border-color: #9ca3af;
        }
        
        .minimal-calendar .rbc-toolbar button.rbc-active {
          background: #1f2937;
          color: white;
          border-color: #1f2937;
        }
        
        .minimal-calendar .rbc-toolbar button.rbc-active:hover {
          background: #111827;
        }
        
        .minimal-calendar .rbc-month-view {
          border: none;
        }
        
        .minimal-calendar .rbc-month-row {
          border-bottom: 1px solid #f1f5f9;
        }
        
        .minimal-calendar .rbc-date-cell {
          padding: 6px 8px;
          font-weight: 500;
          color: #64748b;
        }
        
        .minimal-calendar .rbc-date-cell.rbc-now {
          background: #1f2937;
          color: white;
          border-radius: 6px;
          font-weight: 600;
        }
        
        .minimal-calendar .rbc-agenda-view table.rbc-agenda-table thead > tr > th {
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
          padding: 12px 16px;
          font-weight: 600;
          color: #475569;
          font-size: 0.875rem;
        }
        
        .minimal-calendar .rbc-agenda-view table.rbc-agenda-table tbody > tr > td {
          padding: 12px 16px;
          border-bottom: 1px solid #f1f5f9;
          vertical-align: top;
        }
        
        .minimal-calendar .rbc-agenda-view table.rbc-agenda-table tbody > tr:hover > td {
          background-color: #f8fafc;
        }
        
        @media (max-width: 768px) {
          .minimal-calendar .rbc-toolbar {
            padding: 12px;
            flex-direction: column;
            gap: 8px;
            align-items: stretch;
          }
          
          .minimal-calendar .rbc-toolbar .rbc-toolbar-label {
            text-align: center;
            font-size: 1rem;
            font-weight: 600;
            margin: 8px 0;
          }
          
          .minimal-calendar .rbc-btn-group {
            display: flex;
            justify-content: center;
            gap: 4px;
          }
          
          .minimal-calendar .rbc-toolbar button {
            padding: 6px 12px;
            font-size: 0.75rem;
          }
          
          .minimal-calendar .rbc-header {
            padding: 8px 4px;
            font-size: 0.75rem;
          }
          
          .minimal-calendar .rbc-date-cell {
            padding: 4px 6px;
            font-size: 0.875rem;
          }
          
          .minimal-calendar .rbc-event {
            font-size: 0.65rem;
            padding: 1px 4px;
          }
        }
      `}</style>
    </div>
  );
}
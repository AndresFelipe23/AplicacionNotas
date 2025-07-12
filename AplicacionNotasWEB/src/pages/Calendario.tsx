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
  Calendar as CalendarIcon,
  Filter,
  Plus,
  Target,
  Pause,
  CheckCircle,
  AlertCircle
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

export default function Calendario() {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCrearTareaModal, setShowCrearTareaModal] = useState(false);
  const [showEditarTareaModal, setShowEditarTareaModal] = useState(false);
  const [showDetalleTareaModal, setShowDetalleTareaModal] = useState(false);
  const [tareaAEditar, setTareaAEditar] = useState<Tarea | null>(null);
  const [tareaDetalle, setTareaDetalle] = useState<Tarea | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [filtros, setFiltros] = useState({
    pendiente: true,
    en_progreso: true,
    completada: true,
    altaPrioridad: false,
    vencidas: false
  });

  // Colores por estado y prioridad
  const getEventColors = (tarea: Tarea) => {
    const priorityColors = {
      1: { bg: '#6B7280', border: '#4B5563' },
      2: { bg: '#3B82F6', border: '#2563EB' },
      3: { bg: '#F59E0B', border: '#D97706' },
      4: { bg: '#EF4444', border: '#DC2626' }
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
        if (filtros.vencidas && tarea.fechaVencimiento && new Date(tarea.fechaVencimiento) >= new Date()) return false;
        if (!filtros.vencidas && tarea.fechaVencimiento && new Date(tarea.fechaVencimiento) < new Date()) return false;
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
    <div className="p-1 text-xs">
      <div className="font-medium truncate">{event.title}</div>
      <div className="flex items-center gap-1 mt-1">
        <div 
          className="w-2 h-2 rounded-full" 
          style={{ backgroundColor: event.borderColor }}
        />
        <span className="text-xs opacity-75">
          {event.resource.prioridad === 1 ? 'Baja' :
           event.resource.prioridad === 2 ? 'Media' :
           event.resource.prioridad === 3 ? 'Alta' : 'Urgente'}
        </span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/20">
      {/* Header mejorado */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
                Calendario de Tareas
              </h1>
              <p className="text-slate-600 text-lg">
                Visualiza y gestiona tus tareas en el tiempo
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowCrearTareaModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl hover:from-blue-700 hover:to-blue-800 transition-all font-medium flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Plus className="w-5 h-5" />
                Nueva Tarea
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Filtros compactos */}
        <div className="mb-8">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-xl">
                <Filter className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-900 text-lg">Filtros</h3>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <button
                onClick={() => handleFilterChange('pendiente')}
                className={`flex items-center gap-2 px-4 py-3 rounded-2xl border-2 transition-all font-medium ${
                  filtros.pendiente 
                    ? 'bg-blue-50 border-blue-300 text-blue-700 shadow-sm' 
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-100'
                }`}
              >
                <Target className="w-4 h-4" />
                <span className="text-sm">Pendientes</span>
              </button>

              <button
                onClick={() => handleFilterChange('en_progreso')}
                className={`flex items-center gap-2 px-4 py-3 rounded-2xl border-2 transition-all font-medium ${
                  filtros.en_progreso 
                    ? 'bg-amber-50 border-amber-300 text-amber-700 shadow-sm' 
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-100'
                }`}
              >
                <Pause className="w-4 h-4" />
                <span className="text-sm">En Progreso</span>
              </button>

              <button
                onClick={() => handleFilterChange('completada')}
                className={`flex items-center gap-2 px-4 py-3 rounded-2xl border-2 transition-all font-medium ${
                  filtros.completada 
                    ? 'bg-green-50 border-green-300 text-green-700 shadow-sm' 
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-100'
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">Completadas</span>
              </button>

              <button
                onClick={() => handleFilterChange('altaPrioridad')}
                className={`flex items-center gap-2 px-4 py-3 rounded-2xl border-2 transition-all font-medium ${
                  filtros.altaPrioridad 
                    ? 'bg-red-50 border-red-300 text-red-700 shadow-sm' 
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-100'
                }`}
              >
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">Alta Prioridad</span>
              </button>

              <button
                onClick={() => handleFilterChange('vencidas')}
                className={`flex items-center gap-2 px-4 py-3 rounded-2xl border-2 transition-all font-medium ${
                  filtros.vencidas 
                    ? 'bg-orange-50 border-orange-300 text-orange-700 shadow-sm' 
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-100'
                }`}
              >
                <CalendarIcon className="w-4 h-4" />
                <span className="text-sm">Vencidas</span>
              </button>
            </div>
          </div>
        </div>

        {/* Calendario principal */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <div className="flex items-center gap-4 text-slate-500">
                <div className="w-8 h-8 border-3 border-slate-300 border-t-blue-600 rounded-full animate-spin" />
                <span className="text-lg">Cargando calendario...</span>
              </div>
            </div>
          ) : (
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 700, minHeight: 700 }}
              onSelectEvent={handleSelectEvent}
              onSelectSlot={handleSelectSlot}
              selectable
              popup
              tooltipAccessor={(event) => `${event.title} - ${event.resource.descripcion || 'Sin descripción'}`}
              components={{
                event: EventComponent
              }}
              views={['month', 'week', 'day', 'agenda']}
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
              className="custom-calendar"
            />
          )}
        </div>

        {/* Estadísticas rápidas */}
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-xl">
                <Target className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Total Tareas</p>
                <p className="text-2xl font-bold text-slate-900">{events.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-xl">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Completadas</p>
                <p className="text-2xl font-bold text-green-600">
                  {events.filter(e => e.resource.completada).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-xl">
                <Pause className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">En Progreso</p>
                <p className="text-2xl font-bold text-amber-600">
                  {events.filter(e => e.resource.estado === 'en_progreso').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-xl">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Alta Prioridad</p>
                <p className="text-2xl font-bold text-red-600">
                  {events.filter(e => e.resource.prioridad >= 3).length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

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

      {/* Estilos personalizados mejorados */}
      <style>{`
        .custom-calendar .rbc-calendar {
          font-family: inherit;
        }
        
        .custom-calendar .rbc-header {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          border-bottom: 2px solid #e2e8f0;
          padding: 16px 12px;
          font-weight: 700;
          color: #1e293b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-size: 0.875rem;
        }
        
        .custom-calendar .rbc-event {
          border-radius: 12px;
          border: none;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          font-weight: 600;
          font-size: 0.875rem;
          padding: 4px 8px;
          margin: 1px;
          transition: all 0.2s ease;
        }
        
        .custom-calendar .rbc-event:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
        }
        
        .custom-calendar .rbc-today {
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
          border: 2px solid #3b82f6;
        }
        
        .custom-calendar .rbc-off-range-bg {
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
        }
        
        .custom-calendar .rbc-toolbar {
          padding: 20px 24px;
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
          border-bottom: 1px solid #e2e8f0;
        }
        
        .custom-calendar .rbc-toolbar button {
          border-radius: 12px;
          border: 2px solid #d1d5db;
          background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%);
          color: #374151;
          padding: 10px 20px;
          font-weight: 600;
          font-size: 0.875rem;
          transition: all 0.2s ease;
          margin: 0 4px;
        }
        
        .custom-calendar .rbc-toolbar button:hover {
          background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
          border-color: #9ca3af;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .custom-calendar .rbc-toolbar button.rbc-active {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
          border-color: #3b82f6;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }
        
        .custom-calendar .rbc-toolbar button.rbc-active:hover {
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
        }
        
        .custom-calendar .rbc-month-view {
          border-radius: 0 0 24px 24px;
          overflow: hidden;
        }
        
        .custom-calendar .rbc-month-row {
          border-bottom: 1px solid #e2e8f0;
        }
        
        .custom-calendar .rbc-date-cell {
          padding: 8px 12px;
          font-weight: 500;
        }
        
        .custom-calendar .rbc-date-cell.rbc-now {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
          border-radius: 8px;
          font-weight: 700;
        }
        
        .custom-calendar .rbc-week-view,
        .custom-calendar .rbc-day-view {
          border-radius: 0 0 24px 24px;
          overflow: hidden;
        }
        
        .custom-calendar .rbc-time-header {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          border-bottom: 2px solid #e2e8f0;
        }
        
        .custom-calendar .rbc-time-header-content {
          border-left: 1px solid #e2e8f0;
        }
        
        .custom-calendar .rbc-time-content {
          border-top: 1px solid #e2e8f0;
        }
        
        .custom-calendar .rbc-time-gutter {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          border-right: 1px solid #e2e8f0;
        }
        
        .custom-calendar .rbc-time-slot {
          border-bottom: 1px solid #f1f5f9;
        }
        
        .custom-calendar .rbc-timeslot-group {
          border-bottom: 1px solid #e2e8f0;
        }
        
        .custom-calendar .rbc-agenda-view {
          border-radius: 0 0 24px 24px;
          overflow: hidden;
        }
        
        .custom-calendar .rbc-agenda-view table.rbc-agenda-table {
          border-radius: 0 0 24px 24px;
          width: 100%;
        }
        
        .custom-calendar .rbc-agenda-view table.rbc-agenda-table thead > tr > th {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          border-bottom: 2px solid #e2e8f0;
          padding: 12px 16px;
          font-weight: 700;
          color: #1e293b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-size: 0.875rem;
        }
        
        .custom-calendar .rbc-agenda-view table.rbc-agenda-table tbody > tr > td {
          padding: 12px 16px;
          border-bottom: 1px solid #e2e8f0;
          vertical-align: top;
        }
        
        .custom-calendar .rbc-agenda-view table.rbc-agenda-table tbody > tr:hover > td {
          background-color: #f8fafc;
        }
        
        .custom-calendar .rbc-agenda-view table.rbc-agenda-table tbody > tr > td.rbc-agenda-time {
          font-weight: 600;
          color: #3b82f6;
        }
        
        .custom-calendar .rbc-agenda-view table.rbc-agenda-table tbody > tr > td.rbc-agenda-event {
          font-weight: 500;
        }
        
        .custom-calendar .rbc-agenda-view table.rbc-agenda-table tbody > tr > td.rbc-agenda-date {
          font-weight: 600;
          color: #64748b;
        }
      `}</style>
    </div>
  );
} 
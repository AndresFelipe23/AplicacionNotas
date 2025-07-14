import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Plus, 
  BarChart3,
  Settings,
  Menu,
  X,
  Edit3,
  TrendingUp,
  Save,
  FileText
} from 'lucide-react';
import { usePinDiario } from '../contexts/PinDiarioContext';
import { diarioService } from '../services/diarioService';
import type { DiarioEntrada, CrearEntradaDiario } from '../services/diarioService';
import { CrearPinModal } from '../components/CrearPinModal';
import { VerificarPinModal } from '../components/VerificarPinModal';
import CrearEntradaDiarioModal from '../components/CrearEntradaDiarioModal';
import Swal from 'sweetalert2';
import TinyMCEEditor from '../components/TinyMCEEditor';

export const Diario: React.FC = () => {
  const { 
    isPinAuthenticated, 
    hasPin, 
    isLoading: pinLoading, 
    authenticatePin, 
    createPin, 
    logout
  } = usePinDiario();

  const navigate = useNavigate();

  const [entradas, setEntradas] = useState<DiarioEntrada[]>([]);
  const [entradaActual, setEntradaActual] = useState<DiarioEntrada | null>(null);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCrearPin, setShowCrearPin] = useState(false);
  const [showEstadisticas, setShowEstadisticas] = useState(false);
  const [estadisticas, setEstadisticas] = useState<any>(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [showCrearModal, setShowCrearModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [modalInitialData, setModalInitialData] = useState<Partial<CrearEntradaDiario> | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitulo, setEditTitulo] = useState('');
  const [editContenido, setEditContenido] = useState('');
  const [editEstadoAnimo, setEditEstadoAnimo] = useState<number | undefined>(undefined);

  // Obtener mes y año actuales
  const today = new Date();
  const [mes, setMes] = useState(today.getMonth() + 1);
  const [año, setAño] = useState(today.getFullYear());

  const estadosAnimo = [
    { valor: 1, nombre: "Muy mal", emoji: "😢", color: "#EF4444" },
    { valor: 2, nombre: "Mal", emoji: "😔", color: "#F97316" },
    { valor: 3, nombre: "Regular", emoji: "😐", color: "#F59E0B" },
    { valor: 4, nombre: "Bien", emoji: "😊", color: "#10B981" },
    { valor: 5, nombre: "Excelente", emoji: "😁", color: "#22C55E" }
  ];

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

  useEffect(() => {
    diarioService.setOnUnauthorized(() => navigate('/'));
    localStorage.removeItem('diarioPinAuthenticated');
    if (typeof logout === 'function') {
      logout();
    }
  }, []);

  useEffect(() => {
    cargarEntradas();
    // eslint-disable-next-line
  }, [mes, año]);

  useEffect(() => {
    if (hasPin && !isPinAuthenticated && !pinLoading) {
      // setShowVerificarPin(true); // No usado
    }
  }, [hasPin, isPinAuthenticated, pinLoading]);

  // Función para cargar entradas
  const cargarEntradas = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await diarioService.getEntradas(mes, año);
      setEntradas(data);
    } catch (err: unknown) {
      setError('Error al obtener entradas del diario');
    } finally {
      setIsLoading(false);
    }
  };

  // Cuando cambia la fecha seleccionada, cargar la entrada de ese día
  useEffect(() => {
    const fetchEntrada = async () => {
      try {
        if (!fechaSeleccionada || isNaN(fechaSeleccionada.getTime())) {
          setEntradaActual(null);
          return;
        }
        const fecha = fechaSeleccionada.toISOString().split('T')[0];
        if (fecha === '0001-01-01') {
          setEntradaActual(null);
          return;
        }
        const entrada = await diarioService.getEntrada(fecha);
        setEntradaActual(entrada);
      } catch (err: unknown) {
        setEntradaActual(null);
      }
    };
    fetchEntrada();
  }, [fechaSeleccionada, entradas]);

  // Guardar entrada (crear o editar)
  const guardarEntrada = async (formData: Omit<CrearEntradaDiario, 'fechaEntrada'>) => {
    setIsLoading(true);
    setError('');
    try {
      let nueva: DiarioEntrada | undefined;
      if (isEditMode && entradaActual) {
        // Actualizar entrada existente
        nueva = await diarioService.actualizarEntrada(
          fechaSeleccionada.toISOString().split('T')[0],
          formData
        );
        setEntradaActual(nueva);
        setEntradas(
          entradas.map(e =>
            e.fechaEntrada === nueva?.fechaEntrada ? nueva! : e
          )
        );
      } else {
        // Crear nueva entrada
        nueva = await diarioService.crearEntrada({
          ...formData,
          fechaEntrada: fechaSeleccionada.toISOString().split('T')[0],
        });
        setEntradas([nueva, ...entradas]);
        setEntradaActual(nueva);
      }
      setSuccessMsg('¡Entrada guardada exitosamente!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: unknown) {
      // Detecta error 409 (Conflict)
      if (err && (err as any).status === 409) {
        Swal.fire({
          icon: 'warning',
          title: 'Ya existe una entrada',
          text: 'No puedes crear dos entradas para el mismo día.',
          confirmButtonText: 'Aceptar'
        });
      } else {
        setError('Error al guardar entrada del diario');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const cargarEstadisticas = async () => {
    try {
      const mes = fechaSeleccionada.getMonth() + 1;
      const año = fechaSeleccionada.getFullYear();
      const stats = await diarioService.getEstadisticas(mes, año);
      setEstadisticas(stats);
      setShowEstadisticas(true);
    } catch (err: unknown) {
      setError('Error al cargar estadísticas');
    }
  };

  const handleCrearPin = async (pin: string) => {
    await createPin(pin);
    setShowCrearPin(false);
  };

  const handleVerificarPin = async (pin: string) => {
    const isValid = await authenticatePin(pin);
    if (isValid) {
      // setShowVerificarPin(false); // No usado
    }
    return isValid;
  };

  const handleClosePinModal = (reason?: 'success' | 'cancel') => {
    if (reason === 'cancel') {
      navigate('/home');
    }
  };

  // Cuando se hace clic en Editar
  const handleEdit = () => {
    if (entradaActual) {
      setEditTitulo(entradaActual.titulo || '');
      setEditContenido(entradaActual.contenido || '');
      setEditEstadoAnimo(entradaActual.estadoAnimo);
      setIsEditing(true);
    }
  };

  // Guardar cambios
  const handleSaveEdit = async () => {
    if (!entradaActual) return;
    setIsLoading(true);
    setError('');
    try {
      const nueva = await diarioService.actualizarEntrada(
        entradaActual.fechaEntrada,
        {
          titulo: editTitulo,
          contenido: editContenido,
          estadoAnimo: editEstadoAnimo
        }
      );
      setEntradaActual(nueva);
      setEntradas(
        entradas.map(e =>
          e.fechaEntrada === nueva?.fechaEntrada ? nueva! : e
        )
      );
      setSuccessMsg('¡Entrada actualizada exitosamente!');
      setTimeout(() => setSuccessMsg(''), 3000);
      setIsEditing(false);
    } catch (err: unknown) {
      setError('Error al guardar entrada del diario');
    } finally {
      setIsLoading(false);
    }
  };

  // Cancelar edición
  const handleCancelEdit = () => {
    setIsEditing(false);
    // Resetear campos a los valores originales
    if (entradaActual) {
      setEditTitulo(entradaActual.titulo || '');
      setEditContenido(entradaActual.contenido || '');
      setEditEstadoAnimo(entradaActual.estadoAnimo);
    }
  };

  // useEffect para sincronizar los campos de edición con la entrada seleccionada
  useEffect(() => {
    if (entradaActual) {
      setEditTitulo(entradaActual.titulo || '');
      setEditContenido(entradaActual.contenido || '');
      setEditEstadoAnimo(entradaActual.estadoAnimo);
    } else {
      setEditTitulo('');
      setEditContenido('');
      setEditEstadoAnimo(undefined);
    }
    setIsEditing(false); // Reset editing mode when entry changes
  }, [entradaActual]);

  if (pinLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="flex items-center gap-3 text-slate-600">
          <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
          <span>Cargando...</span>
        </div>
      </div>
    );
  }

  // Log de depuración para ver las entradas que llegan del backend
  console.log('Entradas:', entradas);

  return (
    <div className="h-full bg-white flex">
      {/* Overlay móvil */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar del diario */}
      <aside className={`
        ${isMobile ? 'fixed' : 'relative'} top-0 left-0 z-50 h-full
        bg-slate-50 border-r border-slate-200 flex flex-col
        transition-all duration-300 ease-in-out
        ${isMobile 
          ? (sidebarOpen ? 'translate-x-0 w-80' : '-translate-x-full w-80')
          : 'w-80'
        }
      `}>
        {/* Header del sidebar del diario */}
        <div className="p-6 border-b border-slate-200 shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Diario Personal</h2>
              <p className="text-sm text-slate-500">Gestiona tus entradas</p>
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
          
          {/* Botón Nueva entrada */}
          <button
            onClick={() => {
              setIsEditMode(false);
              setModalInitialData(null);
              setShowCrearModal(true);
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Nueva entrada
          </button>
        </div>

        {/* Contenido del sidebar con scroll */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="p-6 space-y-6">
            {/* Fecha actual */}
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-slate-900">Fecha Actual</h3>
                  <p className="text-sm text-slate-500">
                    {fechaSeleccionada.toLocaleDateString('es-ES', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long'
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Entradas del mes */}
            <div className="mb-4 flex gap-2 items-center">
              <select
                className="border border-slate-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                value={mes}
                onChange={e => setMes(Number(e.target.value))}
              >
                {[...Array(12)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(0, i).toLocaleString('es-ES', { month: 'long' })}
                  </option>
                ))}
              </select>
              <select
                className="border border-slate-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                value={año}
                onChange={e => setAño(Number(e.target.value))}
              >
                {Array.from({ length: 6 }, (_, i) => today.getFullYear() - 3 + i).map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            <div className="space-y-3">
              <h3 className="font-medium text-slate-900 flex items-center gap-2">
                <Edit3 className="w-4 h-4" />
                Entradas de {(() => {
                  const fecha = new Date(año, mes - 1);
                  return fecha.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
                })()}
              </h3>
              
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-4 h-4 border border-slate-200 border-t-slate-400 rounded-full animate-spin" />
                </div>
              ) : entradas.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Edit3 className="w-6 h-6 text-slate-400" />
                  </div>
                  <p className="text-sm text-slate-500">No hay entradas este mes</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {entradas
                    .filter(e => e.fechaEntrada && e.fechaEntrada !== '0001-01-01' && e.fechaEntrada !== '0001-01-01T00:00:00')
                    .map((entrada) => (
                      <button
                        key={entrada.fechaEntrada}
                        className={`w-full text-left p-3 rounded-lg border transition-all ${
                          fechaSeleccionada.toISOString().split('T')[0] === entrada.fechaEntrada.split('T')[0]
                            ? 'bg-blue-50 border-blue-200 text-blue-700'
                            : 'bg-white border-slate-200 hover:bg-slate-50'
                        }`}
                        onClick={() => {
                          try {
                            // Crear fecha correctamente desde string YYYY-MM-DD o YYYY-MM-DDTHH:mm:ss
                            const [datePart] = entrada.fechaEntrada.split('T');
                            const [year, month, day] = datePart.split('-');
                            const fecha = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                            // Verificar que la fecha es válida antes de seleccionar
                            if (!isNaN(fecha.getTime())) {
                              setFechaSeleccionada(fecha);
                              if (isMobile) setSidebarOpen(false);
                            }
                          } catch (error) {
                            console.error('Error al seleccionar fecha:', error);
                          }
                        }}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">
                            {(() => {
                              try {
                                // Crear fecha correctamente desde string YYYY-MM-DD o YYYY-MM-DDTHH:mm:ss
                                const [datePart] = entrada.fechaEntrada.split('T');
                                const [year, month, day] = datePart.split('-');
                                const fecha = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                                // Verificar que la fecha es válida
                                if (isNaN(fecha.getTime())) {
                                  return entrada.fechaEntrada; // Mostrar la fecha original si hay problema
                                }
                                return fecha.toLocaleDateString('es-ES', {
                                  day: 'numeric',
                                  month: 'short'
                                });
                              } catch (error) {
                                return entrada.fechaEntrada; // Mostrar la fecha original si hay error
                              }
                            })()}
                          </span>
                          {entrada.estadoAnimo && (
                            <span className="text-lg">
                              {estadosAnimo.find(e => e.valor === entrada.estadoAnimo)?.emoji}
                            </span>
                          )}
                        </div>
                        {entrada.titulo && (
                          <p className="text-xs text-slate-500 truncate">
                            {entrada.titulo}
                          </p>
                        )}
                      </button>
                    ))}
                </div>
              )}
            </div>

            {/* Estadísticas rápidas */}
            {entradas.filter(e => e.fechaEntrada && e.fechaEntrada !== '0001-01-01').length > 0 && (
              <div className="space-y-3">
                <h3 className="font-medium text-slate-900 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Estadísticas
                </h3>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white rounded-lg p-3 border border-slate-200 text-center">
                    <p className="text-lg font-bold text-slate-900">{entradas.filter(e => e.fechaEntrada && e.fechaEntrada !== '0001-01-01').length}</p>
                    <p className="text-xs text-slate-500">Entradas</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-slate-200 text-center">
                    <p className="text-lg font-bold text-green-600">
                      {entradas.filter(e => e.fechaEntrada && e.fechaEntrada !== '0001-01-01' && e.estadoAnimo && e.estadoAnimo >= 4).length}
                    </p>
                    <p className="text-xs text-slate-500">Días buenos</p>
                  </div>
                </div>

                <button
                  onClick={cargarEstadisticas}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <TrendingUp className="w-3 h-3" />
                  Ver estadísticas completas
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer del sidebar */}
        <div className="p-6 border-t border-slate-200 space-y-2">
          <button
            onClick={() => setShowCrearPin(true)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Settings className="w-3 h-3" />
            Cambiar PIN
          </button>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 flex flex-col">
        {/* Header principal */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-4">
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
                  {fechaSeleccionada.toLocaleDateString('es-ES', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </h1>
                <p className="text-sm text-slate-500">
                  {entradaActual ? 'Entrada existente' : 'Sin entrada para este día'}
                </p>
              </div>
            </div>
            
            {/* Controles del header */}
            {entradaActual && !isEditing ? (
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-sm"
              >
                <Edit3 className="w-4 h-4" />
                Editar
              </button>
            ) : isEditing ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveEdit}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  Guardar
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-sm"
                >
                  <X className="w-4 h-4" />
                  Cancelar
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setIsEditMode(false);
                  setModalInitialData(null);
                  setShowCrearModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                Crear entrada
              </button>
            )}
          </div>
        </header>

        {/* Área de contenido */}
        <div className="flex-1 p-4 sm:p-6">
          {/* Mensajes */}
          {successMsg && (
            <div className="mb-4 p-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg">
              {successMsg}
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
              {error}
            </div>
          )}

          {/* Contenido principal - Editor integrado */}
          <div className="bg-white rounded-lg border border-slate-200 h-full">
            {entradaActual ? (
              <div className="h-full flex flex-col">
                {isEditing ? (
                  /* Editor Mode */
                  <div className="flex-1 p-6 flex flex-col overflow-hidden">
                    {/* Editor Header */}
                    <div className="mb-6 space-y-4 shrink-0">
                      <input
                        type="text"
                        value={editTitulo}
                        onChange={(e) => setEditTitulo(e.target.value)}
                        placeholder="Título de la entrada..."
                        className="w-full px-4 py-3 text-xl font-semibold border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      
                      <div className="flex items-center gap-4">
                        <label className="text-sm font-medium text-slate-700">Estado de ánimo:</label>
                        <select
                          value={editEstadoAnimo || ''}
                          onChange={(e) => setEditEstadoAnimo(e.target.value ? Number(e.target.value) : undefined)}
                          className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Selecciona...</option>
                          {estadosAnimo.map((estado) => (
                            <option key={estado.valor} value={estado.valor}>
                              {estado.emoji} {estado.nombre}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Editor de contenido */}
                    <div className="flex-1 overflow-hidden">
                      <TinyMCEEditor
                        value={editContenido}
                        onChange={setEditContenido}
                        placeholder="Escribe tu entrada del diario..."
                        height="100%"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                ) : (
                  /* View Mode */
                  <div className="p-6 overflow-y-auto h-full">
                    {/* Header de la entrada */}
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                      {entradaActual.estadoAnimo && (
                        <span className="text-2xl">
                          {estadosAnimo.find(e => e.valor === entradaActual.estadoAnimo)?.emoji}
                        </span>
                      )}
                      <div>
                        <h2 className="text-2xl font-bold text-slate-900">
                          {entradaActual.titulo || 'Sin título'}
                        </h2>
                        <p className="text-sm text-slate-500">
                          {entradaActual.estadoAnimo && 
                            estadosAnimo.find(e => e.valor === entradaActual.estadoAnimo)?.nombre
                          }
                        </p>
                      </div>
                    </div>

                    {/* Contenido de la entrada */}
                    <div 
                      className="prose prose-slate max-w-none text-slate-700 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: entradaActual.contenido || '' }}
                    />
                  </div>
                )}
              </div>
            ) : (
              /* Estado vacío */
              <div className="flex items-center justify-center h-full">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                    <FileText className="w-8 h-8 text-slate-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-slate-900 mb-2">
                      No hay entrada para este día
                    </h3>
                    <p className="text-slate-500 max-w-md">
                      Crea una nueva entrada para registrar tus pensamientos y emociones del día
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setIsEditMode(false);
                      setModalInitialData(null);
                      setShowCrearModal(true);
                    }}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Crear primera entrada
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modales */}
      {!hasPin && (
        <CrearPinModal
          isOpen={true}
          onClose={handleClosePinModal}
          onCreatePin={handleCrearPin}
        />
      )}

      {hasPin && !isPinAuthenticated && (
        <VerificarPinModal
          isOpen={true}
          onClose={handleClosePinModal}
          onVerifyPin={handleVerificarPin}
        />
      )}

      {showCrearPin && (
        <CrearPinModal
          isOpen={true}
          onClose={() => setShowCrearPin(false)}
          onCreatePin={handleCrearPin}
        />
      )}

      <CrearEntradaDiarioModal
        isOpen={showCrearModal}
        onClose={() => setShowCrearModal(false)}
        onSubmit={async (data) => {
          await guardarEntrada(data);
          setShowCrearModal(false);
        }}
        isLoading={isLoading}
        initialData={modalInitialData}
      />

      {/* Modal de estadísticas */}
      {showEstadisticas && estadisticas && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setShowEstadisticas(false)} />
            <div className="relative bg-white rounded-lg border border-slate-200 max-w-2xl w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900">
                  Estadísticas del Mes
                </h3>
                <button
                  onClick={() => setShowEstadisticas(false)}
                  className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <X className="w-4 h-4 text-slate-600" />
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {(estadisticas as any).totalEntradas}
                  </div>
                  <div className="text-sm text-blue-600">
                    Entradas totales
                  </div>
                </div>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {(estadisticas as any).totalPalabras}
                  </div>
                  <div className="text-sm text-green-600">
                    Palabras escritas
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-slate-900">Estados de ánimo:</h4>
                {estadosAnimo.map((estado) => {
                  const count = (estadisticas as any).porEstadoAnimo[estado.nombre.toLowerCase().replace(' ', '')] || 0;
                  return (
                    <div key={estado.valor} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{estado.emoji}</span>
                        <span className="text-sm text-slate-700">{estado.nombre}</span>
                      </div>
                      <span className="text-sm font-medium text-slate-900">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
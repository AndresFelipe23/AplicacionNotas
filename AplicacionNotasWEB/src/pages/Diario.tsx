import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Plus, 
  Search,
  BarChart3,
  Lock,
  Settings
} from 'lucide-react';
import { usePinDiario } from '../contexts/PinDiarioContext';
import { diarioService, DiarioEntrada, CrearEntradaDiario } from '../services/diarioService';
import { CrearPinModal } from '../components/CrearPinModal';
import { VerificarPinModal } from '../components/VerificarPinModal';

export const Diario: React.FC = () => {
  const { 
    isPinAuthenticated, 
    hasPin, 
    isLoading: pinLoading, 
    authenticatePin, 
    createPin 
  } = usePinDiario();

  const [entradas, setEntradas] = useState<DiarioEntrada[]>([]);
  const [entradaActual, setEntradaActual] = useState<DiarioEntrada | null>(null);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCrearPin, setShowCrearPin] = useState(false);
  const [showVerificarPin, setShowVerificarPin] = useState(false);
  const [showEstadisticas, setShowEstadisticas] = useState(false);
  const [estadisticas, setEstadisticas] = useState<any>(null);

  // Estados para el formulario de entrada
  const [formData, setFormData] = useState<CrearEntradaDiario>({
    titulo: '',
    contenido: '',
    estadoAnimo: undefined
  });

  const estadosAnimo = [
    { valor: 1, nombre: "Muy mal", emoji: "😢", color: "#EF4444" },
    { valor: 2, nombre: "Mal", emoji: "😔", color: "#F97316" },
    { valor: 3, nombre: "Regular", emoji: "😐", color: "#F59E0B" },
    { valor: 4, nombre: "Bien", emoji: "😊", color: "#10B981" },
    { valor: 5, nombre: "Excelente", emoji: "😁", color: "#22C55E" }
  ];

  useEffect(() => {
    if (isPinAuthenticated && !pinLoading) {
      cargarEntradas();
    }
  }, [isPinAuthenticated, pinLoading, fechaSeleccionada]);

  useEffect(() => {
    if (hasPin && !isPinAuthenticated && !pinLoading) {
      setShowVerificarPin(true);
    }
  }, [hasPin, isPinAuthenticated, pinLoading]);

  const cargarEntradas = async () => {
    try {
      setIsLoading(true);
      setError('');
      const mes = fechaSeleccionada.getMonth() + 1;
      const año = fechaSeleccionada.getFullYear();
      const data = await diarioService.getEntradas(mes, año);
      setEntradas(data);
    } catch (err) {
      setError('Error al cargar las entradas del diario');
      console.error('Error loading entries:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const cargarEntradaDelDia = async () => {
    try {
      const fecha = fechaSeleccionada.toISOString().split('T')[0];
      const entrada = await diarioService.getEntrada(fecha);
      setEntradaActual(entrada);
      setFormData({
        titulo: entrada.titulo || '',
        contenido: entrada.contenido || '',
        estadoAnimo: entrada.estadoAnimo
      });
    } catch (err) {
      // Si no existe entrada para hoy, crear una nueva
      setEntradaActual(null);
      setFormData({
        titulo: '',
        contenido: '',
        estadoAnimo: undefined
      });
    }
  };

  const guardarEntrada = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const fecha = fechaSeleccionada.toISOString().split('T')[0];
      
      if (entradaActual) {
        // Actualizar entrada existente
        const actualizada = await diarioService.actualizarEntrada(fecha, formData);
        setEntradaActual(actualizada);
      } else {
        // Crear nueva entrada
        const nueva = await diarioService.crearEntrada(formData);
        setEntradaActual(nueva);
      }
      
      await cargarEntradas();
    } catch (err) {
      setError('Error al guardar la entrada');
      console.error('Error saving entry:', err);
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
    } catch (err) {
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
      setShowVerificarPin(false);
    }
    return isValid;
  };

  if (pinLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!hasPin) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="mx-auto w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6 dark:bg-blue-900">
              <Lock className="w-12 h-12 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4 dark:text-white">
              Configura tu PIN del Diario
            </h1>
            <p className="text-lg text-gray-600 mb-8 dark:text-gray-400">
              Para proteger tu diario personal, necesitas crear un PIN de acceso.
            </p>
            <button
              onClick={() => setShowCrearPin(true)}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Lock className="w-5 h-5 mr-2" />
              Crear PIN
            </button>
          </motion.div>
        </div>

        <CrearPinModal
          isOpen={showCrearPin}
          onClose={() => setShowCrearPin(false)}
          onCreatePin={handleCrearPin}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Mi Diario Personal
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Registra tus pensamientos y emociones del día
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={cargarEstadisticas}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Estadísticas
            </button>
            <button
              onClick={() => setShowCrearPin(true)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <Settings className="w-4 h-4 mr-2" />
              Cambiar PIN
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendario */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Calendario
              </h2>
              
              {/* Calendario simple */}
              <div className="space-y-2">
                {entradas.map((entrada) => (
                  <div
                    key={entrada.fechaEntrada}
                    className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => {
                      const fecha = new Date(entrada.fechaEntrada);
                      setFechaSeleccionada(fecha);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {new Date(entrada.fechaEntrada).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'short'
                        })}
                      </span>
                      {entrada.estadoAnimo && (
                        <span className="text-lg">
                          {estadosAnimo.find(e => e.valor === entrada.estadoAnimo)?.emoji}
                        </span>
                      )}
                    </div>
                    {entrada.titulo && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                        {entrada.titulo}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Editor de entrada */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {fechaSeleccionada.toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </h2>
                <button
                  onClick={cargarEntradaDelDia}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Cargar entrada
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-900 dark:text-red-200">
                  {error}
                </div>
              )}

              <form onSubmit={(e) => { e.preventDefault(); guardarEntrada(); }} className="space-y-6">
                {/* Estado de ánimo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    ¿Cómo te sientes hoy?
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {estadosAnimo.map((estado) => (
                      <button
                        key={estado.valor}
                        type="button"
                        onClick={() => setFormData({ ...formData, estadoAnimo: estado.valor })}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          formData.estadoAnimo === estado.valor
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                            : 'border-gray-200 hover:border-gray-300 dark:border-gray-600 dark:hover:border-gray-500'
                        }`}
                      >
                        <div className="text-2xl mb-1">{estado.emoji}</div>
                        <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
                          {estado.nombre}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Título */}
                <div>
                  <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Título (opcional)
                  </label>
                  <input
                    type="text"
                    id="titulo"
                    value={formData.titulo}
                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Un título para tu día..."
                  />
                </div>

                {/* Contenido */}
                <div>
                  <label htmlFor="contenido" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    ¿Qué pasó hoy?
                  </label>
                  <textarea
                    id="contenido"
                    value={formData.contenido}
                    onChange={(e) => setFormData({ ...formData, contenido: e.target.value })}
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Escribe sobre tu día, tus pensamientos, emociones..."
                  />
                </div>

                {/* Botones */}
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ titulo: '', contenido: '', estadoAnimo: undefined });
                      setEntradaActual(null);
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-transparent rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  >
                    Limpiar
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {isLoading ? 'Guardando...' : 'Guardar entrada'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Modales */}
      <CrearPinModal
        isOpen={showCrearPin}
        onClose={() => setShowCrearPin(false)}
        onCreatePin={handleCrearPin}
      />

      <VerificarPinModal
        isOpen={showVerificarPin}
        onClose={() => setShowVerificarPin(false)}
        onVerifyPin={handleVerificarPin}
      />

      {/* Modal de estadísticas */}
      {showEstadisticas && estadisticas && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
            <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 dark:bg-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Estadísticas del Mes
              </h3>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-blue-50 rounded-lg dark:bg-blue-900">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {estadisticas.totalEntradas}
                  </div>
                  <div className="text-sm text-blue-600 dark:text-blue-400">
                    Entradas totales
                  </div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg dark:bg-green-900">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {estadisticas.totalPalabras}
                  </div>
                  <div className="text-sm text-green-600 dark:text-green-400">
                    Palabras escritas
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-gray-900 dark:text-white">Estados de ánimo:</h4>
                {estadosAnimo.map((estado) => {
                  const count = estadisticas.porEstadoAnimo[estado.nombre.toLowerCase().replace(' ', '')] || 0;
                  return (
                    <div key={estado.valor} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{estado.emoji}</span>
                        <span className="text-sm text-gray-700 dark:text-gray-300">{estado.nombre}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{count}</span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowEstadisticas(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-transparent rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 
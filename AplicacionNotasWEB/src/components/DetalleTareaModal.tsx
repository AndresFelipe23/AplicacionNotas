import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tarea, eliminarTarea } from '../services/tareaService';
import { confirmDelete, showSuccess, showError } from '../utils/sweetalert';
import { usePapelera } from '../contexts/PapeleraContext';
import { 
  X, 
  Calendar,
  AlertCircle,
  CheckCircle,
  Circle,
  Edit3,
  Trash2,
  Clock,
  Target,
  Pause,
  FileText,
  Tag
} from 'lucide-react';

interface DetalleTareaModalProps {
  isOpen: boolean;
  onClose: () => void;
  tarea: Tarea | null;
  onEdit: (tarea: Tarea) => void;
  onTareaDeleted: () => void;
}

export default function DetalleTareaModal({ 
  isOpen, 
  onClose, 
  tarea,
  onEdit,
  onTareaDeleted
}: DetalleTareaModalProps) {
  const [loading, setLoading] = useState(false);
  const { actualizarContador } = usePapelera();

  if (!isOpen || !tarea) return null;

  const prioridadConfig = {
    1: { color: 'bg-slate-100 text-slate-700', border: 'border-slate-200', dot: 'bg-slate-400', nombre: 'Baja' },
    2: { color: 'bg-blue-100 text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500', nombre: 'Media' },
    3: { color: 'bg-amber-100 text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500', nombre: 'Alta' },
    4: { color: 'bg-red-100 text-red-700', border: 'border-red-200', dot: 'bg-red-500', nombre: 'Urgente' }
  };

  const estadoConfig = {
    pendiente: { color: 'bg-blue-100 text-blue-700', border: 'border-blue-200', icon: Circle, nombre: 'Pendiente' },
    en_progreso: { color: 'bg-amber-100 text-amber-700', border: 'border-amber-200', icon: Pause, nombre: 'En Progreso' },
    completada: { color: 'bg-green-100 text-green-700', border: 'border-green-200', icon: CheckCircle, nombre: 'Completada' }
  };

  const config = prioridadConfig[tarea.prioridad];
  const estadoInfo = estadoConfig[tarea.estado as keyof typeof estadoConfig];
  const EstadoIcon = estadoInfo.icon;

  const isVencida = tarea.fechaVencimiento && new Date(tarea.fechaVencimiento) < new Date() && !tarea.completada;
  const fechaCreacion = tarea.fechaCreacion ? new Date(tarea.fechaCreacion) : null;
  const fechaActualizacion = tarea.fechaActualizacion ? new Date(tarea.fechaActualizacion) : null;

  const handleEdit = () => {
    onEdit(tarea);
    onClose();
  };

  const handleDelete = async () => {
    const result = await confirmDelete(
      '¿Eliminar tarea?',
      'La tarea se enviará a la papelera y podrás restaurarla desde allí.'
    );
    
    if (result.isConfirmed) {
      setLoading(true);
      try {
        await eliminarTarea(tarea.id);
        await showSuccess('Tarea eliminada', 'La tarea se ha enviado a la papelera');
        await actualizarContador();
        onTareaDeleted();
        onClose();
      } catch (error) {
        console.error('Error al eliminar tarea:', error);
        await showError('Error', 'No se pudo eliminar la tarea');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <motion.div 
                className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                  tarea.completada 
                    ? 'bg-gradient-to-br from-green-500 to-green-600' 
                    : 'bg-gradient-to-br from-blue-500 to-blue-600'
                }`}
                whileHover={{ scale: 1.05 }}
              >
                <Target className="w-5 h-5 text-white" />
              </motion.div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Detalle de Tarea</h2>
                <p className="text-sm text-slate-500">Información completa</p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={loading}
              className="p-2 hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          {/* Contenido */}
          <div className="p-6 space-y-6">
            {/* Título y estado */}
            <div className="space-y-4">
              <div>
                <h3 className={`text-2xl font-bold text-slate-900 mb-2 ${
                  tarea.completada ? 'line-through text-slate-500' : ''
                }`}>
                  {tarea.titulo}
                </h3>
                {tarea.descripcion && (
                  <p className="text-slate-600 leading-relaxed">
                    {tarea.descripcion}
                  </p>
                )}
              </div>

              {/* Estados y prioridad */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Estado */}
                <div className={`flex items-center gap-2 px-3 py-2 rounded-full border ${estadoInfo.color} ${estadoInfo.border}`}>
                  <EstadoIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">{estadoInfo.nombre}</span>
                </div>

                {/* Prioridad */}
                <div className={`flex items-center gap-2 px-3 py-2 rounded-full border ${config.color} ${config.border}`}>
                  <div className={`w-2 h-2 rounded-full ${config.dot}`} />
                  <span className="text-sm font-medium">{config.nombre}</span>
                </div>

                {/* Completada */}
                {tarea.completada && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-green-100 border border-green-200 text-green-700">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Completada</span>
                  </div>
                )}
              </div>
            </div>

            {/* Fechas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Fecha de vencimiento */}
              {tarea.fechaVencimiento && (
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-xl ${
                      isVencida ? 'bg-red-100' : 'bg-blue-100'
                    }`}>
                      <Calendar className={`w-4 h-4 ${
                        isVencida ? 'text-red-600' : 'text-blue-600'
                      }`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-600">Fecha de vencimiento</p>
                      <p className={`text-lg font-semibold ${
                        isVencida ? 'text-red-700' : 'text-slate-900'
                      }`}>
                        {new Date(tarea.fechaVencimiento).toLocaleDateString('es-ES', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  {isVencida && (
                    <div className="flex items-center gap-2 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span className="font-medium">Tarea vencida</span>
                    </div>
                  )}
                </div>
              )}

              {/* Fecha de creación */}
              {fechaCreacion && (
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-slate-100 rounded-xl">
                      <Clock className="w-4 h-4 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-600">Fecha de creación</p>
                      <p className="text-lg font-semibold text-slate-900">
                        {fechaCreacion.toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Metadatos adicionales */}
            {fechaActualizacion && (
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 rounded-xl">
                    <Clock className="w-4 h-4 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">Última actualización</p>
                    <p className="text-lg font-semibold text-slate-900">
                      {fechaActualizacion.toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Información adicional */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* ID de la tarea */}
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <Tag className="w-4 h-4 text-slate-500" />
                <div>
                  <p className="text-xs text-slate-500">ID de tarea</p>
                  <p className="text-sm font-medium text-slate-700">#{tarea.id}</p>
                </div>
              </div>

              {/* Estado de completado */}
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <CheckCircle className={`w-4 h-4 ${
                  tarea.completada ? 'text-green-600' : 'text-slate-400'
                }`} />
                <div>
                  <p className="text-xs text-slate-500">Estado</p>
                  <p className={`text-sm font-medium ${
                    tarea.completada ? 'text-green-700' : 'text-slate-700'
                  }`}>
                    {tarea.completada ? 'Completada' : 'Pendiente'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-3 p-6 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-6 py-3 border border-slate-200 rounded-2xl text-slate-700 hover:bg-slate-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cerrar
            </button>
            
            <motion.button
              type="button"
              onClick={handleEdit}
              disabled={loading}
              whileHover={!loading ? { scale: 1.02 } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-2xl hover:from-amber-700 hover:to-amber-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium flex items-center justify-center gap-2"
            >
              <Edit3 className="w-4 h-4" />
              Editar
            </motion.button>
            
            <motion.button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              whileHover={!loading ? { scale: 1.02 } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Eliminando...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Eliminar
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
} 
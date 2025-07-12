import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { crearTarea, CrearTareaDto } from '../services/tareaService';
import { 
  Plus, 
  X, 
  Calendar, 
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useThemeStyles } from '../hooks/useThemeStyles';

interface CrearTareaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTareaCreated: (data: CrearTareaDto) => void;
  fechaPreseleccionada?: Date | null;
}

export default function CrearTareaModal({ 
  isOpen, 
  onClose, 
  onTareaCreated, 
  fechaPreseleccionada 
}: CrearTareaModalProps) {
  const [formData, setFormData] = useState<CrearTareaDto>({
    titulo: '',
    descripcion: '',
    prioridad: 1,
    fechaVencimiento: '',
    estado: 'pendiente'
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [success, setSuccess] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const { getButtonClasses } = useThemeStyles();

  const prioridades = [
    { 
      valor: 1, 
      nombre: 'Baja', 
      color: 'border-slate-300 hover:border-slate-400', 
      bg: 'hover:bg-slate-50',
      selected: 'border-slate-400 bg-slate-50'
    },
    { 
      valor: 2, 
      nombre: 'Media', 
      color: 'border-blue-300 hover:border-blue-400', 
      bg: 'hover:bg-blue-50',
      selected: 'border-blue-400 bg-blue-50'
    },
    { 
      valor: 3, 
      nombre: 'Alta', 
      color: 'border-amber-300 hover:border-amber-400', 
      bg: 'hover:bg-amber-50',
      selected: 'border-amber-400 bg-amber-50'
    },
    { 
      valor: 4, 
      nombre: 'Urgente', 
      color: 'border-red-300 hover:border-red-400', 
      bg: 'hover:bg-red-50',
      selected: 'border-red-400 bg-red-50'
    }
  ];

  // Focus en el input al abrir
  useEffect(() => {
    if (isOpen && titleInputRef.current) {
      setTimeout(() => {
        titleInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Limpiar estado al cerrar y configurar fecha preseleccionada
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        titulo: '',
        descripcion: '',
        prioridad: 1,
        fechaVencimiento: '',
        estado: 'pendiente'
      });
      setErrors({});
      setSuccess(false);
      setLoading(false);
    } else if (fechaPreseleccionada) {
      // Si hay fecha preseleccionada, configurarla
      setFormData(prev => ({
        ...prev,
        fechaVencimiento: fechaPreseleccionada.toISOString().split('T')[0]
      }));
    }
  }, [isOpen, fechaPreseleccionada]);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.titulo.trim()) {
      newErrors.titulo = 'El título es obligatorio';
    }
    
    if (formData.titulo.length > 100) {
      newErrors.titulo = 'El título no puede exceder 100 caracteres';
    }
    
    if (formData.descripcion && formData.descripcion.length > 500) {
      newErrors.descripcion = 'La descripción no puede exceder 500 caracteres';
    }
    
    if (formData.fechaVencimiento) {
      const fechaVencimiento = new Date(formData.fechaVencimiento);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      
      if (fechaVencimiento < hoy) {
        newErrors.fechaVencimiento = 'La fecha no puede ser anterior a hoy';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Si hay fecha preseleccionada, significa que viene del calendario
      // En ese caso, solo llamamos a onTareaCreated sin crear la tarea aquí
      if (fechaPreseleccionada) {
        setSuccess(true);
        setTimeout(() => {
          onTareaCreated(formData);
          onClose();
        }, 1200);
      } else {
        // Comportamiento normal para crear desde otras páginas
        await crearTarea(formData);
        setSuccess(true);
        setTimeout(() => {
          onTareaCreated(formData);
          onClose();
        }, 1200);
      }
    } catch (error) {
      console.error('Error al crear tarea:', error);
      setErrors({ general: 'Error al crear la tarea. Inténtalo de nuevo.' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof CrearTareaDto, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Manejar tecla Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !loading) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, loading, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-slate-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <motion.div 
                className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
              >
                <Plus className="w-5 h-5 text-white" />
              </motion.div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Nueva Tarea</h2>
                <p className="text-sm text-slate-500">Organiza tu trabajo</p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={loading}
              className={`p-2 rounded-xl transition-colors disabled:opacity-50 ${getButtonClasses('secondary')}`}
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          {/* Mensajes */}
          <AnimatePresence>
            {(errors.general || success) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="px-6 pt-4"
              >
                {errors.general && (
                  <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <p className="text-sm">{errors.general}</p>
                  </div>
                )}
                
                {success && (
                  <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-2xl text-green-700">
                    <CheckCircle className="w-5 h-5 shrink-0" />
                    <p className="text-sm">¡Tarea creada exitosamente!</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Título */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                ¿Qué necesitas hacer? *
              </label>
              <input
                ref={titleInputRef}
                type="text"
                value={formData.titulo}
                onChange={(e) => handleChange('titulo', e.target.value)}
                className={`w-full px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder-slate-400 ${
                  errors.titulo ? 'border-red-300 bg-red-50' : 'border-slate-200'
                }`}
                placeholder="Escribe el título de tu tarea..."
                maxLength={100}
                disabled={loading || success}
              />
              <div className="flex justify-between items-center mt-1">
                {errors.titulo ? (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.titulo}
                  </p>
                ) : (
                  <span className="text-xs text-slate-500">Describe brevemente tu tarea</span>
                )}
                <span className="text-xs text-slate-400">{formData.titulo.length}/100</span>
              </div>
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Detalles adicionales
              </label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => handleChange('descripcion', e.target.value)}
                className={`w-full px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none placeholder-slate-400 ${
                  errors.descripcion ? 'border-red-300 bg-red-50' : 'border-slate-200'
                }`}
                placeholder="Agrega contexto o instrucciones específicas..."
                rows={3}
                maxLength={500}
                disabled={loading || success}
              />
              <div className="flex justify-between items-center mt-1">
                {errors.descripcion ? (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.descripcion}
                  </p>
                ) : (
                  <span className="text-xs text-slate-500">Opcional - Añade más contexto</span>
                )}
                <span className="text-xs text-slate-400">{formData.descripcion.length}/500</span>
              </div>
            </div>

            {/* Prioridad */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Nivel de prioridad
              </label>
              <div className="grid grid-cols-2 gap-3">
                {prioridades.map((prioridad) => (
                  <motion.button
                    key={prioridad.valor}
                    type="button"
                    onClick={() => handleChange('prioridad', prioridad.valor)}
                    disabled={loading || success}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-4 rounded-2xl border-2 transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed ${
                      formData.prioridad === prioridad.valor
                        ? `${prioridad.selected} border-opacity-100`
                        : `border-slate-200 hover:border-slate-300 hover:bg-slate-50 ${prioridad.color} ${prioridad.bg}`
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-900">{prioridad.nombre}</span>
                      <div className={`w-3 h-3 rounded-full ${
                        prioridad.valor === 1 ? 'bg-slate-400' :
                        prioridad.valor === 2 ? 'bg-blue-500' :
                        prioridad.valor === 3 ? 'bg-amber-500' : 'bg-red-500'
                      }`} />
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Fecha de vencimiento */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Fecha límite
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.fechaVencimiento}
                  onChange={(e) => handleChange('fechaVencimiento', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  disabled={loading || success}
                  className={`w-full px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    errors.fechaVencimiento ? 'border-red-300 bg-red-50' : 'border-slate-200'
                  }`}
                />
                <Calendar className="absolute right-4 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
              {errors.fechaVencimiento ? (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.fechaVencimiento}
                </p>
              ) : (
                <p className="mt-1 text-xs text-slate-500">Opcional - Cuándo debe estar lista</p>
              )}
            </div>

            {/* Botones */}
            <div className="flex gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className={`flex-1 px-6 py-3 rounded-2xl font-medium disabled:opacity-50 disabled:cursor-not-allowed border ${getButtonClasses('secondary')}`}
              >
                Cancelar
              </button>
              <motion.button
                type="submit"
                disabled={loading || !formData.titulo.trim() || success}
                whileHover={!loading && formData.titulo.trim() && !success ? { scale: 1.02 } : {}}
                whileTap={!loading && formData.titulo.trim() && !success ? { scale: 0.98 } : {}}
                className={`flex-1 px-6 py-3 rounded-2xl font-medium flex items-center justify-center gap-2 ${getButtonClasses('primary')}`}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creando...
                  </>
                ) : success ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    ¡Creada!
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Crear tarea
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
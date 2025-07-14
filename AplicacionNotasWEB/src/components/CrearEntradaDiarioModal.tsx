import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, X, Smile, AlertCircle, CheckCircle } from 'lucide-react';
import TinyMCEEditor from './TinyMCEEditor';

interface FormularioEntrada {
  titulo: string;
  contenido: string;
  estadoAnimo?: number;
}

interface CrearEntradaDiarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<FormularioEntrada, 'fechaEntrada'>) => Promise<void>;
  isLoading?: boolean;
  initialData?: Partial<FormularioEntrada>; // Para modo edición futuro
}

const estadosAnimo = [
  { value: 1, label: 'Muy mal', color: 'bg-red-200' },
  { value: 2, label: 'Mal', color: 'bg-orange-200' },
  { value: 3, label: 'Regular', color: 'bg-yellow-200' },
  { value: 4, label: 'Bien', color: 'bg-green-200' },
  { value: 5, label: 'Excelente', color: 'bg-blue-200' },
];

const CrearEntradaDiarioModal: React.FC<CrearEntradaDiarioModalProps> = ({ isOpen, onClose, onSubmit, isLoading, initialData }) => {
  const [formData, setFormData] = useState<FormularioEntrada>({
    titulo: initialData?.titulo || '',
    contenido: initialData?.contenido || '',
    estadoAnimo: initialData?.estadoAnimo,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [success, setSuccess] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && titleInputRef.current) {
      setTimeout(() => {
        titleInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setFormData({ titulo: '', contenido: '', estadoAnimo: undefined });
      setErrors({});
      setSuccess(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({
        titulo: initialData.titulo || '',
        contenido: initialData.contenido || '',
        estadoAnimo: initialData.estadoAnimo
      });
    }
  }, [isOpen, initialData]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.titulo.trim()) {
      newErrors.titulo = 'El título es obligatorio';
    }
    if (formData.titulo.length > 100) {
      newErrors.titulo = 'El título no puede exceder 100 caracteres';
    }
    // Extraer texto plano de TinyMCE (eliminar etiquetas HTML)
    const plainText = formData.contenido ? formData.contenido.replace(/<[^>]+>/g, '').trim() : '';
    if (!plainText) {
      newErrors.contenido = 'El contenido es obligatorio';
    }
    if (plainText.length > 1000) {
      newErrors.contenido = 'El contenido no puede exceder 1000 caracteres';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await onSubmit({
        titulo: formData.titulo,
        contenido: formData.contenido,
        estadoAnimo: formData.estadoAnimo,
      });
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 1200);
    } catch (error) {
      setErrors({ general: 'Error al crear la entrada. Inténtalo de nuevo.' });
    }
  };

  const handleChange = (field: keyof FormularioEntrada, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Manejar tecla Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, isLoading, onClose]);

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
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <motion.div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </motion.div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Nueva Entrada</h2>
                <p className="text-sm text-slate-500">Registra tu día</p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="p-2 rounded-xl transition-colors disabled:opacity-50 hover:bg-slate-100"
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
                    <p className="text-sm">¡Entrada creada exitosamente!</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Título */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Título de la entrada *
              </label>
              <input
                ref={titleInputRef}
                type="text"
                value={formData.titulo}
                onChange={e => handleChange('titulo', e.target.value)}
                className={`w-full px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder-slate-400 ${
                  errors.titulo ? 'border-red-300 bg-red-50' : 'border-slate-200'
                }`}
                placeholder="¿Cómo titularías tu día?"
                maxLength={100}
                disabled={isLoading || success}
              />
              <div className="flex justify-between items-center mt-1">
                {errors.titulo ? (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.titulo}
                  </p>
                ) : (
                  <span className="text-xs text-slate-500">Un título breve para tu día</span>
                )}
                <span className="text-xs text-slate-400">{formData.titulo.length}/100</span>
              </div>
            </div>

            {/* Campo de contenido */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2" htmlFor="contenido">
                Contenido <span className="text-red-500">*</span>
              </label>
              <textarea
                id="contenido"
                value={formData.contenido}
                onChange={e => handleChange('contenido', e.target.value)}
                placeholder="Escribe tu experiencia, pensamientos o reflexiones..."
                className="w-full min-h-[120px] max-h-[300px] p-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder-slate-400 resize-vertical"
                maxLength={1000}
                disabled={isLoading || success}
              />
              {errors.contenido && (
                <p className="text-xs text-red-600 mt-1">{errors.contenido}</p>
              )}
            </div>

            {/* Estado de ánimo */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                ¿Cómo te sentiste hoy?
              </label>
              <div className="flex gap-2">
                {estadosAnimo.map((op) => (
                  <button
                    key={op.value}
                    type="button"
                    className={`flex flex-col items-center px-3 py-2 rounded-xl border-2 transition-all text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-400
                      ${formData.estadoAnimo === op.value ? `${op.color} border-blue-500` : 'border-slate-200 bg-slate-50 hover:border-blue-300'}`}
                    onClick={() => handleChange('estadoAnimo', op.value)}
                    disabled={isLoading || success}
                  >
                    <Smile className="w-5 h-5 mb-1" />
                    {op.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 px-6 py-3 rounded-2xl font-medium disabled:opacity-50 disabled:cursor-not-allowed border border-slate-200 bg-slate-50 hover:bg-slate-100"
              >
                Cancelar
              </button>
              <motion.button
                type="submit"
                disabled={isLoading || !formData.titulo.trim() || !formData.contenido || !formData.contenido.replace(/<[^>]+>/g, '').trim() || success}
                className="flex-1 px-6 py-3 rounded-2xl font-medium flex items-center justify-center gap-2 bg-blue-600 text-white hover:bg-blue-700 transition-all"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Guardando...
                  </>
                ) : success ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    ¡Creada!
                  </>
                ) : (
                  <>
                    <BookOpen className="w-4 h-4" />
                    Crear entrada
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CrearEntradaDiarioModal; 
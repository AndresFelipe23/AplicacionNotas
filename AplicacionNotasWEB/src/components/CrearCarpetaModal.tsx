import React, { useState, useEffect, useRef } from 'react';
import { X, Save, Folder, Palette, Check, AlertCircle } from 'lucide-react';
import { crearCarpeta } from '../services/carpetaService';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { useThemeStyles } from '../hooks/useThemeStyles';

interface CrearCarpetaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCarpetaCreated: () => void;
}

const CrearCarpetaModal: React.FC<CrearCarpetaModalProps> = ({
  isOpen,
  onClose,
  onCarpetaCreated
}) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [color, setColor] = useState('#3B82F6');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  
  const modalRef = useRef<HTMLDivElement>(null);
  const colorRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const colores = [
    { value: '#3B82F6', name: 'Azul' },
    { value: '#EF4444', name: 'Rojo' },
    { value: '#10B981', name: 'Verde' },
    { value: '#F59E0B', name: 'Amarillo' },
    { value: '#8B5CF6', name: 'Púrpura' },
    { value: '#F97316', name: 'Naranja' },
    { value: '#06B6D4', name: 'Cian' },
    { value: '#84CC16', name: 'Lima' },
    { value: '#EC4899', name: 'Rosa' },
    { value: '#64748B', name: 'Gris' },
    { value: '#0F172A', name: 'Negro' },
    { value: '#7C3AED', name: 'Violeta' }
  ];

  const { getButtonClasses } = useThemeStyles();

  // Detectar dispositivo móvil
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Animación de entrada y focus
  useEffect(() => {
    if (isOpen) {
      if (modalRef.current) {
        gsap.fromTo(modalRef.current, 
          { 
            scale: 0.9, 
            opacity: 0,
            y: 20
          },
          { 
            scale: 1, 
            opacity: 1,
            y: 0,
            duration: 0.3,
            ease: "power2.out"
          }
        );
      }
      
      // Focus en el input después de la animación
      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 300);
    }
  }, [isOpen]);

  // Limpiar estado al cerrar
  useEffect(() => {
    if (!isOpen) {
      setNombre('');
      setDescripcion('');
      setColor('#3B82F6');
      setSelectedColorIndex(0);
      setError('');
      setSuccess('');
      setLoading(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    if (loading) return;
    
    if (modalRef.current) {
      gsap.to(modalRef.current, {
        scale: 0.9,
        opacity: 0,
        y: 20,
        duration: 0.2,
        ease: "power2.in",
        onComplete: onClose
      });
    } else {
      onClose();
    }
  };

  const handleColorSelect = (colorOption: string, index: number) => {
    setColor(colorOption);
    setSelectedColorIndex(index);
    
    // Animación del color seleccionado
    if (colorRefs.current[index]) {
      gsap.to(colorRefs.current[index], {
        scale: 1.15,
        duration: 0.15,
        ease: "power2.out",
        yoyo: true,
        repeat: 1
      });
    }
  };

  const validateForm = () => {
    if (!nombre.trim()) {
      setError('El nombre de la carpeta es obligatorio');
      return false;
    }

    if (nombre.length > 50) {
      setError('El nombre no puede exceder 50 caracteres');
      return false;
    }

    if (descripcion && descripcion.length > 200) {
      setError('La descripción no puede exceder 200 caracteres');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        nombre: nombre.trim(),
        descripcion: descripcion.trim() || undefined,
        color: color,
        icono: 'carpeta'
      };

      await crearCarpeta(payload);
      setSuccess('¡Carpeta creada exitosamente!');
      
      // Animación de éxito
      if (modalRef.current) {
        gsap.to(modalRef.current, {
          scale: 1.02,
          duration: 0.15,
          ease: "power2.out",
          yoyo: true,
          repeat: 1
        });
      }
      
      // Cerrar después de mostrar éxito
      setTimeout(() => {
        onCarpetaCreated();
        handleClose();
      }, 1200);
      
    } catch (error) {
      console.error('Error al crear carpeta:', error);
      setError(error instanceof Error ? error.message : 'Error al crear la carpeta');
      
      // Animación de error
      if (modalRef.current) {
        gsap.to(modalRef.current, {
          x: [-5, 5, -5, 5, 0],
          duration: 0.4,
          ease: "power2.out"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Manejar tecla Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !loading) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, loading]);

  if (!isOpen) return null;

  return (
    <motion.div 
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <motion.div 
        ref={modalRef}
        className={`bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden ${
          isMobile ? 'w-full max-w-sm' : 'w-full max-w-md'
        }`}
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <motion.div 
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
              style={{ backgroundColor: color }}
              animate={{ 
                boxShadow: [`0 0 0 0 ${color}40`, `0 0 0 8px ${color}00`]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Folder className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Nueva Carpeta</h2>
              <p className="text-sm text-slate-500">Organiza tus notas</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
            disabled={loading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Mensajes */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl"
              >
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
                <button
                  onClick={() => setError('')}
                  className="ml-auto text-red-400 hover:text-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl"
              >
                <Check className="w-5 h-5 text-green-500 shrink-0" />
                <p className="text-sm text-green-700">{success}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Nombre */}
          <div className="space-y-2">
            <label htmlFor="nombre" className="block text-sm font-medium text-slate-700">
              Nombre de la carpeta *
            </label>
            <input
              ref={nameInputRef}
              type="text"
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder-slate-400"
              placeholder="Mi nueva carpeta"
              maxLength={50}
              disabled={loading}
            />
            <div className="flex justify-between text-xs text-slate-500">
              <span>Nombre descriptivo para tu carpeta</span>
              <span>{nombre.length}/50</span>
            </div>
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <label htmlFor="descripcion" className="block text-sm font-medium text-slate-700">
              Descripción <span className="text-slate-400">(opcional)</span>
            </label>
            <textarea
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all placeholder-slate-400"
              placeholder="¿Para qué usarás esta carpeta?"
              rows={2}
              maxLength={200}
              disabled={loading}
            />
            <div className="flex justify-between text-xs text-slate-500">
              <span>Ayuda a recordar el propósito</span>
              <span>{descripcion.length}/200</span>
            </div>
          </div>

          {/* Selector de color */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-slate-700">
                Color de la carpeta
              </label>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Palette className="w-3 h-3" />
                <span className="font-mono">{color}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-6 gap-3">
              {colores.map((colorOption, index) => (
                <motion.button
                  key={colorOption.value}
                  ref={(el) => colorRefs.current[index] = el}
                  type="button"
                  onClick={() => handleColorSelect(colorOption.value, index)}
                  className={`w-10 h-10 rounded-xl border-2 transition-all relative ${
                    color === colorOption.value 
                      ? 'border-slate-900 ring-2 ring-slate-200' 
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  style={{ backgroundColor: colorOption.value }}
                  title={colorOption.name}
                  disabled={loading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {color === colorOption.value && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <Check className="w-4 h-4 text-white drop-shadow-sm" />
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50/50">
          <button
            type="button"
            onClick={handleClose}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${getButtonClasses('secondary')}`}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !nombre.trim()}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all ${getButtonClasses('primary')}`}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Creando...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Crear carpeta</span>
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CrearCarpetaModal;
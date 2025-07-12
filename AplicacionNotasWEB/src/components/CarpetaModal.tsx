import { useState, useEffect } from 'react';
import { X, Folder, Palette, Image } from 'lucide-react';
import { Carpeta, CrearCarpetaRequest, ActualizarCarpetaRequest } from '../services/carpetaService';

interface CarpetaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CrearCarpetaRequest | ActualizarCarpetaRequest) => Promise<void>;
  carpeta?: Carpeta;
  mode: 'create' | 'edit';
}

const COLORS = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
  '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
];

const ICONS = [
  'folder', 'book', 'file-text', 'image', 'music',
  'video', 'archive', 'star', 'heart', 'bookmark'
];

export default function CarpetaModal({ isOpen, onClose, onSave, carpeta, mode }: CarpetaModalProps) {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [color, setColor] = useState('#3B82F6');
  const [icono, setIcono] = useState('folder');
  const [isLoading, setIsLoading] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);

  useEffect(() => {
    if (carpeta && mode === 'edit') {
      setNombre(carpeta.nombre);
      setDescripcion(carpeta.descripcion || '');
      setColor(carpeta.color);
      setIcono(carpeta.icono);
    } else {
      setNombre('');
      setDescripcion('');
      setColor('#3B82F6');
      setIcono('folder');
    }
  }, [carpeta, mode, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    setIsLoading(true);
    try {
      const data = {
        nombre: nombre.trim(),
        descripcion: descripcion.trim() || undefined,
        color,
        icono
      };

      await onSave(data);
      onClose();
    } catch (error) {
      console.error('Error al guardar carpeta:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {mode === 'create' ? 'Crear Carpeta' : 'Editar Carpeta'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre *
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nombre de la carpeta"
              required
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Descripción opcional"
              rows={3}
            />
          </div>

          {/* Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <div
                  className="w-5 h-5 rounded-full border border-gray-300"
                  style={{ backgroundColor: color }}
                />
                <span className="text-sm text-gray-700">{color}</span>
                <Palette className="w-4 h-4 text-gray-500" />
              </button>
              
              {showColorPicker && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-10">
                  <div className="grid grid-cols-5 gap-2">
                    {COLORS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => {
                          setColor(c);
                          setShowColorPicker(false);
                        }}
                        className="w-8 h-8 rounded-full border-2 border-gray-300 hover:border-gray-400 transition-colors"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Icono */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Icono
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowIconPicker(!showIconPicker)}
                className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <div
                  className="w-5 h-5 rounded flex items-center justify-center"
                  style={{ backgroundColor: color }}
                >
                  <Folder className="w-3 h-3 text-white" />
                </div>
                <span className="text-sm text-gray-700 capitalize">{icono}</span>
                <Image className="w-4 h-4 text-gray-500" />
              </button>
              
              {showIconPicker && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-10 max-h-48 overflow-y-auto">
                  <div className="grid grid-cols-5 gap-2">
                    {ICONS.map((i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          setIcono(i);
                          setShowIconPicker(false);
                        }}
                        className="w-8 h-8 rounded flex items-center justify-center hover:bg-gray-100 transition-colors"
                        style={{ backgroundColor: i === icono ? color : 'transparent' }}
                      >
                        <Folder className="w-4 h-4" style={{ color: i === icono ? 'white' : '#6B7280' }} />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading || !nombre.trim()}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Guardando...' : mode === 'create' ? 'Crear' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 
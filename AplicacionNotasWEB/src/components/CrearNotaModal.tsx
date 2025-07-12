import React, { useState } from 'react';
import { X, Save, Star, Tag, Plus } from 'lucide-react';
import { crearNota } from '../services/notaService';
import { validateNotaPayload } from '../services/notaService';
import MessageDisplay from './MessageDisplay';

interface CrearNotaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNotaCreated: () => void;
  carpetaId?: number;
  carpetaNombre?: string;
}

const CrearNotaModal: React.FC<CrearNotaModalProps> = ({
  isOpen,
  onClose,
  onNotaCreated,
  carpetaId,
  carpetaNombre
}) => {
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');
  const [etiquetas, setEtiquetas] = useState<string[]>([]);
  const [favorito, setFavorito] = useState(false);
  const [nuevaEtiqueta, setNuevaEtiqueta] = useState('');
  const [mostrarInputEtiqueta, setMostrarInputEtiqueta] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!titulo.trim()) {
      setError('El título es requerido');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        titulo: titulo.trim(),
        contenido: contenido || undefined,
        etiquetas: etiquetas.length > 0 ? etiquetas : undefined,
        favorito,
        carpetaId: carpetaId || undefined
      };

      // Validar antes de enviar
      const validationErrors = validateNotaPayload(payload);
      if (validationErrors.length > 0) {
        setError(validationErrors.join(', '));
        return;
      }

      await crearNota(payload);
      setSuccess('Nota creada exitosamente');
      
      // Limpiar formulario
      setTitulo('');
      setContenido('');
      setEtiquetas([]);
      setFavorito(false);
      setNuevaEtiqueta('');
      setMostrarInputEtiqueta(false);
      
      // Cerrar modal después de un breve delay
      setTimeout(() => {
        onNotaCreated();
        onClose();
      }, 1000);
      
    } catch (error) {
      console.error('Error al crear nota:', error);
      setError(error instanceof Error ? error.message : 'Error al crear la nota');
    } finally {
      setLoading(false);
    }
  };

  const handleAgregarEtiqueta = () => {
    const etiqueta = nuevaEtiqueta.trim().toLowerCase();
    if (etiqueta && !etiquetas.includes(etiqueta) && etiquetas.length < 10) {
      setEtiquetas([...etiquetas, etiqueta]);
      setNuevaEtiqueta('');
      setMostrarInputEtiqueta(false);
    }
  };

  const handleEliminarEtiqueta = (index: number) => {
    setEtiquetas(etiquetas.filter((_, i) => i !== index));
  };

  const handleEtiquetaKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAgregarEtiqueta();
    } else if (e.key === 'Escape') {
      setMostrarInputEtiqueta(false);
      setNuevaEtiqueta('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Crear nueva nota</h2>
            {carpetaNombre && (
              <p className="text-sm text-gray-500 mt-1">
                Se creará en la carpeta: <span className="font-medium text-blue-600">{carpetaNombre}</span>
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={loading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Mensajes */}
          {(error || success) && (
            <MessageDisplay
              message={error || success}
              type={error ? 'error' : 'success'}
              onClose={() => {
                setError('');
                setSuccess('');
              }}
            />
          )}

          {/* Título */}
          <div>
            <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-2">
              Título *
            </label>
            <input
              type="text"
              id="titulo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Título de la nota..."
              maxLength={500}
              disabled={loading}
              autoFocus
            />
          </div>

          {/* Contenido */}
          <div>
            <label htmlFor="contenido" className="block text-sm font-medium text-gray-700 mb-2">
              Contenido
            </label>
            <textarea
              id="contenido"
              value={contenido}
              onChange={(e) => setContenido(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Contenido de la nota..."
              rows={6}
              maxLength={10000}
              disabled={loading}
            />
          </div>

          {/* Etiquetas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Etiquetas
            </label>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {etiquetas.map((etiqueta, i) => (
                  <span 
                    key={i} 
                    className="bg-blue-100 text-blue-700 text-sm rounded-full px-3 py-1 flex items-center gap-2 group"
                  >
                    <Tag className="w-3 h-3" />
                    {etiqueta}
                    <button
                      type="button"
                      onClick={() => handleEliminarEtiqueta(i)}
                      className="text-blue-500 hover:text-blue-700 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                
                {mostrarInputEtiqueta ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={nuevaEtiqueta}
                      onChange={(e) => setNuevaEtiqueta(e.target.value)}
                      onKeyDown={handleEtiquetaKeyPress}
                      onBlur={handleAgregarEtiqueta}
                      className="bg-blue-50 text-blue-700 text-sm rounded-full px-3 py-1 border border-blue-200 focus:outline-none focus:border-blue-300"
                      placeholder="Nueva etiqueta..."
                      autoFocus
                      maxLength={50}
                    />
                  </div>
                ) : (
                  etiquetas.length < 10 && (
                    <button
                      type="button"
                      onClick={() => setMostrarInputEtiqueta(true)}
                      className="bg-gray-100 text-gray-600 text-sm rounded-full px-3 py-1 hover:bg-gray-200 transition-colors flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      Agregar etiqueta
                    </button>
                  )
                )}
              </div>
              
              {etiquetas.length >= 10 && (
                <p className="text-xs text-gray-500">Máximo 10 etiquetas permitidas</p>
              )}
            </div>
          </div>

          {/* Opciones */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setFavorito(!favorito)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                favorito 
                  ? 'bg-amber-100 text-amber-700 border border-amber-200' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              disabled={loading}
            >
              <Star className={`w-4 h-4 ${favorito ? 'fill-current' : ''}`} />
              Favorito
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !titulo.trim()}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              loading || !titulo.trim()
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creando...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                Crear nota
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CrearNotaModal; 
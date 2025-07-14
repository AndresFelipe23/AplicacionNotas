import React, { useState, useEffect, useCallback } from 'react';
import { 
  Save, 
  Lock, 
  Info, 
  Move, 
  Trash2, 
  FileDown, 
  Calendar, 
  Tag, 
  Folder, 
  Star, 
  Plus, 
  X, 
  MoreHorizontal,
  Clock,
  Hash
} from 'lucide-react';
import { actualizarNota, moverNota, eliminarNota } from '../services/notaService';
import TinyMCEEditor from './TinyMCEEditor';
import { convertDraftToHtml } from '../utils/draft';
import { useLocalStorage } from '../hooks/useLocalStorage';
import MoverNotaModal from './MoverNotaModal';
import type { Nota, ActualizarNotaPayload } from '../types/nota';
import { confirmDelete, showSuccess, showError } from '../utils/sweetalert';

interface NotaEditorProps {
  nota: Nota;
  onNotaUpdated?: (nota: Nota) => void;
  onNotaDeleted?: (notaId: number) => void;
}

const NotaEditor: React.FC<NotaEditorProps> = ({ nota, onNotaUpdated, onNotaDeleted }) => {
  const [titulo, setTitulo] = useState(nota.titulo);
  const [contenido, setContenido] = useState('');
  const [etiquetas, setEtiquetas] = useState<string[]>(nota.etiquetas || []);
  const [favorito, setFavorito] = useState(nota.favorito);
  const [nuevaEtiqueta, setNuevaEtiqueta] = useState('');
  const [mostrarInputEtiqueta, setMostrarInputEtiqueta] = useState(false);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [moving, setMoving] = useState(false);
  const [showMoreActions, setShowMoreActions] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
  const { saveDraft, loadDraft, clearDraft } = useLocalStorage();

  // Detectar tamaño de pantalla
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Función para guardar la nota
  const handleSave = useCallback(async () => {
    if (saving || !hasChanges) return;
    
    setSaving(true);
    
    try {
      const payload: ActualizarNotaPayload = {
        id: nota.id,
        titulo,
        contenido,
        etiquetas,
        carpetaId: nota.carpetaId,
        favorito
      };
      
      const notaActualizada = await actualizarNota(nota.id, payload);
      setLastSaved(new Date());
      setHasChanges(false);
      clearDraft(nota.id);
      onNotaUpdated?.(notaActualizada);
    } catch (error) {
      console.error('Error guardando la nota:', error);
    } finally {
      setSaving(false);
    }
  }, [contenido, titulo, etiquetas, favorito, nota, onNotaUpdated, saving, hasChanges, clearDraft]);

  // Guardado automático en localStorage
  useEffect(() => {
    if (!hasChanges) return;

    const timeoutId = setTimeout(() => {
      saveDraft(nota.id, titulo, contenido);
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [contenido, titulo, hasChanges, nota.id, saveDraft]);

  // Actualizar cuando cambia la nota seleccionada
  useEffect(() => {
    const localDraft = loadDraft(nota.id);
    
    if (localDraft) {
      setTitulo(localDraft.titulo);
      setContenido(localDraft.contenido);
      setHasChanges(true);
    } else {
      setTitulo(nota.titulo);
      const htmlContent = convertDraftToHtml(nota.contenido || '');
      setContenido(htmlContent);
      setHasChanges(false);
    }
    
    setEtiquetas(nota.etiquetas || []);
    setFavorito(nota.favorito);
    setLastSaved(null);
  }, [nota.id, nota.contenido, nota.titulo, nota.etiquetas, nota.favorito, loadDraft]);

  const handleTituloChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitulo(e.target.value);
    setHasChanges(true);
  };

  const handleContenidoChange = (content: string) => {
    setContenido(content);
    setHasChanges(true);
  };

  const handleAgregarEtiqueta = () => {
    const etiqueta = nuevaEtiqueta.trim().toLowerCase();
    if (etiqueta && !etiquetas.includes(etiqueta) && etiquetas.length < 10) {
      setEtiquetas([...etiquetas, etiqueta]);
      setNuevaEtiqueta('');
      setMostrarInputEtiqueta(false);
      setHasChanges(true);
    }
  };

  const handleEliminarEtiqueta = (index: number) => {
    setEtiquetas(etiquetas.filter((_, i) => i !== index));
    setHasChanges(true);
  };

  const handleToggleFavorito = () => {
    setFavorito(!favorito);
    setHasChanges(true);
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

  const handleMoveNota = async (carpetaId: number | null) => {
    setMoving(true);
    try {
      const notaActualizada = await moverNota(nota.id, carpetaId);
      onNotaUpdated?.(notaActualizada);
      setShowMoveModal(false);
    } catch (error) {
      console.error('Error al mover la nota:', error);
    } finally {
      setMoving(false);
    }
  };

  const handleDeleteNota = async () => {
    const result = await confirmDelete(
      '¿Eliminar nota?',
      `"${nota.titulo}" se enviará a la papelera`
    );

    if (result.isConfirmed) {
      setDeleting(true);
      try {
        await eliminarNota(nota.id);
        await showSuccess('¡Nota eliminada!', 'La nota se ha enviado a la papelera');
        onNotaDeleted?.(nota.id);
      } catch (error) {
        console.error('Error al eliminar la nota:', error);
        await showError('Error', 'No se pudo eliminar la nota');
      } finally {
        setDeleting(false);
      }
    }
  };

  const getStatusInfo = () => {
    if (saving) {
      return {
        text: 'Guardando...',
        color: 'text-blue-600',
        icon: <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      };
    }
    
    if (lastSaved && !hasChanges) {
      return {
        text: 'Guardado',
        color: 'text-green-600',
        icon: <Save className="w-3 h-3" />
      };
    }
    
    if (hasChanges) {
      return {
        text: 'Sin guardar',
        color: 'text-amber-600',
        icon: <Clock className="w-3 h-3" />
      };
    }
    
    return null;
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header responsive */}
      <div className="border-b border-slate-200 bg-white sticky top-0 z-10">
        {/* Header principal */}
        <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4">
          {/* Info de la nota */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <button
              onClick={handleToggleFavorito}
              className={`p-2 rounded-lg transition-colors shrink-0 ${
                favorito 
                  ? 'text-amber-500 bg-amber-50 hover:bg-amber-100' 
                  : 'text-slate-400 hover:text-amber-500 hover:bg-amber-50'
              }`}
              title={favorito ? 'Quitar de favoritos' : 'Marcar como favorito'}
            >
              <Star className={`w-4 h-4 ${favorito ? 'fill-current' : ''}`} />
            </button>
            
            <div className="flex items-center gap-2 text-sm text-slate-500 min-w-0">
              <Calendar className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">
                {new Date(nota.fechaCreacion).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </span>
              <span className="sm:hidden">
                {new Date(nota.fechaCreacion).toLocaleDateString('es-ES', {
                  month: 'short',
                  day: 'numeric'
                })}
              </span>
            </div>
            
            {nota.nombreCarpeta && (
              <div className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-1 rounded-md text-sm">
                <Folder className="w-3 h-3" />
                <span className="truncate max-w-24 sm:max-w-none">{nota.nombreCarpeta}</span>
              </div>
            )}
          </div>
          
          {/* Acciones */}
          <div className="flex items-center gap-2">
            {/* Estado de guardado */}
            {statusInfo && (
              <div className={`hidden sm:flex items-center gap-1 text-sm ${statusInfo.color}`}>
                {statusInfo.icon}
                <span>{statusInfo.text}</span>
              </div>
            )}
            
            {/* Botón guardar */}
            <button 
              className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg font-medium transition-all ${
                hasChanges && !saving 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md' 
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
              onClick={handleSave}
              disabled={saving || !hasChanges}
              title="Guardar nota"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span className="hidden sm:inline text-sm">
                {saving ? 'Guardando...' : 'Guardar'}
              </span>
            </button>
            
            {/* Menú de acciones (móvil) o botones individuales (desktop) */}
            {isMobile ? (
              <div className="relative">
                <button
                  onClick={() => setShowMoreActions(!showMoreActions)}
                  className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <MoreHorizontal className="w-4 h-4 text-slate-600" />
                </button>
                
                {showMoreActions && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setShowMoreActions(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-20 min-w-48">
                      <button
                        onClick={() => {
                          setShowMoveModal(true);
                          setShowMoreActions(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      >
                        <Move className="w-4 h-4" />
                        Mover a carpeta
                      </button>
                      <button 
                        onClick={handleDeleteNota}
                        disabled={deleting}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                        Eliminar
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <button 
                  className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors" 
                  title="Mover a carpeta"
                  onClick={() => setShowMoveModal(true)}
                >
                  <Move className="w-4 h-4" />
                </button>
                <button 
                  onClick={handleDeleteNota}
                  disabled={deleting}
                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50" 
                  title={deleting ? 'Eliminando...' : 'Eliminar'}
                >
                  {deleting ? (
                    <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Estado móvil */}
        {isMobile && statusInfo && (
          <div className="px-4 pb-3">
            <div className={`flex items-center gap-2 text-xs ${statusInfo.color}`}>
              {statusInfo.icon}
              <span>{statusInfo.text}</span>
            </div>
          </div>
        )}
      </div>

      {/* Contenido principal */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-4 md:py-6">
          {/* Campo de título mejorado */}
          <div className="mb-6">
            <input
              type="text"
              value={titulo}
              onChange={handleTituloChange}
              className="w-full text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 bg-transparent border-none outline-none placeholder-slate-400 focus:ring-0 resize-none"
              placeholder="Título de la nota..."
              autoComplete="off"
            />
          </div>
          
          {/* Etiquetas mejoradas */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 mb-3">
              {etiquetas.map((etiqueta, i) => (
                <span 
                  key={i} 
                  className="group inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-sm rounded-full px-3 py-1.5 transition-all hover:bg-blue-200"
                >
                  <Hash className="w-3 h-3" />
                  <span>{etiqueta}</span>
                  <button
                    onClick={() => handleEliminarEtiqueta(i)}
                    className="text-blue-500 hover:text-blue-700 opacity-0 group-hover:opacity-100 transition-opacity ml-1"
                    title="Eliminar etiqueta"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              
              {mostrarInputEtiqueta ? (
                <div className="inline-flex items-center">
                  <input
                    type="text"
                    value={nuevaEtiqueta}
                    onChange={(e) => setNuevaEtiqueta(e.target.value)}
                    onKeyDown={handleEtiquetaKeyPress}
                    onBlur={handleAgregarEtiqueta}
                    className="bg-blue-50 text-blue-700 text-sm rounded-full px-3 py-1.5 border border-blue-200 focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 min-w-32"
                    placeholder="Nueva etiqueta..."
                    autoFocus
                    maxLength={50}
                  />
                </div>
              ) : (
                etiquetas.length < 10 && (
                  <button
                    onClick={() => setMostrarInputEtiqueta(true)}
                    className="inline-flex items-center gap-2 bg-slate-100 text-slate-600 text-sm rounded-full px-3 py-1.5 hover:bg-slate-200 transition-colors"
                    title="Agregar etiqueta"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Etiqueta</span>
                  </button>
                )
              )}
            </div>
            
            {etiquetas.length >= 10 && (
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <Info className="w-3 h-3" />
                Máximo 10 etiquetas permitidas
              </p>
            )}
            
            {etiquetas.length > 0 && (
              <p className="text-xs text-slate-500">
                {etiquetas.length}/10 etiquetas
              </p>
            )}
          </div>
          
          {/* Editor de contenido */}
          <div className="min-h-96">
            <TinyMCEEditor
              value={contenido}
              onChange={handleContenidoChange}
              placeholder="Comienza a escribir tu nota..."
              height={isMobile ? "calc(100vh - 400px)" : "calc(100vh - 320px)"}
              disabled={saving}
            />
          </div>
        </div>
      </div>

      {/* Modal para mover nota */}
      <MoverNotaModal
        isOpen={showMoveModal}
        onClose={() => setShowMoveModal(false)}
        onMove={handleMoveNota}
        notaActual={nota.titulo}
        carpetaActual={nota.nombreCarpeta}
        loading={moving}
      />
    </div>
  );
};

export default NotaEditor;
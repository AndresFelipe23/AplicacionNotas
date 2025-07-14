import React, { useState, useRef, useEffect } from 'react';
import { Editor, EditorState, RichUtils, convertToRaw } from 'draft-js';
import 'draft-js/dist/Draft.css';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { 
  Save, 
  Check, 
  Star, 
  Plus, 
  X,
  Type,
  Bold,
  Italic,
  List,
  Hash,
  Sparkles
} from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { validateNotaPayload } from '../services/notaService';
import { useNotas } from '../hooks/useNotas';
import MessageDisplay from './MessageDisplay';

const toolbarOptions = [
  { style: 'BOLD', icon: Bold, label: 'Negrita' },
  { style: 'ITALIC', icon: Italic, label: 'Cursiva' },
  { style: 'header-one', icon: Type, label: 'Título', block: true },
  { style: 'unordered-list-item', icon: List, label: 'Lista', block: true },
];

const NotaRapida: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const [titulo, setTitulo] = useState('');
  const [etiquetas, setEtiquetas] = useState<string[]>([]);
  const [favorito, setFavorito] = useState(false);
  const [nuevaEtiqueta, setNuevaEtiqueta] = useState('');
  const [mostrarInputEtiqueta, setMostrarInputEtiqueta] = useState(false);
  const [saved, setSaved] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<Editor>(null);
  const { user } = useUser();
  const { crearNota, loading, error, success, clearError, clearSuccess } = useNotas();

  // Animación de expansión con GSAP
  useEffect(() => {
    if (expanded && containerRef.current) {
      gsap.fromTo(containerRef.current, 
        { 
          scale: 0.95,
          opacity: 0.8,
        },
        { 
          scale: 1,
          opacity: 1,
          duration: 0.4,
          ease: "back.out(1.2)"
        }
      );
    }
  }, [expanded]);

  const handleExpand = () => {
    setExpanded(true);
    setSaved(false);
    clearError();
    clearSuccess();
    setTimeout(() => editorRef.current?.focus(), 100);
  };

  const handleCollapse = () => {
    if (loading) return;
    
    setExpanded(false);
    setEditorState(EditorState.createEmpty());
    setTitulo('');
    setEtiquetas([]);
    setFavorito(false);
    setNuevaEtiqueta('');
    setMostrarInputEtiqueta(false);
    setSaved(false);
    clearError();
    clearSuccess();
  };

  const handleSave = async () => {
    if (!titulo.trim() || !user) return;
    
    const content = editorState.getCurrentContent();
    const rawContent = convertToRaw(content);
    const contenido = JSON.stringify(rawContent);
    
    const validationErrors = validateNotaPayload({
      titulo: titulo.trim(),
      contenido: contenido,
      etiquetas: etiquetas.length > 0 ? etiquetas : undefined,
      favorito
    });
    
    if (validationErrors.length > 0) return;

    await crearNota({
      titulo: titulo.trim(),
      contenido: contenido,
      etiquetas: etiquetas.length > 0 ? etiquetas : undefined,
      favorito,
      carpetaId: undefined
    });
    
    if (success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const handleToolbarClick = (style: string, block = false) => {
    if (block) {
      setEditorState(RichUtils.toggleBlockType(editorState, style));
    } else {
      setEditorState(RichUtils.toggleInlineStyle(editorState, style));
    }
  };

  const handleAgregarEtiqueta = () => {
    const etiqueta = nuevaEtiqueta.trim().toLowerCase();
    if (etiqueta && !etiquetas.includes(etiqueta) && etiquetas.length < 5) {
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

  const canSave = titulo.trim() && user && !loading;
  const hasContent = titulo.trim() || editorState.getCurrentContent().getPlainText().trim();

  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      <motion.div
        ref={containerRef}
        layout
        className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
        whileHover={{ shadow: "0 10px 25px -3px rgba(0, 0, 0, 0.1)" }}
        transition={{ duration: 0.2 }}
      >
        {/* Vista colapsada */}
        <AnimatePresence mode="wait">
          {!expanded ? (
            <motion.div
              key="collapsed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-8 cursor-pointer group"
              onClick={handleExpand}
            >
              <div className="flex items-center gap-6 mb-6">
                <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                  <Sparkles className="w-7 h-7 text-slate-600 group-hover:text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">Nota Rápida</h3>
                  <p className="text-slate-500">Captura tus ideas al instante</p>
                </div>
              </div>
              
              <div className="bg-slate-50 rounded-xl p-8 border border-slate-100 group-hover:border-blue-200 group-hover:bg-blue-50/50 transition-all min-h-32">
                <p className="text-slate-400 text-center text-lg">
                  Haz clic para empezar a escribir...
                </p>
              </div>
            </motion.div>
          ) : (
            /* Vista expandida */
            <motion.div
              key="expanded"
              initial={{ opacity: 0, height: 300 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 300 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="divide-y divide-slate-100"
            >
              {/* Header con acciones */}
              <div className="p-6 bg-slate-50/50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setFavorito(!favorito)}
                      className={`p-3 rounded-lg transition-colors ${
                        favorito 
                          ? 'text-amber-500 bg-amber-50' 
                          : 'text-slate-400 hover:text-amber-500 hover:bg-amber-50'
                      }`}
                    >
                      <Star className={`w-5 h-5 ${favorito ? 'fill-current' : ''}`} />
                    </button>
                    
                    {(loading || saved) && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`flex items-center gap-2 ${
                          loading ? 'text-blue-600' : 'text-green-600'
                        }`}
                      >
                        {loading ? (
                          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Check className="w-4 h-4" />
                        )}
                        <span>{loading ? 'Guardando...' : 'Guardado'}</span>
                      </motion.div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleSave}
                      disabled={!canSave}
                      className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                        canSave
                          ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md'
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Save className="w-5 h-5" />
                      )}
                      <span>Guardar</span>
                    </button>
                    
                    <button
                      onClick={handleCollapse}
                      disabled={loading}
                      className="p-3 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                {/* Toolbar minimalista */}
                <div className="flex items-center gap-2">
                  {toolbarOptions.map(opt => {
                    const IconComponent = opt.icon;
                    return (
                      <button
                        key={opt.style}
                        className="p-3 text-slate-500 hover:text-slate-700 hover:bg-white rounded-lg transition-all"
                        onMouseDown={e => { e.preventDefault(); handleToolbarClick(opt.style, !!opt.block); }}
                        title={opt.label}
                      >
                        <IconComponent className="w-5 h-5" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Mensajes */}
              <AnimatePresence>
                {(error || success) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-4 py-2"
                  >
                    <MessageDisplay
                      error={error}
                      success={success}
                      onClearError={clearError}
                      onClearSuccess={clearSuccess}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Contenido */}
              <div className="p-6 space-y-6">
                {/* Título */}
                <input
                  type="text"
                  value={titulo}
                  onChange={e => setTitulo(e.target.value)}
                  className="w-full text-2xl font-semibold text-slate-900 placeholder-slate-400 bg-transparent border-none outline-none focus:ring-0"
                  placeholder="Título de tu nota..."
                  disabled={loading}
                />

                {/* Etiquetas */}
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <AnimatePresence>
                      {etiquetas.map((etiqueta, i) => (
                        <motion.span
                          key={etiqueta}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="group inline-flex items-center gap-2 bg-blue-100 text-blue-700 rounded-full px-4 py-2"
                        >
                          <Hash className="w-4 h-4" />
                          <span>{etiqueta}</span>
                          <button
                            onClick={() => handleEliminarEtiqueta(i)}
                            className="opacity-0 group-hover:opacity-100 text-blue-500 hover:text-blue-700 transition-all"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </motion.span>
                      ))}
                    </AnimatePresence>
                    
                    {mostrarInputEtiqueta ? (
                      <motion.input
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        type="text"
                        value={nuevaEtiqueta}
                        onChange={(e) => setNuevaEtiqueta(e.target.value)}
                        onKeyDown={handleEtiquetaKeyPress}
                        onBlur={handleAgregarEtiqueta}
                        className="bg-blue-50 text-blue-700 rounded-full px-4 py-2 border border-blue-200 focus:outline-none focus:border-blue-400 min-w-32"
                        placeholder="Nueva etiqueta..."
                        autoFocus
                        maxLength={30}
                      />
                    ) : (
                      etiquetas.length < 5 && (
                        <button
                          onClick={() => setMostrarInputEtiqueta(true)}
                          className="inline-flex items-center gap-2 bg-slate-100 text-slate-600 rounded-full px-4 py-2 hover:bg-slate-200 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Agregar etiqueta</span>
                        </button>
                      )
                    )}
                  </div>
                  
                  {etiquetas.length >= 5 && (
                    <p className="text-sm text-slate-500">Máximo 5 etiquetas</p>
                  )}
                </div>

                {/* Editor */}
                <div 
                  className="min-h-64 cursor-text text-slate-700 text-lg leading-relaxed bg-slate-50/50 rounded-lg p-6 border border-slate-100 focus-within:border-blue-200 focus-within:bg-white transition-all"
                  onClick={() => editorRef.current?.focus()}
                >
                  <Editor
                    ref={editorRef}
                    editorState={editorState}
                    onChange={setEditorState}
                    placeholder="Escribe tu contenido aquí..."
                    readOnly={loading}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default NotaRapida;
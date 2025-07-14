import React, { useState, useMemo, useEffect } from 'react';
import { useNotas } from '../hooks/useNotas';
import NotaMiniCard from '../components/NotaMiniCard';
import NotaEditor from '../components/NotaEditor';
import SearchBar from '../components/SearchBar';
import EtiquetasStats from '../components/EtiquetasStats';
import CrearNotaModal from '../components/CrearNotaModal';
import CrearCarpetaModal from '../components/CrearCarpetaModal';
import { stripHtml } from '../utils/draft';
import { 
  Star, 
  Tag, 
  Filter, 
  BarChart3, 
  Folder, 
  ChevronRight, 
  Plus, 
  ArrowLeft,
  Search,
  Settings,
  Grid3X3,
  List
} from 'lucide-react';
import { getCarpetas } from '../services/carpetaService';
import type { Nota } from '../types/nota';
import type { Carpeta } from '../types/carpeta';

const Notas: React.FC = () => {
  const { notas, loading, refetch } = useNotas();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedCarpeta, setSelectedCarpeta] = useState<number | null>(null);
  const [showStats, setShowStats] = useState(false);
  const [carpetas, setCarpetas] = useState<Carpeta[]>([]);
  const [loadingCarpetas, setLoadingCarpetas] = useState(false);
  const [showCrearNotaModal, setShowCrearNotaModal] = useState(false);
  const [showCrearCarpetaModal, setShowCrearCarpetaModal] = useState(false);
  const [selectedCarpetaForNota, setSelectedCarpetaForNota] = useState<{ id: number; nombre: string } | null>(null);
  
  // Estados para responsividad
  const [isMobile, setIsMobile] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // Detectar tamaño de pantalla
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setShowSidebar(false);
      } else {
        setShowSidebar(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Obtener todas las etiquetas únicas
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    notas.forEach(nota => {
      nota.etiquetas?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [notas]);

  // Cargar carpetas
  useEffect(() => {
    const loadCarpetas = async () => {
      setLoadingCarpetas(true);
      try {
        const carpetasData = await getCarpetas();
        setCarpetas(carpetasData);
      } catch (error) {
        console.error('Error cargando carpetas:', error);
      } finally {
        setLoadingCarpetas(false);
      }
    };

    loadCarpetas();
  }, []);

  // Obtener carpetas con notas
  const carpetasConNotas = useMemo(() => {
    return carpetas.map(carpeta => {
      const notasEnCarpeta = notas.filter(nota => nota.carpetaId === carpeta.id);
      return {
        ...carpeta,
        cantidadNotas: notasEnCarpeta.length
      };
    }).filter(carpeta => carpeta.cantidadNotas > 0);
  }, [carpetas, notas]);

  // Filtrado de notas
  const filteredNotas = useMemo(() => {
    let filtered = notas;

    if (search) {
      const term = search.toLowerCase();
      filtered = filtered.filter(nota =>
        nota.titulo.toLowerCase().includes(term) ||
        (nota.etiquetas && nota.etiquetas.some(e => e.toLowerCase().includes(term))) ||
        stripHtml(nota.contenido || '').toLowerCase().includes(term)
      );
    }

    if (showFavorites) {
      filtered = filtered.filter(nota => nota.favorito);
    }

    if (selectedTag) {
      filtered = filtered.filter(nota => 
        nota.etiquetas && nota.etiquetas.includes(selectedTag)
      );
    }

    if (selectedCarpeta !== null) {
      if (selectedCarpeta === 0) {
        filtered = filtered.filter(nota => !nota.carpetaId);
      } else {
        filtered = filtered.filter(nota => nota.carpetaId === selectedCarpeta);
      }
    }

    return filtered;
  }, [notas, search, showFavorites, selectedTag, selectedCarpeta]);

  const selectedNota = filteredNotas.find(n => n.id === selectedId) || filteredNotas[0];

  useEffect(() => {
    if (!selectedId && filteredNotas.length > 0) {
      setSelectedId(filteredNotas[0].id);
    }
  }, [filteredNotas, selectedId]);

  const handleNotaUpdated = (notaActualizada: Nota) => {
    refetch();
  };

  const handleNotaDeleted = (notaId: number) => {
    refetch();
    // Si la nota eliminada era la seleccionada, seleccionar la primera disponible
    if (selectedId === notaId) {
      const notasRestantes = filteredNotas.filter(n => n.id !== notaId);
      if (notasRestantes.length > 0) {
        setSelectedId(notasRestantes[0].id);
      } else {
        setSelectedId(null);
      }
    }
  };

  const clearFilters = () => {
    setSearch('');
    setShowFavorites(false);
    setSelectedTag(null);
    setSelectedCarpeta(null);
  };

  const hasActiveFilters = search || showFavorites || selectedTag || selectedCarpeta !== null;

  const handleCrearNota = (carpetaId?: number, carpetaNombre?: string) => {
    setSelectedCarpetaForNota(carpetaId && carpetaNombre ? { id: carpetaId, nombre: carpetaNombre } : null);
    setShowCrearNotaModal(true);
  };

  const handleNotaCreated = () => {
    refetch();
    if (isMobile) {
      setShowSidebar(false);
    }
  };

  const handleCarpetaCreated = () => {
    const loadCarpetas = async () => {
      setLoadingCarpetas(true);
      try {
        const carpetasData = await getCarpetas();
        setCarpetas(carpetasData);
      } catch (error) {
        console.error('Error cargando carpetas:', error);
      } finally {
        setLoadingCarpetas(false);
      }
    };
    loadCarpetas();
  };

  const handleNotaSelect = (notaId: number) => {
    setSelectedId(notaId);
    if (isMobile) {
      setShowSidebar(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-slate-50">
        <div className="flex items-center gap-3 text-slate-600">
          <div className="w-5 h-5 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin" />
          <span>Cargando notas...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-white">
      {/* Overlay para móvil */}
      {isMobile && showSidebar && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Sidebar de notas */}
      <aside 
        className={`
          ${isMobile ? 'fixed' : 'relative'} top-0 left-0 z-50 h-full
          bg-white flex flex-col
          transition-all duration-300 ease-in-out
          ${isMobile 
            ? (showSidebar ? 'translate-x-0 w-80' : '-translate-x-full w-80')
            : 'w-80 translate-x-0'
          }
        `}
      >
        {/* Header del sidebar */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 bg-white shrink-0">
          <div className="flex items-center gap-3">
            {isMobile && (
              <button
                onClick={() => setShowSidebar(false)}
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 text-slate-600" />
              </button>
            )}
            <h1 className="text-lg font-semibold text-slate-900">Notas</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
              title={`Cambiar a vista ${viewMode === 'list' ? 'en cuadrícula' : 'en lista'}`}
            >
              {viewMode === 'list' ? (
                <Grid3X3 className="w-4 h-4 text-slate-600" />
              ) : (
                <List className="w-4 h-4 text-slate-600" />
              )}
            </button>
            
            <button
              onClick={() => setShowStats(!showStats)}
              className={`p-2 rounded-lg transition-colors ${
                showStats 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'hover:bg-slate-100 text-slate-600'
              }`}
              title="Estadísticas"
            >
              <BarChart3 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Barra de búsqueda */}
        <div className="p-4 border-b border-slate-200 shrink-0">
          <SearchBar onSearch={setSearch} />
          
          {/* Filtros rápidos */}
          <div className="mt-4 flex items-center gap-2">
            <button
              onClick={() => setShowFavorites(!showFavorites)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                showFavorites 
                  ? 'bg-amber-100 text-amber-700 border border-amber-200' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Star className={`w-4 h-4 ${showFavorites ? 'fill-current' : ''}`} />
              Favoritos
            </button>
            
            <button
              onClick={() => setShowCrearCarpetaModal(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Crear carpeta
            </button>
          </div>

          {/* Indicador de filtros activos */}
          {hasActiveFilters && (
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-slate-600">
                {filteredNotas.length} de {notas.length} notas
              </span>
              <button
                onClick={clearFilters}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Limpiar
              </button>
            </div>
          )}
        </div>

        {/* Contenido del sidebar */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {/* Estadísticas de etiquetas */}
          {showStats && (
            <div className="p-4 border-b border-slate-200 bg-slate-50 shrink-0">
              <EtiquetasStats 
                notas={notas}
                selectedTag={selectedTag}
                onTagSelect={setSelectedTag}
              />
            </div>
          )}

          {/* Carpetas */}
          {!showStats && (
            <div className="p-4 border-b border-slate-200 shrink-0">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Folder className="w-4 h-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-700">Carpetas</span>
                </div>
                <button
                  onClick={() => setShowCrearCarpetaModal(true)}
                  className="p-1 rounded hover:bg-slate-100 transition-colors"
                  title="Crear carpeta"
                >
                  <Plus className="w-3 h-3 text-slate-500" />
                </button>
              </div>
              
              <div className="space-y-1">
                {/* Todas las notas */}
                <button
                  onClick={() => setSelectedCarpeta(null)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedCarpeta === null 
                      ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Folder className="w-4 h-4 text-slate-400" />
                    <span>Todas</span>
                  </div>
                  <span className="text-xs text-slate-500">{notas.length}</span>
                </button>

                {/* Sin carpeta */}
                {notas.filter(n => !n.carpetaId).length > 0 && (
                  <button
                    onClick={() => setSelectedCarpeta(0)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedCarpeta === 0 
                        ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Folder className="w-4 h-4 text-slate-400" />
                      <span>Sin carpeta</span>
                    </div>
                    <span className="text-xs text-slate-500">
                      {notas.filter(n => !n.carpetaId).length}
                    </span>
                  </button>
                )}

                {/* Carpetas con notas */}
                {carpetasConNotas.map(carpeta => (
                  <button
                    key={carpeta.id}
                    onClick={() => setSelectedCarpeta(selectedCarpeta === carpeta.id ? null : carpeta.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedCarpeta === carpeta.id 
                        ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Folder 
                        className="w-4 h-4" 
                        style={{ color: carpeta.color || '#64748b' }}
                      />
                      <span className="truncate">{carpeta.nombre}</span>
                    </div>
                    <span className="text-xs text-slate-500">{carpeta.cantidadNotas}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Etiquetas rápidas */}
          {!showStats && allTags.length > 0 && (
            <div className="p-4 border-b border-slate-200 shrink-0">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-4 h-4 text-slate-500" />
                <span className="text-sm font-medium text-slate-700">Etiquetas</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {allTags.slice(0, 8).map(tag => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                    className={`px-2 py-1 text-xs rounded-md transition-colors ${
                      selectedTag === tag
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
                {allTags.length > 8 && (
                  <span className="px-2 py-1 text-xs text-slate-500">
                    +{allTags.length - 8}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Lista de notas - Esta es la sección que ahora toma todo el espacio restante */}
          <div className="flex-1 p-4 overflow-y-auto">
            {filteredNotas.length === 0 ? (
              <div className="text-center py-8">
                {hasActiveFilters ? (
                  <div className="space-y-3">
                    <Filter className="w-12 h-12 mx-auto text-slate-300" />
                    <div>
                      <p className="font-medium text-slate-600">No se encontraron notas</p>
                      <p className="text-sm text-slate-500">Intenta con otros filtros</p>
                    </div>
                    <button
                      onClick={clearFilters}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Limpiar filtros
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Search className="w-12 h-12 mx-auto text-slate-300" />
                    <div>
                      <p className="font-medium text-slate-600">No hay notas</p>
                      <p className="text-sm text-slate-500">Crea tu primera nota</p>
                    </div>
                    <button
                      onClick={() => setShowCrearNotaModal(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      <Plus className="w-4 h-4" />
                      Crear nota
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className={`space-y-2 ${viewMode === 'grid' ? 'grid grid-cols-1 gap-2' : ''}`}>
                {filteredNotas.map(nota => (
                  <NotaMiniCard
                    key={nota.id}
                    nota={nota}
                    selected={selectedId === nota.id}
                    onClick={() => handleNotaSelect(nota.id)}
                    compact={viewMode === 'grid'}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 flex flex-col">
        {/* Header móvil del editor */}
        {isMobile && selectedNota && (
          <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4">
            <button
              onClick={() => setShowSidebar(true)}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-slate-600" />
            </button>
            <div className="flex-1 text-center">
              <h2 className="font-medium text-slate-900 truncate">{selectedNota.titulo}</h2>
            </div>
            <div className="w-9"></div>
          </div>
        )}

        {/* Editor de notas */}
        {selectedNota ? (
          <NotaEditor
            nota={selectedNota}
            onNotaUpdated={handleNotaUpdated}
            onNotaDeleted={handleNotaDeleted}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-3">
              <Search className="w-16 h-16 mx-auto text-slate-300" />
              <div>
                <p className="text-lg font-medium text-slate-600">
                  {isMobile ? 'Selecciona una nota' : 'Selecciona una nota para editar'}
                </p>
                <p className="text-slate-500">
                  {isMobile ? 'Toca el menú para ver tus notas' : 'Elige una nota del panel lateral'}
                </p>
              </div>
              {isMobile && (
                <button
                  onClick={() => setShowSidebar(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <Search className="w-4 h-4" />
                  Ver notas
                </button>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Modales */}
      <CrearNotaModal
        isOpen={showCrearNotaModal}
        onClose={() => setShowCrearNotaModal(false)}
        onNotaCreated={handleNotaCreated}
        carpetaId={selectedCarpetaForNota?.id}
        carpetaNombre={selectedCarpetaForNota?.nombre}
      />

      <CrearCarpetaModal
        isOpen={showCrearCarpetaModal}
        onClose={() => setShowCrearCarpetaModal(false)}
        onCarpetaCreated={handleCarpetaCreated}
      />
    </div>
  );
};

export default Notas;
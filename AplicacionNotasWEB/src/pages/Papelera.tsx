import React, { useState, useEffect } from 'react';
import { Trash2, FileText, FolderOpen, CheckSquare, RotateCcw, Trash, Eye } from 'lucide-react';
import { papeleraService, ElementoPapelera } from '../services/papeleraService';
import { confirmDelete, showSuccess, showError } from '../utils/sweetalert';
import { usePapelera } from '../contexts/PapeleraContext';

const Papelera: React.FC = () => {
  const [elementos, setElementos] = useState<ElementoPapelera[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { actualizarContador } = usePapelera();

  useEffect(() => {
    cargarPapelera();
  }, []);

  const cargarPapelera = async () => {
    try {
      setLoading(true);
      const elementos = await papeleraService.obtenerElementos();
      setElementos(elementos);
      await actualizarContador();
    } catch (error) {
      console.error('Error al cargar papelera:', error);
      setError('Error al cargar la papelera');
    } finally {
      setLoading(false);
    }
  };

  const restaurarElemento = async (tipo: string, id: number) => {
    try {
      await papeleraService.restaurarElemento(tipo, id);
      await showSuccess('Elemento restaurado', 'El elemento se ha restaurado exitosamente');
      await cargarPapelera();
      await actualizarContador();
    } catch (error) {
      console.error('Error al restaurar elemento:', error);
      await showError('Error', 'No se pudo restaurar el elemento');
    }
  };

  const eliminarPermanente = async (tipo: string, id: number) => {
    const result = await confirmDelete(
      '¿Eliminar permanentemente?',
      'Esta acción no se puede deshacer. El elemento se eliminará definitivamente.'
    );

    if (result.isConfirmed) {
      try {
        await papeleraService.eliminarPermanente(tipo, id);
        await showSuccess('Elemento eliminado', 'El elemento se ha eliminado permanentemente');
        await cargarPapelera();
        await actualizarContador();
      } catch (error) {
        console.error('Error al eliminar permanentemente:', error);
        await showError('Error', 'No se pudo eliminar el elemento');
      }
    }
  };

  const vaciarPapelera = async () => {
    const result = await confirmDelete(
      '¿Vaciar papelera?',
      'Se eliminarán permanentemente todos los elementos. Esta acción no se puede deshacer.'
    );

    if (result.isConfirmed) {
      try {
        await papeleraService.vaciarPapelera();
        await showSuccess('Papelera vaciada', 'Todos los elementos han sido eliminados permanentemente');
      await cargarPapelera();
        await actualizarContador();
    } catch (error) {
        console.error('Error al vaciar papelera:', error);
        await showError('Error', 'No se pudo vaciar la papelera');
      }
    }
  };

  const getIcono = (tipo: string) => {
    switch (tipo) {
      case 'Nota':
        return <FileText className="w-5 h-5" />;
      case 'Carpeta':
        return <FolderOpen className="w-5 h-5" />;
      case 'Tarea':
        return <CheckSquare className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getColorTipo = (tipo: string) => {
    switch (tipo) {
      case 'Nota':
        return 'bg-blue-100 text-blue-800';
      case 'Carpeta':
        return 'bg-purple-100 text-purple-800';
      case 'Tarea':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-gray-600">Cargando papelera...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="text-red-600 mb-4">{error}</div>
          <button 
            onClick={cargarPapelera}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-100 rounded-lg">
              <Trash2 className="w-8 h-8 text-red-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Papelera</h1>
              <p className="text-gray-600">Elementos eliminados recientemente</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {elementos.length > 0 && (
              <button
                onClick={vaciarPapelera}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Vaciar Papelera
              </button>
            )}
          <button
            onClick={cargarPapelera}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Actualizar
          </button>
          </div>
        </div>

        {/* Lista de elementos */}
        {elementos.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Trash2 className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-600 mb-2">Papelera vacía</h3>
            <p className="text-gray-500">No hay elementos eliminados</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {elementos.map((elemento, index) => (
              <div
                key={`${elemento.tipo}-${elemento.id}`}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      {getIcono(elemento.tipo)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{elemento.titulo}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getColorTipo(elemento.tipo)}`}>
                          {elemento.tipo}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Eliminado: {new Date(elemento.fechaEliminacion).toLocaleDateString()}</span>
                        {elemento.nombreCarpeta && (
                          <span>Carpeta: {elemento.nombreCarpeta}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => restaurarElemento(elemento.tipo, elemento.id)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Restaurar"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => eliminarPermanente(elemento.tipo, elemento.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar permanentemente"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Papelera; 
import React, { useState, useEffect, useRef } from 'react';
import { X, Folder, FolderOpen } from 'lucide-react';
import { getCarpetas } from '../services/carpetaService';
import { motion, AnimatePresence } from 'framer-motion';
import type { Carpeta } from '../types/carpeta';

interface MoverNotaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMove: (carpetaId: number | null) => void;
  notaActual?: string;
  carpetaActual?: string;
  loading?: boolean;
}

const MoverNotaModal: React.FC<MoverNotaModalProps> = ({
  isOpen,
  onClose,
  onMove,
  notaActual,
  carpetaActual,
  loading = false
}) => {
  const [carpetas, setCarpetas] = useState<Carpeta[]>([]);
  const [selectedCarpetaId, setSelectedCarpetaId] = useState<number | null>(null);
  const [loadingCarpetas, setLoadingCarpetas] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      loadCarpetas();
    }
  }, [isOpen]);

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

  const handleMove = () => {
    onMove(selectedCarpetaId);
  };

  const handleSelectCarpeta = (carpetaId: number | null) => {
    setSelectedCarpetaId(carpetaId);
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            ref={modalRef}
            className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[80vh] overflow-hidden"
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ duration: 0.4, ease: 'backOut' }}
          >
            {/* Header */}
            <motion.div
              className="flex items-center justify-between p-6 border-b border-gray-200"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              <h2 className="text-xl font-semibold text-gray-900">Mover nota</h2>
              <motion.button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-5 h-5" />
              </motion.button>
            </motion.div>

            {/* Content */}
            <div className="p-6">
              {notaActual && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-1">Nota:</p>
                  <p className="text-gray-900 font-medium truncate">{notaActual}</p>
                </div>
              )}

              {carpetaActual && (
                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-1">Carpeta actual:</p>
                  <div className="flex items-center gap-2 text-blue-600">
                    <Folder className="w-4 h-4" />
                    <span className="font-medium">{carpetaActual}</span>
                  </div>
                </div>
              )}

              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-3">Seleccionar carpeta de destino:</p>
                {loadingCarpetas ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {/* Opción "Sin carpeta" */}
                    <button
                      onClick={() => handleSelectCarpeta(null)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                        selectedCarpetaId === null
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      <FolderOpen className="w-5 h-5" />
                      <span className="font-medium">Sin carpeta</span>
                    </button>

                    {/* Lista de carpetas */}
                    {carpetas.map((carpeta) => (
                      <button
                        key={carpeta.id}
                        onClick={() => handleSelectCarpeta(carpeta.id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                          selectedCarpetaId === carpeta.id
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                        }`}
                      >
                        <Folder
                          className="w-5 h-5"
                          style={{ color: carpeta.color || '#6B7280' }}
                        />
                        <div className="flex-1 text-left">
                          <span className="font-medium">{carpeta.nombre}</span>
                          {carpeta.descripcion && (
                            <p className="text-sm text-gray-500 truncate">{carpeta.descripcion}</p>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <motion.div
              className="flex items-center justify-end gap-3 p-6 border-t border-gray-200"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <motion.button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                disabled={loading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cancelar
              </motion.button>
              <motion.button
                onClick={handleMove}
                disabled={loading}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  loading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
                whileHover={!loading ? { scale: 1.05 } : {}}
                whileTap={!loading ? { scale: 0.95 } : {}}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Moviendo...
                  </div>
                ) : (
                  'Mover nota'
                )}
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MoverNotaModal; 
import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { X, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface VerificarPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerifyPin: (pin: string) => Promise<boolean>;
}

export const VerificarPinModal: React.FC<VerificarPinModalProps> = ({
  isOpen,
  onClose,
  onVerifyPin
}) => {
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (pin.length < 4) {
      setError('El PIN debe tener al menos 4 dígitos');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      const isValid = await onVerifyPin(pin);
      
      if (isValid) {
        onClose();
        setPin('');
      } else {
        setError('PIN incorrecto. Inténtalo de nuevo.');
        setPin('');
      }
    } catch (err) {
      setError('Error al verificar el PIN. Inténtalo de nuevo.');
      setPin('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
      setPin('');
      setError('');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog
          as="div"
          className="fixed inset-0 z-50 overflow-y-auto"
          onClose={handleClose}
        >
          <div className="min-h-screen px-4 text-center">
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl dark:bg-gray-800"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg dark:bg-blue-900">
                    <Lock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-white">
                      Verificar PIN del Diario
                    </Dialog.Title>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Ingresa tu PIN para acceder al diario
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  disabled={isLoading}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="pin" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    PIN
                  </label>
                  <input
                    type="password"
                    id="pin"
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="1234"
                    maxLength={8}
                    disabled={isLoading}
                    autoFocus
                    required
                  />
                </div>

                {error && (
                  <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-900 dark:text-red-200">
                    {error}
                  </div>
                )}

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isLoading}
                    className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-transparent rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || pin.length < 4}
                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Verificando...' : 'Verificar PIN'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
}; 
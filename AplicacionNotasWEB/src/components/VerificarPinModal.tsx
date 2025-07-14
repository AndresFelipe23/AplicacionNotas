import React, { useState } from 'react';
import { X, Lock } from 'lucide-react';
import { CrearPinModal } from './CrearPinModal';

interface VerificarPinModalProps {
  isOpen: boolean;
  onClose: (reason?: 'success' | 'cancel') => void;
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
  const [showForgotPin, setShowForgotPin] = useState(false); // Nuevo estado
  const [password, setPassword] = useState('');
  const [isVerifyingPassword, setIsVerifyingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [showCrearPin, setShowCrearPin] = useState(false);
  const [pinResetSuccess, setPinResetSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (pin.length < 4) {
      setError('El PIN debe tener al menos 4 dígitos');
      console.log('[PIN] PIN demasiado corto');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      console.log('[PIN] Verificando PIN...');
      const isValid = await onVerifyPin(pin);
      
      if (isValid) {
        console.log('[PIN] PIN correcto, cerrando modal');
        onClose('success');
        setPin('');
      } else {
        console.log('[PIN] PIN incorrecto, mostrando error');
        setError('PIN incorrecto. Inténtalo de nuevo.');
        setPin('');
      }
    } catch (err) {
      console.log('[PIN] Error al verificar el PIN:', err);
      setError('Error al verificar el PIN. Inténtalo de nuevo.');
      setPin('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      console.log('[PIN] Modal cerrado por el usuario (cancelar o X)');
      onClose('cancel');
      setPin('');
      setError('');
    }
  };

  // Lógica para verificar la contraseña
  const handleVerifyPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifyingPassword(true);
    setPasswordError('');
    setPasswordSuccess(false);
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const token = localStorage.getItem('token'); // Ajusta el nombre si tu token se guarda con otra clave
      const res = await fetch(`${apiUrl}/usuario/diario/verificar-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      if (data.success) {
        setPasswordSuccess(true);
        setPasswordError('');
        // Aquí luego se mostrará el modal para crear el nuevo PIN
      } else {
        setPasswordError('Contraseña incorrecta. Inténtalo de nuevo.');
      }
    } catch (err) {
      setPasswordError('Error al verificar la contraseña.');
    } finally {
      setIsVerifyingPassword(false);
    }
  };

  // Handler para crear el nuevo PIN tras verificación de contraseña
  const handleCrearNuevoPin = async (pin: string) => {
    // Aquí puedes reutilizar la lógica de tu servicio para crear el PIN
    const apiUrl = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${apiUrl}/usuario/diario/pin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ pin })
      });
      const data = await res.json();
      if (data.success) {
        setShowCrearPin(false);
        setPinResetSuccess(true);
      }
    } catch (err) {
      // Podrías mostrar un error aquí si lo deseas
    }
  };

  if (!isOpen) return null;

  // Si el usuario hace clic en '¿Olvidaste tu PIN?', por ahora solo mostramos un mensaje
  if (showForgotPin) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 p-8 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Restablecer PIN del Diario</h3>
          {showCrearPin ? (
            <CrearPinModal
              isOpen={true}
              onClose={() => { setShowCrearPin(false); setShowForgotPin(false); }}
              onCreatePin={handleCrearNuevoPin}
            />
          ) : pinResetSuccess ? (
            <div>
              <div className="text-green-600 font-semibold mb-4">¡PIN restablecido exitosamente!</div>
              <button
                onClick={() => { setPinResetSuccess(false); setShowForgotPin(false); }}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700"
              >
                Cerrar
              </button>
            </div>
          ) : !passwordSuccess ? (
            <form onSubmit={handleVerifyPassword} className="space-y-4">
              <p className="text-gray-700 mb-2">Para restablecer tu PIN, primero verifica tu contraseña de usuario.</p>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Contraseña"
                required
                disabled={isVerifyingPassword}
              />
              {passwordError && <div className="text-red-600 text-sm">{passwordError}</div>}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForgotPin(false)}
                  className="flex-1 px-4 py-2 rounded-lg bg-gray-200 text-gray-800 font-medium hover:bg-gray-300"
                  disabled={isVerifyingPassword}
                >
                  Volver
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700"
                  disabled={isVerifyingPassword || !password}
                >
                  {isVerifyingPassword ? 'Verificando...' : 'Verificar'}
                </button>
              </div>
            </form>
          ) : (
            <div>
              <div className="text-green-600 font-semibold mb-4">¡Contraseña verificada!</div>
              <div className="mb-4">Ahora puedes crear un nuevo PIN para tu diario.</div>
              <button
                onClick={() => setShowCrearPin(true)}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700"
              >
                Crear nuevo PIN
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
              <Lock className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Verificar PIN del Diario
              </h3>
              <p className="text-sm text-gray-500">
                Ingresa tu PIN para acceder al diario
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <div>
            <label htmlFor="pin" className="block text-sm font-medium text-gray-700 mb-2">
              PIN
            </label>
            <input
              type="password"
              id="pin"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="1234"
              maxLength={8}
              disabled={isLoading}
              autoFocus
              required
            />
          </div>
          {error && (
            <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg">
              {error}
            </div>
          )}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-transparent rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading || pin.length < 4}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Verificando...' : 'Verificar'}
            </button>
          </div>
          <div className="pt-4 text-center">
            <button
              type="button"
              className="text-blue-600 hover:underline text-sm font-medium"
              onClick={() => setShowForgotPin(true)}
            >
              ¿Olvidaste tu PIN?
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 
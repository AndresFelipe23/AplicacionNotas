import React, { useEffect } from 'react';
import { AlertCircle, CheckCircle, X } from 'lucide-react';

interface MessageDisplayProps {
  error: string | null;
  success: boolean;
  onClearError: () => void;
  onClearSuccess: () => void;
}

const MessageDisplay: React.FC<MessageDisplayProps> = ({
  error,
  success,
  onClearError,
  onClearSuccess,
}) => {
  // Auto-clear success message after 3 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        onClearSuccess();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, onClearSuccess]);

  if (!error && !success) return null;

  return (
    <div className="flex flex-col gap-2">
      {error && (
        <div className="flex items-center justify-between gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/50 rounded-lg px-4 py-2 text-red-700 dark:text-red-300">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
          <button
            onClick={onClearError}
            className="text-red-500 dark:text-red-300 hover:text-red-700 dark:hover:text-red-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      
      {success && (
        <div className="flex items-center justify-between gap-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-500/50 rounded-lg px-4 py-2 text-green-700 dark:text-green-300">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm">✓ Nota guardada exitosamente</span>
          </div>
          <button
            onClick={onClearSuccess}
            className="text-green-500 dark:text-green-300 hover:text-green-700 dark:hover:text-green-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default MessageDisplay; 
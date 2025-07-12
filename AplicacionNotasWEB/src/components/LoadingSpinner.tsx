import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = "Cargando...", 
  size = 'md',
  className = ""
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`flex items-center justify-center py-12 ${className}`}>
      <div className={`border-4 border-blue-600 border-t-transparent rounded-full animate-spin ${sizeClasses[size]}`}></div>
      {message && (
        <span className="ml-3 text-gray-400">{message}</span>
      )}
    </div>
  );
};

export default LoadingSpinner; 
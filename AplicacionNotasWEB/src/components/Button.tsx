import React from 'react';
import { useTheme, colorSchemes } from '../contexts/ThemeContext';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  onClick, 
  disabled = false, 
  className = '',
  type = 'button'
}: ButtonProps) {
  const { theme } = useTheme();
  
  const getButtonClasses = () => {
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base'
    };
    
    const buttonColor = colorSchemes.button[theme.buttonColor as keyof typeof colorSchemes.button];
    
    const variantClasses = {
      primary: `${buttonColor.class} text-white focus:ring-${theme.buttonColor}-500 shadow-sm hover:shadow-md`,
      secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200 focus:ring-slate-500',
      outline: `border-2 border-${theme.buttonColor}-500 text-${theme.buttonColor}-600 hover:bg-${theme.buttonColor}-50 focus:ring-${theme.buttonColor}-500`,
      ghost: `text-${theme.buttonColor}-600 hover:bg-${theme.buttonColor}-50 focus:ring-${theme.buttonColor}-500`
    };
    
    return `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;
  };
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={getButtonClasses()}
    >
      {children}
    </button>
  );
} 
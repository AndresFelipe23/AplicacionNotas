import type { ReactNode } from 'react';
import { cn } from '../utils/tailwind';
import type { JSX } from 'react/jsx-runtime';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const Container = ({ 
  children, 
  className = '', 
  as: Component = 'div',
  size = 'lg' 
}: ContainerProps) => {
  const sizeClasses = {
    sm: 'max-w-3xl',
    md: 'max-w-5xl',
    lg: 'max-w-7xl',
    xl: 'max-w-7xl',
    full: 'max-w-full'
  };

  const baseClasses = 'mx-auto px-4 sm:px-6 lg:px-8 ';
  const classes = cn(sizeClasses[size], baseClasses, className);

  return (
    <Component className={classes}>
      {children}
    </Component>
  );
};

export default Container; 
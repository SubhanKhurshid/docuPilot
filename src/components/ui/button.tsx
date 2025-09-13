import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'default', 
  className = '', 
  children, 
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#8dff2d] focus:ring-offset-2 focus:ring-offset-[#111111]';
  
  const variantClasses = {
    default: 'bg-[#8dff2d] text-black hover:bg-[#7be525] shadow-lg hover:shadow-[#8dff2d]/20',
    outline: 'border border-white/30 text-white hover:bg-white/10 bg-transparent hover:border-[#8dff2d]'
  };

  return (
    <button 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};


import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className, ...props }) => {
  const baseClasses = 'px-6 py-2 font-bold uppercase tracking-wider rounded-md transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black';

  const variantClasses = {
    primary: 'bg-red-600 text-white border-2 border-red-600 hover:bg-red-700 hover:shadow-[0_0_15px_rgba(239,68,68,0.8)] focus:ring-red-500 disabled:bg-gray-600 disabled:shadow-none disabled:cursor-not-allowed',
    secondary: 'bg-transparent text-cyan-400 border-2 border-cyan-400 hover:bg-cyan-400 hover:text-black hover:shadow-[0_0_15px_rgba(34,211,238,0.8)] focus:ring-cyan-300 disabled:border-gray-600 disabled:text-gray-500 disabled:hover:bg-transparent disabled:hover:text-gray-500 disabled:shadow-none',
    danger: 'bg-transparent text-yellow-400 border-2 border-yellow-400 hover:bg-yellow-400 hover:text-black hover:shadow-[0_0_15px_rgba(250,204,21,0.8)] focus:ring-yellow-300 disabled:border-gray-600 disabled:text-gray-500 disabled:hover:bg-transparent disabled:hover:text-gray-500 disabled:shadow-none',
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;

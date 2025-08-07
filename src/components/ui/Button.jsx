import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  loading = false,
  className = '',
  onClick,
  type = 'button',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden';
  
  const variants = {
    primary: 'bg-gradient-to-r from-pink-500 to-cyan-400 text-white hover:from-pink-600 hover:to-cyan-500 focus:ring-pink-500 shadow-lg hover:shadow-pink-500/25 hover:-translate-y-0.5',
    secondary: 'bg-transparent text-cyan-400 border-2 border-cyan-400 hover:bg-cyan-400 hover:text-gray-900 focus:ring-cyan-500 shadow-lg shadow-cyan-400/25 hover:-translate-y-0.5',
    outline: 'bg-transparent text-purple-400 border-2 border-purple-400 hover:bg-purple-400 hover:text-white focus:ring-purple-500 shadow-lg shadow-purple-400/25 hover:-translate-y-0.5',
    ghost: 'bg-transparent text-gray-300 hover:bg-gray-800 hover:text-white focus:ring-gray-500',
    danger: 'bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 focus:ring-red-500 shadow-lg hover:shadow-red-500/25 hover:-translate-y-0.5'
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm rounded-lg',
    md: 'px-6 py-3 text-base rounded-xl',
    lg: 'px-8 py-4 text-lg rounded-xl',
    xl: 'px-10 py-5 text-xl rounded-2xl'
  };
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;
  
  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      aria-disabled={disabled || loading}
      {...props}
    >
      {/* Shimmer effect */}
      <span className="absolute inset-0 -top-full bg-gradient-to-b from-transparent via-white/20 to-transparent transform skew-x-12 transition-transform duration-700 group-hover:translate-y-full"></span>
      
      {loading && (
        <svg 
          className="animate-spin -ml-1 mr-2 h-4 w-4" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          />
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;


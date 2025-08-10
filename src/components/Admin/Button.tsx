import { motion } from 'framer-motion';
import { ButtonProps } from '../../types/propTypes';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  className = '',
  onClick

}: ButtonProps) => {
  // Button style variants
  const variantStyles = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm',
    secondary: 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm',
    outline: 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm'
  };

  // Button size variants
  const sizeStyles = {
    sm: 'py-1.5 px-3 text-xs',
    md: 'py-2 px-4 text-sm',
    lg: 'py-2.5 px-5 text-base'
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      onClick={onClick}
      className={`
        ${variantStyles[variant]} 
        ${sizeStyles[size]} 
        font-ManropeMedium rounded-lg transition-colors duration-200

        flex items-center justify-center gap-2
        ${className}
      `}
    >
      {icon && <span>{icon}</span>}
      {children}
    </motion.button>
  );
};

export default Button;
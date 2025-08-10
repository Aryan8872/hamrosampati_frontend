import { motion } from 'framer-motion';
import React from 'react';


type CardProps = {
  children: React.ReactNode;
  className?: string;
};

const Card = ({ children, className = '' }: CardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-white rounded-xl shadow-sm overflow-hidden ${className}`}
    >
      {children}
    </motion.div>
  );
};

export const CardHeader = ({ children, className = '' }: CardProps) => {
  return (
    <div className={`p-6 border-b border-gray-100 ${className}`}>
      {children}
    </div>
  );
};

export const CardContent = ({ children, className = '' }: CardProps) => {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
};

export const CardFooter = ({ children, className = '' }: CardProps) => {
  return (
    <div className={`p-6 border-t border-gray-100 ${className}`}>
      {children}
    </div>
  );
};

export default Card;
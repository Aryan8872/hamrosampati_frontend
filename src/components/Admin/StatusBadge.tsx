import { motion } from 'framer-motion';
import { STATUS_TYPES } from '../../types/enumTypes';

type StatusStyle = {
  color: string;
  text: string;
  icon: string;
};

const getStatusStyle = (status: STATUS_TYPES): StatusStyle => {
  switch (status) {
    case STATUS_TYPES.AVAILABLE:
      return {
        color: 'bg-blue-50 text-blue-700 border-blue-200',
        text: 'Available',
        icon: '○'
      };
    case STATUS_TYPES.SOLD:
      return {
        color: 'bg-amber-50 text-amber-700 border-amber-200',
        text: 'Sold',
        icon: '⚠'
      };
    case STATUS_TYPES.RENTED:
      return {
        color: 'bg-purple-50 text-purple-700 border-purple-200',
        text: 'Rented',
        icon: '◎'
      };
    default:
      return {
        color: 'bg-gray-100 text-gray-600 border-gray-300',
        text: 'Unknown',
        icon: '?'
      };
  }
};

const StatusBadge = ({ status }: { status: STATUS_TYPES }) => {
  const { color, text, icon } = getStatusStyle(status);

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`px-2.5 py-0.5 inline-flex items-center gap-1 text-xs leading-5 font-medium rounded-full border ${color}`}
    >
      <span className="text-xs">{icon}</span>
      {text}
    </motion.span>
  );
};

export default StatusBadge;

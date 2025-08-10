import { motion } from 'framer-motion';
import { StatCardProps } from '../../types/propTypes';

const StatCard = ({ title, value, change, color, icon }: StatCardProps) => {
  const isPositive = change.startsWith('+');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        y: -5,
        transition: {
          type: 'spring',
          stiffness: 300
        }
      }}
      className={`p-6 rounded-xl shadow-sm flex justify-between ${color}`}
    >
      <div>
        <h3 className="text-sm font-medium opacity-90">{title}</h3>
        <div className="mt-2">
          <p className="text-2xl font-bold">{value}</p>
          <span className={`text-sm font-medium ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
            {change} <span className="text-xs">vs last month</span>
          </span>
        </div>
      </div>
      <div className="opacity-30 self-center">
        {icon}
      </div>
    </motion.div>
  );
};

export default StatCard;
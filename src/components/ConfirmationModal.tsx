import { Button } from '@headlessui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiAlertTriangle, FiCheckCircle, FiXCircle } from 'react-icons/fi';

export type ConfirmationModalType = 'success' | 'error' | 'warning';

interface ReusableConfirmationModalProps {
  onOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  type?: ConfirmationModalType;
}

const iconMap = {
  success: {
    icon: FiCheckCircle,
    color: 'text-green-500',
    bg: 'bg-green-50',
  },
  error: {
    icon: FiXCircle,
    color: 'text-red-500',
    bg: 'bg-red-50',
  },
  warning: {
    icon: FiAlertTriangle,
    color: 'text-yellow-500',
    bg: 'bg-yellow-50',
  },
};

const ConfirmationModal = ({
  onOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = 'warning',
}: ReusableConfirmationModalProps) => {
  const handleConfirm = async () => {
    await onConfirm();
    onClose();
  };

  const { icon: Icon, color, bg } = iconMap[type] || iconMap.warning;

  return (
    <AnimatePresence>
      {onOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            className="bg-white rounded-xl shadow-lg w-full max-w-md p-6"
          >
            <div className={`flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full ${bg}`}>
              <Icon className={`w-6 h-6 ${color}`} />
            </div>

            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
              {title}
            </h3>

            <p className="text-sm text-gray-500 text-center mb-6">
              {message}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-16 justify-center">
              {cancelText && (
                <Button
                  onClick={onClose}
                  className="order-2 sm:order-1 bg-blue-300/30 py-2 px-3 rounded-md hover:bg-blue-300/50 transition-colors duration-300 ease-in"
                >
                  {cancelText}
                </Button>
              )}
              <Button
                onClick={handleConfirm}
                className={`order-1 text-white sm:order-2 py-2 px-3 rounded-md transition-colors duration-300 ease-in ${type === 'success'
                    ? 'bg-green-600 hover:bg-green-700'
                    : type === 'error'
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-yellow-500 hover:bg-yellow-600'
                  }`}
              >
                {confirmText}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationModal;

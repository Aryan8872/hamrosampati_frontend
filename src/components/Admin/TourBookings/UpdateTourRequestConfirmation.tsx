import { Button } from '@headlessui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiAlertTriangle } from 'react-icons/fi';
import { useTour } from '../../../context/TourRequestContext';
import { ConfirmationModalProps } from '../../../types/propTypes';



const UpdateTourRequestConfirmation = ({
  onOpen,
  onClose,
  title = "Update Status",
  dataPayload,
  messageData,
  dataId,
  message = `Are you sure you want to update the status to ${messageData}`,
  confirmText = "Update",
  cancelText = "Cancel",
}: ConfirmationModalProps) => {
  const { updateTourStatus } = useTour()
  const updateTourRequest = async () => {
    if (dataId && dataPayload && typeof dataPayload === 'object' && 'status' in dataPayload) {
      await updateTourStatus(dataId, dataPayload.status as string)
    }
    onClose()
  }
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
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-red-50">
              <FiAlertTriangle className="w-6 h-6 text-buttonColor" />
            </div>

            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
              {title}
            </h3>

            <p className="text-sm text-gray-500 text-center mb-6">
              {message}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-16 justify-center">
              <Button
                onClick={onClose}
                className="order-2 sm:order-1 bg-blue-300/30 py-2 px-3 rounded-md hover:bg-blue-300/50 transition-colors duration-300 ease-in"
              >
                {cancelText}
              </Button>

              <Button
                onClick={updateTourRequest}
                className="order-1 text-white sm:order-2 bg-buttonColor/90 py-2 px-3 rounded-md hover:bg-blue-700 transition-colors duration-300 ease-in"
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

export default UpdateTourRequestConfirmation;
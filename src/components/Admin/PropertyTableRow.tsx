import { AnimatePresence, motion } from 'framer-motion';
import { FiChevronDown, FiMapPin } from 'react-icons/fi';
import { useProperty } from '../../context/PropertyContext';
import { PropertyType } from '../../types/payloadType';
import StatusBadge from './StatusBadge';
import { LISTING_TYPES } from '../../types/enumTypes';

type PropertyTableRowProps = {
  property: PropertyType;
  index: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
  showEdit: () => void;
  onDelete: () => void;
};

const PropertyTableRow = ({
  property,
  index,
  isExpanded,
  onToggleExpand,
  onDelete,
  showEdit
}: PropertyTableRowProps) => {

  const { getPropertyById, setDeletePropertyId } = useProperty()
  const handleEditClick = async (propertyId: string) => {
    await getPropertyById(propertyId);
    showEdit()

  }
  const base_url = import.meta.env.VITE_BASE_URL
  

  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.05 * index }}
      exit={{ opacity: 0 }}
      className="group hover:bg-blue-50/40 transition-colors duration-200 relative"
    >
      {/* Property Info */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="h-12 w-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
            <img
              src={`${base_url.replace(/\/$/, '')}/${String(property.images![0])?.replace(/^\//, '')}`}
              alt={property.propertyName}
              className="h-full w-full object-cover"
              loading="lazy"
              onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                e.currentTarget.onerror = null
                e.currentTarget.src = "/assets/placeholder/house_placeholder.png"
              }}
            />
          </div>
          <div className="ml-4">
            <div className="text-md font-ManropeMedium text-gray-900">{property.propertyName}</div>
          </div>
        </div>
      </td>

      {/* Location (hidden on mobile) */}
      <td className="px-6 py-4 whitespace-nowrap  hidden md:table-cell">
        <div className="flex font-ManropeLight  items-center text-sm text-gray-700">
          <FiMapPin className="mr-1 text-gray-400 flex-shrink-0" size={14} />
          <span className='max-w-[250px] break-all whitespace-normal block'>{property.address}</span>
        </div>
      </td>

      {/* Property Type (hidden on mobile) */}
      <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
        <span className="px-2.5 font-ManropeMedium py-0.5 inline-flex text-xs leading-5 font-medium rounded-full bg-blue-50 text-blue-700">
          {property.propertyType}
        </span>
      </td>

      {/* Price */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-ManropeMedium text-gray-900">${property.propertyPrice.toLocaleString()}</div>
        <div className="text-xs text-gray-500">{property.listingType==LISTING_TYPES.RENT? '$per month':''}</div>
      </td>

      {/* Status */}
      <td className="px-6 py-4 font-ManropeMedium whitespace-nowrap">
        <StatusBadge status={property.status} />
      </td>

      {/* Actions */}
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex font-ManropeMedium gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => handleEditClick(property.propertyId!)}
            className="text-blue-600 hover:text-blue-800"
          >
            Edit
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => {
              onDelete()
              setDeletePropertyId(property.propertyId!)
            }}
            className="text-red-600 hover:text-red-800"
          >
            Delete
          </motion.button>
        </div>
      </td>

      {/* Mobile Expand Toggle */}
      <td className="px-6 py-4 whitespace-nowrap md:hidden">
        <motion.button
          animate={{ rotate: isExpanded ? 180 : 0 }}
          onClick={onToggleExpand}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <FiChevronDown size={18} />
        </motion.button>
      </td>

      {/* Mobile Expanded Details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.td
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute left-0 top-full w-full bg-white shadow-md rounded-b-lg z-10 border-t border-gray-100 md:hidden"
            colSpan={7}
          >
            <div className="p-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Location</p>
                <div className="flex items-center text-sm text-gray-700">
                  <FiMapPin className="mr-1 text-gray-400" size={14} />
                  {property.address}
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Type</p>
                <span className="px-2 inline-flex text-xs leading-5 font-medium rounded-full bg-blue-50 text-blue-700">
                  {property.propertyType}
                </span>
              </div>
            </div>
          </motion.td>
        )}
      </AnimatePresence>
    </motion.tr>
  );
};

export default PropertyTableRow;
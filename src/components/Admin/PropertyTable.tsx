import { AnimatePresence, motion } from 'framer-motion';
import { ChangeEvent, useState } from 'react';
import { FiChevronLeft, FiChevronRight, FiPlus, FiSearch } from 'react-icons/fi';

import { useSearch } from '../../context/SearchContext';
import { STATUS_TYPES } from '../../types/enumTypes';
import Button from './Button';
import PropertyTableRow from './PropertyTableRow';

type PropertyTableProps = {
  onAddNew: () => void;
  onEdit: () => void;
  onDeleteProperty: () => void;
};

const PropertyTable = ({ onAddNew, onDeleteProperty, onEdit }: PropertyTableProps) => {
  const { useSearchProperties, setSearchKeyword, setPropertyQueryParamsWithSession, setCurrentPropertyPageWithSession } = useSearch()
  const { data } = useSearchProperties()
  const properties = data?.properties
  const totalPages = data?.totalPages ?? 1
  const currentPage = data?.currentPage ?? 1
  const [expandedPropertyId, setExpandedPropertyId] = useState<string>("");


  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value)
    setCurrentPropertyPageWithSession(1)
  }
  const handlePropertyStatusQuery = (query: string) => {
    setPropertyQueryParamsWithSession(`status=${query}`)
  }


  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden font-ManropeRegular">
      {/* Header with search and filters */}
      <div className="p-6 border-b border-gray-100 font-ManropeRegular">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="text-lg font-ManropeBold text-gray-800">Property Listings</h3>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-56">
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search properties..."
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm w-full"
                onChange={(e) => handleSearch(e)}
              />
            </div>

            <select
              className="border font-ManropeMedium border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
              defaultValue={"STATUS"}
              onChange={(status) => handlePropertyStatusQuery(status.target.value)}
            >
              <option className='hidden'>STATUS</option>
              {
                Object.values(STATUS_TYPES).map((status) => (
                  <option
                    value={status}
                  >{status}</option>
                ))
              }

            </select>

            <Button
              variant="primary"
              size="md"

              icon={<FiPlus size={16} />}
              onClick={onAddNew}
            >
              <span>Add Property</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Property Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Location</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Type</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider md:hidden">Details</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <AnimatePresence>
              {
                properties?.map((property, index) => (
                  <PropertyTableRow
                    property={property}
                    showEdit={onEdit}
                    index={index}
                    isExpanded={expandedPropertyId === data?.properties[index].propertyId}
                    onToggleExpand={() => setExpandedPropertyId(
                      expandedPropertyId === data?.properties[index].propertyId ? "" : data?.properties[index].propertyId ?? ""

                    )}
                    onDelete={onDeleteProperty}
                  />
                ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span> of{' '}
              <span className="font-medium">{data?.properties.length}</span> properties

            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <motion.button

                whileHover={{ backgroundColor: 'rgba(243, 244, 246, 1)' }}
                whileTap={{ scale: 0.95 }}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500"
              >
                <span className="sr-only">Previous</span>
                <FiChevronLeft size={16} />
              </motion.button>

              {
                Array.from({ length: totalPages }, (_, i) => (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setCurrentPropertyPageWithSession(i + 1)}
                    className="z-10 bg-blue-50 border-blue-500 text-blue-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                  >
                    {i + 1}
                  </motion.button>
                ))
              }

              <motion.button
                whileHover={{ backgroundColor: 'rgba(243, 244, 246, 1)' }}
                whileTap={{ scale: 0.95 }}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500"
              >
                <span className="sr-only">Next</span>
                <FiChevronRight size={16} />
              </motion.button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyTable;
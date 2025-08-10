import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FiLogOut } from 'react-icons/fi';
import { IoOptions } from 'react-icons/io5';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { navItems } from '../../types/sampleData';

const Sidebar = () => {
  const [showBottomMenu, setShowBottomMenu] = useState(false)
  const { logout, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [selectedIndex, setSelectedIndex] = useState<number>(0)

  // Sync selected index with current URL
  useEffect(() => {
    const pathname = location.pathname;
    
    // Find the index of the current path in navItems
    const currentIndex = navItems.findIndex(item => item.path === pathname);
    
    // Only update if we found a matching item and it's different from current
    if (currentIndex !== -1 && currentIndex !== selectedIndex) {
      setSelectedIndex(currentIndex);
    }
  }, [location.pathname, selectedIndex]);

  return (
    <motion.div
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      transition={{ type: 'spring', stiffness: 100 }}
      className="hidden xl:flex xl:flex-col h-full w-64 bg-white shadow-sm z-20"
    >
      <div className="p-6 flex flex-col justify-center h-24 border-b border-gray-100">
        <h1 className="text-2xl font-ManropeBold text-blue-600">
          <span className="text-blue-600 mr-1">●</span>
          HamroSampati
        </h1>
        <p className="text-xs font-ManropeBold text-gray-500 mt-1">Property Management</p>
      </div>

      <nav className="mt-6 flex-1">
        {navItems.map((item, index) => (
          <motion.div
            key={index}
            onClick={() => {
              setSelectedIndex(index)
              navigate(`${item.path}`)
            }}
            whileHover={{
              // backgroundColor: 'rgba(239, 246, 255, 1)',
              x: 5,
              transition: { type: 'spring', stiffness: 300 }
            }}
            className={`
              flex items-center font-ManropeMedium px-6 py-3.5 text-gray-600 cursor-pointer
              ${index === selectedIndex ? 'bg-[rgba(239, 246, 255, 1)] text-blue-600 border-r-4 border-blue-600' : ''}
            `}
          >
            <span className="mr-3">{item.icon}</span>
            <span className="font-medium">{item.text}</span>
          </motion.div>
        ))}
      </nav>

      <div className="relative p-6 border-t border-gray-100">
        <div className="flex flex-row items-center justify-between gap-3">
          <div className='flex flex-row gap-3 items-center'>
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
              {user &&user.fullName.split(' ').at(0)?.charAt(0).toUpperCase()}{user?.fullName.split(' ').at(1)?.charAt(0).toLocaleUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{user?.fullName}</p>
              <p className="text-xs text-gray-500">Admin</p>
            </div>
          </div>

          <div className='relative'>
            <IoOptions
              className='cursor-pointer'
              onClick={() => setShowBottomMenu(!showBottomMenu)}
            />

            {
              showBottomMenu && (
                <div className={`absolute font-ManropeMedium -top-20 -left-24 bg-[#EFF6FF] p-2 rounded-md shadow-md`}>
                  <div
                    onClick={
                      () => {
                        logout()
                        navigate("/logout")
                      }}
                    className='flex flex-row items-center gap-3 p-3 hover:bg-[#d7dce3] cursor-pointer'>
                    <FiLogOut />
                    <span>Logout</span>
                  </div>
                </div>
              )
            }
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;
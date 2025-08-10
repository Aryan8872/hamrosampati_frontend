import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { FaBell, FaTimes } from 'react-icons/fa';
import { FiMenu, FiX } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { notificationService, NotificationType } from '../../services/notificationService';
import { mobileNavItems } from '../../types/sampleData';
import { useNavigate } from 'react-router-dom';

type HeaderProps = {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
};

const Header = ({ onToggleSidebar, isSidebarOpen }: HeaderProps) => {
  const { user } = useAuth();
  const navigate = useNavigate()
  // Notification logic
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  // Load notifications and unread count
  const loadNotifications = async () => {
    try {
      const [notificationsResponse, unreadCountResponse] = await Promise.all([
        notificationService.getAdminNotifications(),
        notificationService.getUnreadAdminNotificationCount()
      ]);
      setNotifications(notificationsResponse.notifications || []);
      setUnreadCount(unreadCountResponse.count || 0);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  // Auto-refresh notifications every 30s when dropdown is open
  useEffect(() => {
    if (!showNotifications) return;
    const interval = setInterval(() => {
      loadNotifications();
    }, 30000);
    return () => clearInterval(interval);
  }, [showNotifications]);

  // Mark notification as read
  const markNotificationAsRead = async (notificationId: string) => {
    try {
      await notificationService.markNotificationAsRead(notificationId);
      loadNotifications();
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      await notificationService.markAllNotificationsAsRead('admin');
      loadNotifications();
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="px-4 py-4 md:py-3 flex justify-between items-center">
        {/* Left side - Menu button and title */}
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="xl:hidden flex p-2 rounded-md text-gray-700 hover:bg-gray-100"
            onClick={onToggleSidebar}
          >
            {isSidebarOpen ? (
              <FiX className="w-6 h-6 text-gray-800" />
            ) : (
              <FiMenu className="w-6 h-6 text-gray-800" />
            )}
          </motion.button>
          <div>
            <h2 className="text-xl font-ManropeBold text-gray-800">Dashboard</h2>
            <p className="text-sm font-ManropeSemiBold text-gray-500 hidden md:block">Manage your properties</p>

          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative mr-2" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-colors"
            >
              <FaBell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-3 w-3 p-2 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">{unreadCount > 9 ? '9+' : unreadCount}</span>
                </span>
              )}
            </button>
            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 font-ManropeRegular">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={loadNotifications}
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium border border-blue-100 rounded px-2 py-1"
                      title="Refresh notifications"
                    >
                      Refresh
                    </button>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Mark all read
                      </button>
                    )}
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <FaTimes className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  <div className="p-4">
                    {notifications.length === 0 ? (
                      <div className="text-center py-8">
                        <FaBell className="mx-auto h-8 w-8 text-gray-300" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications</h3>
                        <p className="mt-1 text-sm text-gray-500">You're all caught up!</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {notifications.slice(0, 10).map((notification) => (
                          <div
                            key={notification.notificationId}
                            onClick={() => markNotificationAsRead(notification.notificationId)}
                            className={`flex items-start space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${notification.isRead
                              ? 'bg-gray-50 hover:bg-gray-100'
                              : 'bg-blue-50 hover:bg-blue-100'
                              }`}
                          >
                            <div className="flex-shrink-0">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${notification.isRead ? 'bg-gray-100' : 'bg-blue-100'
                                }`}>
                                <FaBell className={`text-sm ${notification.isRead ? 'text-gray-600' : 'text-blue-600'
                                  }`} />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-medium ${notification.isRead ? 'text-gray-900' : 'text-blue-900'
                                }`}>
                                {notification.title}
                              </p>
                              <p className="text-sm text-gray-500">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {new Date(notification.createdAt).toLocaleString()}
                              </p>
                            </div>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="p-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setShowNotifications(false);
                    }}
                    className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View All Notifications
                  </button>
                </div>
              </div>
            )}
          </div>
          <motion.div

            whileHover={{ scale: 1.05 }}
            className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center text-white font-semibold shadow-sm cursor-pointer"
          >
            {user?.fullName.split(' ').at(0)?.charAt(0).toUpperCase()}{user?.fullName.split(' ').at(1)?.charAt(0).toLocaleUpperCase()}
          </motion.div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-30 xl:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onToggleSidebar}
            />
            <motion.div
              className="fixed top-0 left-0 h-full w-64 max-w-[80vw] bg-white shadow-2xl z-40 xl:hidden overflow-auto"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25 }}
            >
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-xl font-bold text-blue-600">
                    <span className="text-blue-600 mr-1">●</span>
                    HamroSampati
                  </h1>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onToggleSidebar}
                  >
                    <FiX className="w-6 h-6 text-gray-500" />
                  </motion.button>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center text-white font-semibold shadow-sm">
                    {user?.fullName.split(' ').at(0)?.charAt(0).toUpperCase()}{user?.fullName.split(' ').at(1)?.charAt(0).toLocaleUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user?.fullName}</p>
                    <p className="text-xs text-gray-500">Admin</p>
                  </div>
                </div>
              </div>

              <nav className="mt-4 px-2">
                {mobileNavItems.map((item, index) => (
                  <motion.a
                    key={index}
                    className={`
                      flex items-center cursor-pointer gap-3 px-4 py-3 my-1 rounded-lg 
                      ${index === 0 ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}
                    `}
                    onClick={()=>navigate(`${item.path}`)}
                    whileHover={{ x: 5 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <span>{item.icon}</span>
                    <span className="font-medium">{item.text}</span>
                  </motion.a>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
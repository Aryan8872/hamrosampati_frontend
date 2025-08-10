import { format, parseISO } from 'date-fns';
import React, { useEffect, useRef, useState } from 'react';
import { FaBell, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { notificationService, NotificationType } from '../services/notificationService';

interface UserNotificationProps {
    userId: string;
    iconColor?: string;
    isTransparent?: boolean;
}

const UserNotification: React.FC<UserNotificationProps> = ({
    userId,
    iconColor = "text-gray-600",
    isTransparent = false
}) => {
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState<NotificationType[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const notificationRef = useRef<HTMLDivElement>(null);

    // Click outside handler
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

    // Load notifications
    const loadNotifications = async () => {
        try {
            const [notificationsResponse, unreadCountResponse] = await Promise.all([
                notificationService.getUserNotifications(userId),
                notificationService.getUnreadNotificationCount(userId)
            ]);

            if (notificationsResponse.success) {
                setNotifications(notificationsResponse.notifications || []);
            }

            if (unreadCountResponse.success) {
                setUnreadCount(unreadCountResponse.count || 0);
            }
        } catch (error) {
            console.error('Failed to load notifications:', error);
        }
    };

    // Load notifications on mount and when userId changes
    useEffect(() => {
        if (userId) {
            loadNotifications();
        }
    }, [userId]);

    // Auto-refresh notifications every 30 seconds when dropdown is open
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

    // Mark all notifications as read
    const markAllAsRead = async () => {
        try {
            await notificationService.markAllNotificationsAsRead(userId);
            loadNotifications();
            toast.success('All notifications marked as read');
        } catch (error) {
            console.error('Failed to mark all notifications as read:', error);
            toast.error('Failed to mark all notifications as read');
        }
    };

    return (
        <div className="relative" ref={notificationRef}>
            <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative p-2 ${iconColor} hover:bg-white rounded-lg transition-colors group`}
            >
                <FaBell className={`h-5 w-5 ${isTransparent ? 'group-hover:text-black' : ''}`} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-3 w-3 p-2 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-xs text-white font-bold">{unreadCount > 9 ? '9+' : unreadCount}</span>
                    </span>
                )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
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
                                                    {format(parseISO(notification.createdAt), 'MMM d, h:mm a')}
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
                                toast.info('View all notifications feature coming soon!');
                            }}
                            className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                            View All Notifications
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserNotification; 
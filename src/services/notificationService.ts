import axios from 'axios';

const api = axios.create({
    baseURL: "http://localhost:3000/api/notification",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
});

interface TourRequest {
    tourRequestId: string;
    fullName: string;
    email: string;
    phone: string;
    preferredDate: string;
    preferredTime: string;
    status: string;
    [key: string]: unknown;
}

export interface NotificationType {
    notificationId: string;
    userId?: string;
    tourRequestId?: string;
    type: 'TOUR_CREATED' | 'TOUR_UPDATED' | 'TOUR_CANCELLED' | 'TOUR_RESCHEDULED' | 'STATUS_CHANGED';
    title: string;
    message: string;
    isRead: boolean;
    isAdminNotification: boolean;
    createdAt: string;
    updatedAt: string;
    TourRequest?: TourRequest;
}

export interface NotificationResponse {
    success: boolean;
    notifications?: NotificationType[];
    count?: number;
    message?: string;
}

interface ApiError {
    response?: {
        data?: {
            message?: string;
        };
    };
}

export const notificationService = {
    // Get user notifications
    getUserNotifications: async (userId: string): Promise<NotificationResponse> => {
        if (!userId) {
            console.error('No userId provided to getUserNotifications');
            return {
                success: false,
                notifications: [],
                message: 'No userId provided for notifications.'
            };
        }
        try {
            const response = await api.get(`/user/${userId}`);
            return response.data;
        } catch (error: unknown) {
            const apiError = error as ApiError;
            console.error('Failed to get user notifications:', error);
            return {
                success: false,
                notifications: [],
                message: apiError.response?.data?.message || 'Failed to get notifications'
            };
        }
    },

    // Get admin notifications
    getAdminNotifications: async (): Promise<NotificationResponse> => {
        try {
            const response = await api.get('/admin');
            return response.data;
        } catch (error: unknown) {
            const apiError = error as ApiError;
            console.error('Failed to get admin notifications:', error);
            return {
                success: false,
                notifications: [],
                message: apiError.response?.data?.message || 'Failed to get notifications'
            };
        }
    },

    // Mark notification as read
    markNotificationAsRead: async (notificationId: string): Promise<NotificationResponse> => {
        try {
            const response = await api.put(`/read/${notificationId}`);
            return response.data;
        } catch (error: unknown) {
            const apiError = error as ApiError;
            console.error('Failed to mark notification as read:', error);
            return {
                success: false,
                message: apiError.response?.data?.message || 'Failed to mark notification as read'
            };
        }
    },

    // Mark all notifications as read for a user
    markAllNotificationsAsRead: async (userId: string): Promise<NotificationResponse> => {
        try {
            const response = await api.put(`/read-all/${userId}`);
            return response.data;
        } catch (error: unknown) {
            const apiError = error as ApiError;
            console.error('Failed to mark all notifications as read:', error);
            return {
                success: false,
                message: apiError.response?.data?.message || 'Failed to mark all notifications as read'
            };
        }
    },

    // Get unread notification count for user
    getUnreadNotificationCount: async (userId: string): Promise<NotificationResponse> => {
        if (!userId) {
            console.error('No userId provided to getUnreadNotificationCount');
            return {
                success: false,
                count: 0,
                message: 'No userId provided for unread notification count.'
            };
        }
        try {
            const response = await api.get(`/unread-count/${userId}`);
            return response.data;
        } catch (error: unknown) {
            const apiError = error as ApiError;
            console.error('Failed to get unread notification count:', error);
            return {
                success: false,
                count: 0,
                message: apiError.response?.data?.message || 'Failed to get unread count'
            };
        }
    },

    // Get unread notification count for admin
    getUnreadAdminNotificationCount: async (): Promise<NotificationResponse> => {
        try {
            const response = await api.get('/admin/unread-count');
            return response.data;
        } catch (error: unknown) {
            const apiError = error as ApiError;
            console.error('Failed to get unread admin notification count:', error);
            return {
                success: false,
                count: 0,
                message: apiError.response?.data?.message || 'Failed to get unread count'
            };
        }
    },

    // Send tour status notification (for admin use)
    sendTourStatusNotification: async (notificationPayload: {
        tourId: string;
        status: string;
        userEmail: string;
        userName: string;
        propertyName?: string;
        tourDate: string;
    }): Promise<void> => {
        try {
            // This would typically call a backend endpoint to send notifications
            console.log('Sending tour status notification:', notificationPayload);
            // For now, we'll just log it
        } catch (error) {
            console.error('Failed to send tour status notification:', error);
        }
    }
};

export default notificationService; 
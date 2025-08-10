import { UserType } from '../types/payloadType';

export const isAdmin = (user: UserType): boolean => {
    return user?.role === 'ADMIN';
};

export const isUser = (user: UserType): boolean => {
    return user?.role === 'USER';
};

export const hasRole = (user: UserType, role: string): boolean => {
    return user?.role === role;
};

export const hasAnyRole = (user: UserType, roles: string[]): boolean => {
    return user?.role ? roles.includes(user.role) : false;
};

export const canManageTours = (user: UserType): boolean => {
    return hasAnyRole(user, ['ADMIN']);
};

export const canViewTours = (user: UserType): boolean => {
    return hasAnyRole(user, ['USER', 'ADMIN']);
};

export const canManageProperties = (user: UserType): boolean => {
    return hasAnyRole(user, ['ADMIN']);
};

export const canManageBlogs = (user: UserType): boolean => {
    return hasAnyRole(user, ['ADMIN']);
};

export const canRescheduleTour = (user: UserType, tourUserId?: string): boolean => {
    // Admins can reschedule any tour, users can only reschedule their own
    if (isAdmin(user)) return true;
    if (isUser(user) && tourUserId && user) {
        return user.id === tourUserId;
    }
    return false;
};

export const getUserDisplayName = (user: UserType): string => {
    return user?.fullName || user?.email || 'Unknown User';
};

export const formatUserRole = (role: string): string => {
    return role?.toUpperCase() || 'USER';
};

export const getRoleColor = (role: string): string => {
    switch (role?.toUpperCase()) {
        case 'ADMIN':
            return 'bg-red-500 text-white';
        case 'USER':
            return 'bg-blue-500 text-white';
        default:
            return 'bg-gray-500 text-white';
    }
}; 
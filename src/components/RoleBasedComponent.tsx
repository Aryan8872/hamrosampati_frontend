import { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';

interface RoleBasedComponentProps {
    children: ReactNode;
    allowedRoles: string[];
    fallback?: ReactNode;
}

export default function RoleBasedComponent({
    children,
    allowedRoles,
    fallback = null
}: RoleBasedComponentProps) {
    const { user } = useAuth();

    if (!user || !allowedRoles.includes(user.role || '')) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}

// Convenience components for common roles
export function AdminOnly({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
    return (
        <RoleBasedComponent allowedRoles={['ADMIN']} fallback={fallback}>
            {children}
        </RoleBasedComponent>
    );
}

export function UserOnly({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
    return (
        <RoleBasedComponent allowedRoles={['USER', 'ADMIN']} fallback={fallback}>
            {children}
        </RoleBasedComponent>
    );
} 
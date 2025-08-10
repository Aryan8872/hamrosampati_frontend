import axios, { AxiosError } from 'axios';
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { AuthContextType } from '../types/contextTypes';
import { LoginDataType, RegisterDataType, UserType } from '../types/payloadType';


const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserType>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const api = useMemo(() => axios.create({
        baseURL: "http://localhost:3000/api/auth",
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json'
        }
    }), []);

    useEffect(() => {
        checkstatus()
    }, [])

    const checkstatus = async () => {
        try {
            setIsLoading(true);
            const response = await api.get("/me");
            console.log(response.data)
            setUser(response.data);
            setIsAuthenticated(true);
        } catch (e: unknown) {
            if (e instanceof AxiosError && e.response?.status === 401) {
                await tryRefreshToken();
            } else {
                setUser(null);
                setIsAuthenticated(false);
            }
        } finally {
            setIsLoading(false);
        }
    };


    const tryRefreshToken = async () => {
        try {
            console.log("Triggered refresh token");
            const response = await api.post("/refresh-token");
            setUser(response.data.user);
            setIsAuthenticated(true);
        } catch {
            setUser(null);
            setIsAuthenticated(false);
        }
    };

    const register = async (registerData: RegisterDataType) => {
        try {
            setIsLoading(true);
            await api.post("/register", registerData);
            return { success: true };
        } catch (e: unknown) {
            if (e instanceof AxiosError) {
                return {
                    success: false,
                    error: e.response?.data?.message || 'Registration failed'
                };
            }
            return {
                success: false,
                error: 'An unknown error occurred'
            };
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (loginData: LoginDataType) => {
        try {
            setIsLoading(true)
            await api.post("/login", loginData);
            await checkstatus()
            setIsAuthenticated(true);
            return { success: true };
        } catch (e: unknown) {
            if (e instanceof AxiosError) {
                return {
                    success: false,
                    error: e.response?.data?.message || 'Login failed'
                };
            }
            return {
                success: false,
                error: 'An unknown error occurred'
            };
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            await api.post("/logout", {})
            setUser(null)
            setIsAuthenticated(false)
            return { success: true }
        } catch (e: unknown) {
            if (e instanceof AxiosError) {
                return {
                    success: false,
                    error: e.response?.data?.message || "logout failed"
                }
            }
            return {
                success: false,
                error: 'An unknown error occurred'
            };
        }
        finally {
            setIsLoading(false);
        }
    }

    const requestResetPassword = async (email: string) => {
        const resetRequest = await api.post('/request-password-reset', { email: email })
        console.log("request resetpass", resetRequest)
        if (resetRequest.status === 200) {
            return {
                success: true,
            }
        }
        return {
            success: false
        }
    }

    const resetPassword = async (token: string, newPassword: string) => {
        await api.post(`/reset-password`, { token: token, newPassword: newPassword })
    }

    // Edit Profile
    const editProfile = async (profileData: { fullName: string; email: string; phoneNumber: string; password?: string }) => {
        try {
            setIsLoading(true);
            const res = await api.put('/profile', profileData, {
                withCredentials: true,
                headers: { 'Content-Type': 'application/json' },
            });
            if (res.data?.user) {
                setUser(res.data.user);
            }
            return { success: true, user: res.data.user, message: 'Profile updated successfully!' };
        } catch (e: unknown) {
            if (e instanceof AxiosError) {
                return {
                    success: false,
                    error: e.response?.data?.message || 'Profile update failed',
                };
            }
            return {
                success: false,
                error: 'An unknown error occurred',
            };
        } finally {
            setIsLoading(false);
        }
    };

    const contextValues = {
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        checkstatus,
        logout,
        requestResetPassword,
        resetPassword,
        editProfile,
    };

    return (
        <AuthContext.Provider value={contextValues}>
            {isLoading ? (
                <div className="flex items-center line-clamp-2 justify-center min-h-screen">
                    <span className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#2563eb]"></span>
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthContextProvider');
    }
    return context;
};
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from "react";
import { PropertyContextType } from "../types/contextTypes";
import { CachedPropertyType, PropertyType } from "../types/payloadType";
import { useAuth } from "./AuthContext";

const PropertyContext = createContext<PropertyContextType | undefined>(undefined)

const PropertyContextProvider = ({ children }: { children: ReactNode }) => {
    const api = useMemo(() => axios.create({
        baseURL: "http://localhost:3000/api/v1/property",
        withCredentials: true,
        headers: {
            "Content-Type": "application/json"
        }
    }), [])
    const queryClient = useQueryClient();
    const [propertyById, setPropertyById] = useState<PropertyType | null>(null)
    const [deletePropertyId, setDeletePropertyId] = useState<string>("")
    const { user, isAuthenticated } = useAuth()
    const [canBookTourStatus, setCanBookTourStatus] = useState<boolean | null>(null)

    const addProperty = async (propertyData: PropertyType | FormData) => {
        try {
            await api.post("/", propertyData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            })
            await queryClient.invalidateQueries({
                queryKey: ['properties']
            });

            await queryClient.invalidateQueries({
                queryKey: ['searchedProperties']
            });


            return ({ success: true })
        }
        catch (error) {
            if (error instanceof AxiosError) {
                console.log(error)
                return ({
                    success: false,
                    error: error.response?.data?.message || "property creation failed"
                })
            }
            return {
                success: false,
                error: 'An unknown error occurred'
            };
        }
    }

    const updateProperty = async (formData: FormData, propertyId: string) => {
        try {
            await api.put(`/${propertyId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            await queryClient.invalidateQueries({
                queryKey: ['properties']
            });

            await queryClient.invalidateQueries({
                queryKey: ['searchedProperties']
            });

            return { success: true };
        } catch (e: unknown) {
            if (e instanceof AxiosError) {
                return {
                    success: false,
                    error: e.response?.data?.message || "Failed to update property"
                };
            }
            return {
                success: false,
                error: 'An unknown error occurred'
            };
        }
    };

    const deleteProperty = async (propertyId: string) => {
        try {
            await api.delete(`/${propertyId}`)
            await queryClient.invalidateQueries({
                queryKey: ['properties']
            });
            await queryClient.invalidateQueries({
                queryKey: ['searchedProperties']
            });
            return ({ success: true })
        }
        catch (e: unknown) {
            if (e instanceof AxiosError) {
                console.log(e)
                return ({
                    success: false,
                    error: e.response?.data?.message || " failed to update property"
                })
            }
            return {
                success: false,
                error: 'An unknown error occurred'
            };
        }

    }

    const useGetAllRecentProperties = () => {
        const queryClient = useQueryClient();

        return useQuery({
            queryKey: ['RECENTPROPERTIES'],
            queryFn: async () => {
                try {
                    const cachedProperties = queryClient.getQueryData(['RECENTPROPERTIES']);
                    console.log("Cached recent properties:", cachedProperties);

                    const response = await api.get("/recent");
                    console.log("Fetched recent properties:", response);

                    return {
                        success: true,
                        recentProperties: response.data as PropertyType[]
                    };
                } catch (e: unknown) {
                    if (e instanceof AxiosError) {
                        return {
                            success: false,
                            recentProperties: [],
                            error: e.response?.data?.message || "Failed to fetch recent properties"
                        };
                    }

                    return {
                        success: false,
                        recentProperties: [],
                        error: "An unknown error occurred"
                    };
                }
            },
            staleTime: 5 * 60 * 1000,
            gcTime: 6 * 60 * 6000,
            refetchOnWindowFocus: true,
            refetchOnReconnect: true,
            retry: 2
        });
    };
    const useAllProperty = () => {
        return useQuery({
            queryKey: ['properties'], queryFn: async () => {
                try {
                    const properties = await api.get("/")
                    console.log(properties)
                    return ({ success: true, properties: properties.data.properties })

                }
                catch (e: unknown) {
                    if (e instanceof AxiosError) {
                        return ({
                            success: false,
                            properties: [],
                            error: "failed to get all properties"
                        })
                    }
                }
            },
            staleTime: 5 * 60 * 1000,
            gcTime: 6 * 60 * 6000,
            refetchOnWindowFocus: true,
            refetchOnReconnect: true,
            retry: 2
        })
    }

    const useGetAllFeaturedProperty = () => {
        return useQuery({
            queryKey: ['FEATUREDPROPERTIES'], queryFn: async () => {
                try {
                    const cachedProperties = queryClient.getQueryData(['FEATUREDPROPERTIES'])
                    console.log(cachedProperties)
                    const properties = await api.get("/featured/")
                    console.log(properties)
                    return ({ success: true, properties: properties.data.featuredProperty })

                }
                catch (e: unknown) {
                    if (e instanceof AxiosError) {
                        return ({
                            success: false,
                            properties: [],
                            error: "failed to get all properties"
                        })
                    }
                }
            },
            staleTime: 5 * 60 * 1000,
            gcTime: 6 * 60 * 6000,
            refetchOnWindowFocus: true,
            refetchOnReconnect: true,
            retry: 2
        })
    }

    const getPropertyById = useCallback(async (propertyId: string) => {
        try {
            const cachedProperties = queryClient.getQueryData<CachedPropertyType>(['properties']);
            const propertyById = cachedProperties?.properties?.find((prop: PropertyType) => prop.propertyId === propertyId);
            if (propertyById) {
                setPropertyById(propertyById)
                return {
                    success: true,
                    property: propertyById
                };
            }
            await api.get(`/${propertyId}`).then((res) => {
                setPropertyById(res.data)
            })

            return {
                success: true,
                property: propertyById || null
            };
        } catch (e: unknown) {
            if (e instanceof AxiosError) {
                console.log(e);
                return {
                    success: false,
                    error: e.response?.data?.message || "Failed to fetch property",
                    property: null
                };
            }
            return {
                success: false,
                error: 'An unknown error occurred',
                property: null
            };
        }
    }, [queryClient, api]);


    const getCanBookStatus = useCallback(async ({ propertyId }: { propertyId: string }) => {
        try {
            // Don't make API call if user is not authenticated
            if (!isAuthenticated || !user?.id) {
                setCanBookTourStatus(true); // Default to true for non-authenticated users
                return {
                    success: false,
                    error: "User is not authenticated or logged in"
                };
            }

            const cachedProperties = queryClient.getQueryData<CachedPropertyType>(['properties']);
            const propertyById = cachedProperties?.properties?.find((prop: PropertyType) => prop.propertyId === propertyId);

            if (propertyById) {
                const canbookStatus = await api.get(`/${propertyById.propertyId}/user/${user.id}/booking`)
                // Handle nested response structure: {canBook: {canBook: false}}
                const status = canbookStatus.data.canBook?.canBook ?? canbookStatus.data.canBook
                console.log('Booking status:', status)
                setCanBookTourStatus(status)
                return {
                    success: true,
                };
            }

            const canbookStatus = await api.get(`/${propertyId}/user/${user.id}/booking`)
            // Handle nested response structure: {canBook: {canBook: false}}
            const status = canbookStatus.data.canBook?.canBook ?? canbookStatus.data.canBook
            console.log('Booking status:', status)
            setCanBookTourStatus(status)
            return {
                success: true,
            };

        } catch (e: unknown) {
            if (e instanceof AxiosError) {
                console.log('Error fetching booking status:', e);
                setCanBookTourStatus(true) // Default to true on error
                return {
                    success: false,
                    error: e.response?.data?.message || "Failed to fetch property booking status",
                };
            }
            setCanBookTourStatus(true) // Default to true on error
            return {
                success: false,
                error: 'An unknown error occurred',
            };
        }
    }, [user?.id, isAuthenticated, queryClient, api]);

    const checkFavoriteStatus = async (propertyId: string) => {
        try {
            if (!user?.id) {
                return { success: false, isFavorited: false };
            }

            const res = await axios.get(`http://localhost:3000/api/favorite/status/${propertyId}/${user.id}`)
            return { success: true, isFavorited: res.data.isFavorited };
        } catch (e: unknown) {
            if (e instanceof AxiosError) {
                console.error(e);
                return {
                    success: false,
                    isFavorited: false,
                };
            }

            return {
                success: false,
                isFavorited: false,
            };
        }
    };

    const useAdminDashboardStats = () => {
        return useQuery({
            queryKey: ["ADMINPROPERTYSTATS"],
            queryFn: async () => {
                try {
                    const statsdata = await api.get("/stats/admin/dashboard")
                    const data = statsdata.data
                    console.log(statsdata.data)
                    return ({ success: true, stats: data })


                }
                catch (e: unknown) {
                    if (e instanceof AxiosError) {
                        console.error(e);
                        return {
                            success: false,
                            error: "dawdawdawd",
                            stats: null
                        };
                    }

                    return {
                        success: false,
                        error: "dawdawd",
                        stats: null

                    };
                }

            }
        })
    }




    const contextValues = {
        addProperty,
        updateProperty,
        deleteProperty,
        useAllProperty,
        getPropertyById,
        useGetAllRecentProperties,
        propertyById,
        deletePropertyId,
        useAdminDashboardStats,
        setDeletePropertyId,
        checkFavoriteStatus,
        useGetAllFeaturedProperty,
        getCanBookStatus,
        canBookTourStatus,
        setCanBookTourStatus

    }

    return (
        <PropertyContext.Provider value={contextValues}>
            {children}
        </PropertyContext.Provider>

    )
}

export const useProperty = () => {
    const context = useContext(PropertyContext)
    if (context === undefined) {
        throw new Error('useProperty must be used within an AuthContextProvider');
    }
    return context
};

export default PropertyContextProvider

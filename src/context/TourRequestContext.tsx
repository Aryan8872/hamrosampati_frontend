import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { createContext, ReactNode, useContext, useState } from "react";
import { notificationService } from "../services/notificationService";
import { TourContextType } from "../types/contextTypes";
import { CachedTourRequestType, TourDataType } from "../types/payloadType";


const TourContext = createContext<TourContextType | undefined>(undefined)
const TourContextProvider = ({ children }: { children: ReactNode }) => {
    const [isLoading, setIsLoading] = useState(false)
    const queryClient = useQueryClient()
    const [tourByIdData, setTourByIdData] = useState<TourDataType>()
    const [userTourByIdData, setUserTourByIdData] = useState<TourDataType>()

    const api = axios.create({
        baseURL: "http://localhost:3000/api/tour",
        withCredentials: true,
        headers: {
            "Content-Type": "application/json"
        }
    })

    const createTourRequest = async (tourData: TourDataType) => {
        setIsLoading(true)
        try {
            console.log(tourData)
            await api.post("/", tourData)

            // Invalidate related queries to refresh data
            queryClient.invalidateQueries({
                queryKey: ["TOURBOOKINGS"]
            })
            queryClient.invalidateQueries({
                queryKey: ["USERTOURBOOKINGS"]
            })
            queryClient.invalidateQueries({
                queryKey: ["RECENTTOURBOOKINGS"]
            })

            return ({ success: true })
        }
        catch (e: unknown) {
            if (e instanceof AxiosError) {
                console.log(e)
                return {
                    success: false,
                    error: e.response?.data?.message || "failed to create property"
                }
            }
            return {
                success: false,
                error: "an unknown error occured"
            }
        }
        finally {
            setIsLoading(false)
        }
    }
    const updateTourStatus = async (tourId: string, status: string) => {
        try {
            console.log("tour id inside update tour status", tourId)
            // Get the old status before updating
            const oldTour = await api.get(`/data/${tourId}`);
            const oldStatus = oldTour.data?.status;
            const updatedStatus = await api.put(`/update-status/${tourId}`, { status })

            // Invalidate all related queries
            queryClient.invalidateQueries({
                queryKey: ["TOURBOOKINGS"]
            })
            queryClient.invalidateQueries({
                queryKey: ["USERTOURBOOKINGS"]
            })
            queryClient.invalidateQueries({
                queryKey: ["RECENTTOURBOOKINGS"]
            })
            queryClient.invalidateQueries({
                queryKey: ["SEARCHTOURBOOKINGS"]
            })

            // Send notification to user
            try {
                const tour = await api.get(`/data/${tourId}`);
                if (tour.data) {
                    const notificationPayload = {
                        tourId,
                        oldStatus,
                        newStatus: status,
                        status, // for backward compatibility
                        userEmail: tour.data.email,
                        userName: tour.data.fullName,
                        propertyName: tour.data.Property?.propertyName,
                        tourDate: tour.data.preferredDate
                    };

                    await notificationService.sendTourStatusNotification(notificationPayload);
                }
            } catch (notificationError) {
                console.log("Notification failed but tour status updated:", notificationError);
            }

            return ({
                success: true,
                updatedStatus: updatedStatus.data.status
            })

        } catch (e: unknown) {
            if (e instanceof AxiosError) {
                console.log(e.message)
                return ({
                    success: false,
                    error: e.message,
                    updatedStatus: ""
                })
            }
            return ({
                success: false,
                error: "failed to update the tour status",
                updatedStatus: ""
            })
        }
    }

    const useGetRecentTourBookings = () => {
        return useQuery({
            queryKey: ["RECENTTOURBOOKINGS"],
            queryFn: async () => {
                try {
                    const recent = await api.get("/recent")
                    console.log(recent.data.tourRequests)
                    const data = recent.data.tourRequests
                    return ({ success: true, tourRequests: data })

                }
                catch (e: unknown) {
                    if (e instanceof AxiosError) {
                        console.log(e.message)
                        return ({
                            success: false,
                            error: e.message,
                            tourRequests: []
                        })
                    }
                    return ({
                        success: false,
                        error: "failed to update the tour status",
                        tourRequests: []
                    })
                }
            }
        })
    }

    const useCancelTourBooking = () => {
        return useMutation({
            mutationFn: async (tourId: string) => {
                await api.put(`/cancel/${tourId}`);
            },
            onSuccess: (_data, tourId) => {
                queryClient.invalidateQueries({ queryKey: ["TOURBOOKINGS"] });
                queryClient.invalidateQueries({ queryKey: ["USERTOURBOOKINGS"] });
                if (tourId) {
                    queryClient.invalidateQueries({ queryKey: ["USERTOURBOOKINGS", tourId] });
                    queryClient.invalidateQueries({ queryKey: ["TOURBOOKINGS", tourId] });
                }
            },
        });
    }

    const useGetAllTourBookings = () => {
        return (
            useQuery({
                queryKey: ["TOURBOOKINGS"],
                queryFn: async () => {
                    try {
                        console.log("inside userget ")
                        const tourRequest = await api.get("/")
                        const data: TourDataType[] = tourRequest.data
                        return ({ success: true, tourRequests: data })
                    }
                    catch (e: unknown) {
                        if (e instanceof AxiosError) {
                            console.log(e)
                            return ({ success: false, error: e.message, tourRequests: [] })
                        }
                        return ({ success: false, error: "faled to get all tour bookings", tourRequests: [] })

                    }
                },
                staleTime: 5 * 60 * 1000,
                gcTime: 6 * 60 * 6000,
                refetchOnWindowFocus: true,
                refetchOnReconnect: true,
                retry: 2
            })
        )
    }

    const useGetAllTourBookingsByUserId = (userId: string) => {
        return (
            useQuery({
                queryKey: ["USERTOURBOOKINGS"],
                queryFn: async () => {
                    try {
                        console.log("inside userget ")
                        const tourRequest = await api.get(`/data/user/${userId}`)
                        const data: TourDataType[] = tourRequest.data
                        return ({ success: true, tourRequests: data })
                    }
                    catch (e: unknown) {
                        if (e instanceof AxiosError) {
                            console.log(e)
                            return ({ success: false, error: e.message, tourRequests: [] })
                        }
                        return ({ success: false, error: "faled to get all tuser our bookings", tourRequests: [] })
                    }
                },
                enabled: !!userId,
                staleTime: 5 * 60 * 1000,
                gcTime: 6 * 60 * 6000,
                refetchOnWindowFocus: true,
                refetchOnReconnect: true,
                retry: 2
            })
        )
    }

    const getUserTourRequestById = async (tourId: string) => {
        try {
            setIsLoading(true);

            // Attempt to get data from cache first
            const cachedTour = queryClient.getQueryData<CachedTourRequestType>(["USERTOURBOOKINGS"]);
            console.log("Triggered getting data from cache");

            // Check if cached data exists and contains the tour ID
            const data = cachedTour?.tourRequests?.find((tour: TourDataType) => tour.tourRequestId === tourId);

            if (data) {
                console.log("Cache hit for tour ID:", tourId);
                setUserTourByIdData(data);
                setIsLoading(false);
                return {
                    success: true,
                    tourRequests: data, // Return directly from cache
                };
            }

            // Fallback to API call if not found in cache
            console.log("Cache miss, making API call for tour ID:", tourId);
            const res = await api.get(`/data/${tourId}`);

            if (res.data) {
                // Update state and cache
                setUserTourByIdData(res.data);
                queryClient.setQueryData(["USERTOURBOOKINGS", tourId], res.data);

                setIsLoading(false);
                return {
                    success: true,
                    tourRequests: res.data, // Use response data directly
                };
            }

            setIsLoading(false);
            return {
                success: false,
                error: "Tour not found",
                tourRequests: undefined,
            };
        } catch (e: unknown) {
            setIsLoading(false);
            if (e instanceof AxiosError) {
                console.log("Error fetching tour by ID:", e.message);
                return {
                    success: false,
                    error: e.response?.data?.message || "Failed to get tour by ID",
                    tourRequests: undefined,
                };
            }

            return {
                success: false,
                error: "An unknown error occurred while fetching the tour by ID",
                tourRequests: undefined,
            };
        }
    };


    const useUserTourBookingsById = (tourId: string) => {
        return useQuery({
            queryKey: ["USERTOURBOOKINGS", tourId],
            queryFn: () => getUserTourRequestById(tourId),
            staleTime: 5 * 60 * 1000,
            gcTime: 6 * 60 * 6000,
            refetchOnWindowFocus: true,
            refetchOnReconnect: true,
            retry: 2
        })
    }

    const useTourBookingsById = (tourId: string) => {
        return useQuery({
            queryKey: ["TOURBOOKINGS", tourId],
            queryFn: () => getTourRequestById(tourId),
            staleTime: 5 * 60 * 1000,
            gcTime: 6 * 60 * 6000,
            refetchOnWindowFocus: true,
            refetchOnReconnect: true,
            retry: 2
        })
    }

    const getTourRequestById = async (tourId: string) => {
        try {
            const cachedTour = queryClient.getQueryData<CachedTourRequestType>(["TOURBOOKINGS"]);
            console.log("Triggered getting data from cache");

            const data = cachedTour?.tourRequests.find((tour: TourDataType) => tour.tourRequestId === tourId);
            setTourByIdData(data);

            if (data) {
                return {
                    success: true,
                    tourRequests: data
                };
            }
            // Fallback if not found
            return {
                success: false,
                error: "Tour not found",
                tourRequests: undefined // Explicitly set as undefined
            };
        } catch (e: unknown) {
            if (e instanceof AxiosError) {
                console.log("Error fetching tour by ID:", e.message);
                return {
                    success: false,
                    error: e.response?.data?.message || "Failed to get tour by ID",
                    tourRequests: undefined,
                };
            }
            return {
                success: false,
                error: "Failed to get tour by ID",
                tourRequests: undefined // Explicitly set as undefined
            };
        }
    };

    const useRescheduleTourBooking = () => {
        return useMutation({
            mutationFn: async ({ tourId, preferredDate, preferredTime }: { tourId: string; preferredDate: string; preferredTime: string }) => {
                await api.put(`/reschedule/${tourId}`, { preferredDate, preferredTime });
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["TOURBOOKINGS"] });
                queryClient.invalidateQueries({ queryKey: ["USERTOURBOOKINGS"] });
                queryClient.invalidateQueries({ queryKey: ["RECENTTOURBOOKINGS"] });
            },
        });
    };

    const useSearchTourBookings = (searchParams: {
        search?: string;
        status?: string;
        startDate?: string;
        endDate?: string;
        page?: number;
        limit?: number;
        sortBy?: string;
        sortOrder?: string;
    }) => {
        return useQuery({
            queryKey: ["SEARCHTOURBOOKINGS", searchParams],
            queryFn: async () => {
                try {
                    const params = new URLSearchParams();
                    Object.entries(searchParams).forEach(([key, value]) => {
                        if (value !== undefined && value !== '') {
                            params.append(key, value.toString());
                        }
                    });

                    const response = await api.get(`/search?${params.toString()}`);
                    return {
                        success: true,
                        tourRequests: response.data.tourRequests,
                        pagination: response.data.pagination
                    };
                } catch (e: unknown) {
                    if (e instanceof AxiosError) {
                        return {
                            success: false,
                            tourRequests: [],
                            pagination: null,
                            error: e.response?.data?.message || "Failed to search tour bookings"
                        };
                    }
                    return {
                        success: false,
                        tourRequests: [],
                        pagination: null,
                        error: "An unknown error occurred"
                    };
                }
            },
            enabled: Object.values(searchParams).some(value => value !== undefined && value !== ''),
            staleTime: 5 * 60 * 1000,
            gcTime: 6 * 60 * 6000,
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
            retry: 2
        });
    };

    const values = {
        createTourRequest,
        isLoading,
        tourByIdData,
        userTourByIdData,
        useGetAllTourBookingsByUserId,
        useGetAllTourBookings,
        updateTourStatus,
        useTourBookingsById,
        useGetRecentTourBookings,
        useUserTourBookingsById,
        useCancelTourBooking,
        useRescheduleTourBooking,
        useSearchTourBookings
    }

    return <TourContext.Provider value={values}>
        {children}
    </TourContext.Provider>

}

export const useTour = () => {
    const context = useContext(TourContext);
    if (context === undefined) {
        throw new Error('useTour must be used within an AuthContextProvider');
    }
    return context;
};


export default TourContextProvider
import { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import { Dispatch, SetStateAction } from "react";
import { AdminDashboardStatsType, BlogDataType, LoginDataType, PropertyType, RegisterDataType, TourDataType, UserType } from "./payloadType";

export type PropertyContextType = {
    addProperty: (propertyData: PropertyType | FormData) => Promise<{ success: boolean; error?: string }>,
    updateProperty: (formWithImage: FormData, propertyId: string) => Promise<{ success: boolean; error?: string }>,
    deleteProperty: (propertyId: string) => Promise<{ success: boolean; error?: string }>,
    useAllProperty: () => UseQueryResult<{ success: boolean; error?: string, properties: PropertyType[] } | undefined>,
    useGetAllFeaturedProperty: () => UseQueryResult<{ success: boolean; error?: string, properties: PropertyType[] } | undefined>,
    getPropertyById: (propertyId: string) => Promise<{ success: boolean; error?: string, property: PropertyType | null }>
    propertyById: PropertyType | null
    deletePropertyId: string,
    useGetAllRecentProperties: () => UseQueryResult<{ success: boolean; error?: string, recentProperties: PropertyType[] }>,
    setDeletePropertyId: Dispatch<SetStateAction<string>>,
    getCanBookStatus: ({ propertyId }: { propertyId: string }) => Promise<{ success: boolean; error?: string }>
    canBookTourStatus: boolean | null,
    setCanBookTourStatus: Dispatch<SetStateAction<boolean | null>>,
    checkFavoriteStatus: (propertyId: string) => Promise<{ success: boolean; isFavorited: boolean }>,
    useAdminDashboardStats: () => UseQueryResult<{
        success: boolean;
        error?: string;
        stats: AdminDashboardStatsType | null;
    }>;

}
export type AuthContextType = {
    user: UserType;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (loginData: LoginDataType) => Promise<{ success: boolean; error?: string }>;
    register: (registerData: RegisterDataType) => Promise<{ success: boolean; error?: string }>;
    checkstatus: () => Promise<void>;
    logout: () => Promise<{ success: boolean; error?: string }>
    requestResetPassword: (email: string) => Promise<{ success: boolean }>
    resetPassword: (token: string, newPassword: string) => void
    editProfile: (profileData: { fullName: string; email: string; phoneNumber: string; password?: string }) => Promise<{ success: boolean; user?: UserType; error?: string }>;
};

export type TourContextType = {
    isLoading: boolean;
    createTourRequest: (tourData: TourDataType) => Promise<{ success: boolean; error?: string }>;
    useGetAllTourBookings: () => UseQueryResult<{ success: boolean; error?: string; tourRequests: TourDataType[] } | undefined>;
    useGetAllTourBookingsByUserId: (userId: string) => UseQueryResult<{ success: boolean; error?: string; tourRequests: TourDataType[] } | undefined>;
    useTourBookingsById: (tourId: string) => UseQueryResult<{ success: boolean; error?: string; tourRequests: TourDataType | undefined }>;
    useUserTourBookingsById: (tourId: string) => UseQueryResult<{ success: boolean; error?: string; tourRequests: TourDataType | undefined }>;
    updateTourStatus: (status: string, tourId: string) => Promise<{ success: boolean; error?: string; updatedStatus: string }>;
    useGetRecentTourBookings: () => UseQueryResult<{ success: boolean; error?: string; tourRequests: TourDataType[] | [] }>;
    useSearchTourBookings: (searchParams: {
        search?: string;
        status?: string;
        startDate?: string;
        endDate?: string;
        page?: number;
        limit?: number;
        sortBy?: string;
        sortOrder?: string;
    }) => UseQueryResult<{
        success: boolean;
        tourRequests: TourDataType[];
        pagination: {
            currentPage: number;
            totalPages: number;
            totalItems: number;
            itemsPerPage: number;
            hasNextPage: boolean;
            hasPrevPage: boolean;
        } | null;
        error?: string;
    }>;
    tourByIdData: TourDataType | undefined;
    useCancelTourBooking: () => UseMutationResult<void, unknown, string, unknown>;
    useRescheduleTourBooking: () => UseMutationResult<void, unknown, { tourId: string; preferredDate: string; preferredTime: string }, unknown>;
};

export type BlogContextType = {
    createBlog: (data: BlogDataType) => Promise<{ success: boolean; error?: string }>;
    updateBlog: (id: string, data: Partial<BlogDataType>) => Promise<{ success: boolean; error?: string }>;
    deleteBlog: (id: string) => Promise<{ success: boolean; error?: string }>;
    useGetAllBlogs: () => UseQueryResult<{
        success: boolean;
        totalPages: number,
        currentPage: number,
        total: number,
        blogs: BlogDataType[] | undefined; error?: string
    }>;

    useGetRecentBlogs: () => UseQueryResult<{
        success: boolean;
        blogs: BlogDataType[] | undefined;
        error?: string
    }>;

    useSearchBlogs: (searchParams: {
        keyword?: string;
        sortBy?: string;
        page?: number;
        limit?: number;
    }) => UseQueryResult<{
        success: boolean;
        blogs: BlogDataType[];
        totalPages: number;
        currentPage: number;
        total: number;
        error?: string;
    }>;

    getBlogById: (id: string) => Promise<{ success: boolean; blog: BlogDataType | undefined; error?: string }>;
    blogByIdData: BlogDataType | undefined
    isLoading: boolean;
    currentPage: number,
    setCurrentPage: Dispatch<SetStateAction<number>>
};

export type SearchContextType = {
    searchKeyword: string
    setSearchKeyword: Dispatch<SetStateAction<string>>
    setBlogSearchKeyword: Dispatch<SetStateAction<string>>,

    setPropertyQueryParamsWithSession: (query: string) => void
    setBlogQueryParams: Dispatch<SetStateAction<string>>,

    setPrimeLocationQuery: Dispatch<SetStateAction<string>>
    setCurrentPropertyPageWithSession: (page: number | ((prev: number) => number)) => void;
    setBlogCurrentPageWithSession: (page: number | ((prev: number) => number)) => void;
    blogCurrentPage: number
    currentPage: number,

    queryParams: string
    useSearchProperties: () => UseQueryResult<{
        success: boolean;
        error?: string;
        properties: PropertyType[];
        totalPages: number,
        currentPage: number
    }>;
    useSearchBlogs: () => UseQueryResult<{
        success: boolean;
        error?: string;
        blogs: BlogDataType[];
        totalPages: number,
        currentPage: number
    }>;


}


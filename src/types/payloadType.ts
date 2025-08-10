import { FURNISHING_TYPES, LISTING_TYPES, PROPERTY_TYPES, STATUS_TYPES, TOUR_TYPES } from "./enumTypes";

export type UserType = {
  id: string;
  email: string;
  fullName: string;
  role?: string
} | null;

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

export type NotificationType = {
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
};

export type LoginDataType = {
  email: string;
  password: string;
};

export type PropertyType = {
  propertyId?: string,
  propertyName: string,
  propertyType: PROPERTY_TYPES,
  listingType: LISTING_TYPES,
  propertyPrice: string,
  areaTotal: string,
  bedrooms: number,
  bathrooms: number,
  kitchens: number,
  floorCount: number,
  furnishingStatus: FURNISHING_TYPES,
  yearBuilt: string,
  address: string,
  city: string,
  status: STATUS_TYPES
  district: string,
  latitude?: number,
  longitude?: number,
  images?: File[] | string[]
  isFeatured?: boolean,
  description: string,
  amneties?: string[],
  featuredImage?: string
}

export type UpdatePropertyType = {
  propertyId?: string,
  propertyName?: string,
  propertyType?: PROPERTY_TYPES,
  listingType?: LISTING_TYPES,
  propertyPrice?: string,
  areaTotal?: string,
  bedrooms?: number,
  bathrooms?: number,
  kitchens?: number,
  status?: STATUS_TYPES,
  floorCount?: number,
  furnishingStatus?: FURNISHING_TYPES,
  yearBuilt?: string,
  address?: string,
  city?: string,
  district?: string,
  latitude?: number,
  images?: File[] | string[],
  longitude?: number,
  isFeatured?: boolean
  description: string,
  amneties?: string[],
  createdAt?: string

}
export type CachedPropertyType = {
  success: boolean
  properties: PropertyType[] | []
}
export type CachedTourRequestType = {
  success: boolean
  tourRequests: TourDataType[] | []
}
export type TourDataType = {
  tourRequestId?: string,
  userId: string | undefined,
  propertyId: string,
  fullName: string,
  email: string,
  phone: string,
  preferredDate: string,
  preferredTime: string,
  status?: TOUR_TYPES,
  Property?: PropertyType,
  User?: UserType,
  createdAt?: string
}
export type RegisterDataType = {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  role: string;
}

export type BlogDataType = {
  blogId?: string;
  title: string;
  excerpt: string;
  creator?: Partial<UserType>
  content: string;
  featuredImage: string;
  publishDate: string | null;
  tags: string[] | null;
  authorName: string
  creatorId: string;
  subtitle?: string;
  description?: string;
  intro?: string;
};

export type CachedBlogListType = {
  blogs: BlogDataType[];
};

export type ResetPasswordType = {
  token: string
  newPassword: string
}

export type FavoriteProperty = {
  favoriteId: string;
  userId: string;
  propertyId: string;
  isDeleted: boolean;
  createdAt: string;
  property: PropertyType
};

export type AdminDashboardStatsType = {
  totalProperties: {
    value: number;
    change: string;
  };
  occupiedUnits: {
    value: number;
    change: string;
  };
  vacantUnits: {
    value: number;
    change: string;
  };
  monthlyRevenue: {
    value: number;
    change: string;
  };
}
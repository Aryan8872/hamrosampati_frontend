import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { createContext, ReactNode, useContext, useState } from "react";
import { BlogContextType } from "../types/contextTypes";
import { BlogDataType, CachedBlogListType } from "../types/payloadType";

const BlogContext = createContext<BlogContextType | undefined>(undefined);

const BlogContextProvider = ({ children }: { children: ReactNode }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [blogByIdData, setBlogByIdData] = useState<BlogDataType>()
    const queryClient = useQueryClient();
    const [currentPage, setCurrentPage] = useState<number>(1)

    const api = axios.create({
        baseURL: "http://localhost:3000/api/blog",
        withCredentials: true,
        headers: {
            "Content-Type": "application/json",
        },
    });

    const createBlog = async (blogData: BlogDataType) => {
        try {
            setIsLoading(true);
            await api.post("/", blogData);
            setIsLoading(false);
            queryClient.invalidateQueries({ queryKey: ["BLOGS"] });
            return { success: true };
        } catch (e: unknown) {
            setIsLoading(false);
            if (e instanceof AxiosError) {
                return ({
                    success: false,
                    error: e.response?.data?.message || "Failed to create blog",
                });
            }
        }
        return { success: false, error: "An unknown error occurred" };

    };

    const updateBlog = async (blogId: string, blogData: Partial<BlogDataType>) => {
        try {
            await api.put(`/${blogId}`, blogData);
            queryClient.invalidateQueries({ queryKey: ["BLOGS"] });
            return { success: true };
        } catch (e: unknown) {
            if (e instanceof AxiosError) {
                return ({
                    success: false,
                    error: e.response?.data?.message || "Failed to update blog",
                })
            }

            return ({ success: false, error: "An unknown error occurred" });

        }

    };

    const deleteBlog = async (blogId: string) => {
        try {
            await api.delete(`/${blogId}`);
            queryClient.invalidateQueries({ queryKey: ["BLOGS"] });
            return { success: true };
        } catch (e: unknown) {
            if (e instanceof AxiosError) {
                return {
                    success: false,
                    error: e.response?.data?.message || "Failed to delete blog",
                };
            }
        }
        return { success: false, error: "An unknown error occurred" };

    };

    const useGetAllBlogs = () => {
        return useQuery({
            queryKey: ["BLOGS", currentPage],
            queryFn: async () => {
                try {
                    const res = await api.get(`/?page=${currentPage}`);
                    const data: BlogDataType[] = res.data.blogs.blogs
                    return {
                        success: true,
                        currentPage: res.data.blogs.currentPage,
                        totalPages: res.data.blogs.totalPages,
                        total: res.data.blogs.total,
                        blogs: data
                    };
                } catch (e: unknown) {
                    if (e instanceof AxiosError) {
                        return {
                            success: false,
                            currentPage: 1,
                            totalPages: 1,
                            total: 0,
                            error: e.message,
                            blogs: []
                        };
                    }
                    return {
                        success: false,
                        currentPage: 1,
                        totalPages: 1,
                        total: 0,
                        error: "Failed to fetch blogs", blogs: []
                    };
                }
            },
            staleTime: 5 * 60 * 1000,
        });
    };


    const useGetRecentBlogs = () => {
        return useQuery({
            queryKey: ["RECENTBLOGS"],
            queryFn: async () => {
                try {
                    console.log("recent blogs")
                    const res = await api.get(`/recent/posts`);
                    const data: BlogDataType[] = res.data
                    console.log("recent blogs")

                    console.log(res.data)
                    return {
                        success: true,
                        blogs: data
                    };
                } catch (e: unknown) {
                    if (e instanceof AxiosError) {
                        return {
                            success: false,

                            error: e.message,
                            blogs: []
                        };
                    }
                    return {
                        success: false,

                        error: "Failed to fetch blogs", blogs: []
                    };
                }
            },
            staleTime: 5 * 60 * 1000,
        });
    };

    const getBlogById = async (blogId: string) => {
        try {
            const cached = queryClient.getQueryData<CachedBlogListType>(["BLOGS"]);
            const found = cached?.blogs.find((b: BlogDataType) => b.blogId === blogId);
            if (found) {
                setBlogByIdData(found)
                console.log('found cache', found)
                return { success: true, blog: found }
            };

            await api.get(`/${blogId}`).then((res) => {
                setBlogByIdData(res.data)
            })
            return {
                success: true,
                blog: blogByIdData
            };
        } catch (e: unknown) {
            if (e instanceof AxiosError) {
                return { success: false, error: e.message, blog: undefined };
            }
            return { success: false, error: "Failed to fetch blog", blog: undefined };
        }
    }

    const useSearchBlogs = (searchParams: {
        keyword?: string;
        sortBy?: string;
        page?: number;
        limit?: number;
    }) => {
        return useQuery({
            queryKey: ["SEARCHBLOGS", searchParams],
            queryFn: async () => {
                try {
                    const params = new URLSearchParams();
                    Object.entries(searchParams).forEach(([key, value]) => {
                        if (value !== undefined && value !== '') {
                            params.append(key, value.toString());
                        }
                    });

                    const response = await api.get(`/search/blog?${params.toString()}`);
                    return {
                        success: true,
                        blogs: response.data.blogs.blogs,
                        totalPages: response.data.blogs.totalPages,
                        currentPage: response.data.blogs.currentPage,
                        total: response.data.blogs.total
                    };
                } catch (e: unknown) {
                    if (e instanceof AxiosError) {
                        return {
                            success: false,
                            blogs: [],
                            totalPages: 1,
                            currentPage: 1,
                            total: 0,
                            error: e.response?.data?.message || "Failed to search blogs"
                        };
                    }
                    return {
                        success: false,
                        blogs: [],
                        totalPages: 1,
                        currentPage: 1,
                        total: 0,
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
        createBlog,
        updateBlog,
        deleteBlog,
        useGetAllBlogs,
        useGetRecentBlogs,
        useSearchBlogs,
        getBlogById,
        blogByIdData,
        setCurrentPage,
        currentPage,
        isLoading,
    };

    return <BlogContext.Provider value={values}>{children}</BlogContext.Provider>;
};

export const useBlog = () => {
    const context = useContext(BlogContext);
    if (context === undefined) {
        throw new Error("useBlog must be used within a BlogContextProvider");
    }
    return context;
};

export default BlogContextProvider;

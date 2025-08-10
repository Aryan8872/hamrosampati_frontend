import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { createContext, ReactNode, useContext, useState } from "react";
import { useDebounce } from "use-debounce";
import { SearchContextType } from "../types/contextTypes";

const SearchContext = createContext<SearchContextType | undefined>(undefined)


const SearchContextProvider = ({ children }: { children: ReactNode }) => {
    const [searchKeyword, setSearchKeyword] = useState<string>("")
    const [blogSearchKeyword, setBlogSearchKeyword] = useState<string>("")
    const [blogQueryParams, setBlogQueryParams] = useState<string>("")
    const [debouncedKeyword] = useDebounce(searchKeyword, 1000);
    const [debouncedBlogKeyword] = useDebounce(blogSearchKeyword, 1000)
    const [queryParams, setQueryParams] = useState<string>(() => {
        const saved = sessionStorage.getItem("PropertyQueryParams")
        return saved ?? ''
    })

    const [currentPage, setCurrentPage] = useState<number>(() => {
        const saved = sessionStorage.getItem("PropertyCurrentPageNumber");
        return saved ? parseInt(saved) : 1;
    });

    const [blogCurrentPage, setBlogCurrentPage] = useState<number>(() => {
        const saved = sessionStorage.getItem("BlogCurrentPageNumber");
        return saved ? parseInt(saved) : 1;
    });

    const [primelocationQuery,setPrimeLocationQuery] = useState<string>("")




    const api = axios.create({
        baseURL: "http://localhost:3000/api/v1",
        withCredentials: true,
        headers: {
            "Content-Type": "application/json"
        }
    })
    const setCurrentPropertyPageWithSession = (page: number | ((prev: number) => number)) => {
        setCurrentPage((prev) => {
            const newPage = typeof page === "function" ? page(prev) : page;
            sessionStorage.setItem("PropertyCurrentPageNumber", newPage.toString());
            return newPage;
        });
    };

    const setBlogCurrentPageWithSession = (page: number | ((prev: number) => number)) => {
        setBlogCurrentPage((prev) => {
            const newPage = typeof page === "function" ? page(prev) : page;
            sessionStorage.setItem("BlogCurrentPageNumber", newPage.toString());
            return newPage;
        });
    };

    const setPropertyQueryParamsWithSession = (query: string) => {
        setQueryParams(() => {
            sessionStorage.setItem("PropertyQueryParams", query)
            return query
        })
    }


    const useSearchProperties = () => {
        console.log(queryParams)
        return useQuery({
            queryKey: ['searchedProperties', debouncedKeyword,primelocationQuery, queryParams, currentPage],
            queryFn: async () => {
                console.log(queryParams)
                try {
                    const res = await api.get(`/search/property?keyword=${debouncedKeyword}&${queryParams}&${primelocationQuery}&page=${currentPage}`);
                    return {
                        success: true,
                        properties: res.data.searchResults.properties,
                        totalPages: res.data.searchResults.totalPages,
                        currentPage: res.data.searchResults.currentPage
                    };
                } catch (e: unknown) {
                    const err = e as AxiosError;
                    return { success: false, error: err.message || "Unknown error", properties: [], totalPages: 1, currentPage: 1 };
                }
            },
            staleTime: 300_000,
        });
    };

    const useSearchBlogs = () => {
        return useQuery({
            queryKey: ['searchedBlogs', debouncedBlogKeyword, blogQueryParams, blogCurrentPage],
            queryFn: async () => {
                try {
                    const res = await axios.get(`http://localhost:3000/api/blog/search/blog?keyword=${debouncedBlogKeyword}&${blogQueryParams}&page=${blogCurrentPage}`);
                    console.log(res.data)
                    return {
                        success: true,
                        blogs: res.data.blogs.blogs,
                        totalPages: res.data.blogs.totalPages,
                        currentPage: res.data.blogs.currentPage
                    };
                } catch (e: unknown) {
                    const err = e as AxiosError;
                    return { success: false, error: err.message || "Unknown error", blogs: [], totalPages: 1, currentPage: 1 };
                }
            },
            staleTime: 300_000,
        });
    };


    const values = {
        searchKeyword,
        setSearchKeyword,
        setPropertyQueryParamsWithSession,
        queryParams,
        useSearchProperties,
        currentPage,
        blogCurrentPage,
        setPrimeLocationQuery,
        setCurrentPropertyPageWithSession,
        useSearchBlogs,
        setBlogSearchKeyword,
        setBlogCurrentPageWithSession,
        setBlogQueryParams,
    }

    return (
        <SearchContext.Provider value={values}>
            {children}
        </SearchContext.Provider>
    )

}

export const useSearch = () => {
    const context = useContext(SearchContext)
    if (context === undefined) {
        throw new Error('useSearch must be used within an AuthContextProvider');
    }
    return context
}

export default SearchContextProvider
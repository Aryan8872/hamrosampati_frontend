import { motion } from "framer-motion";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FiChevronLeft, FiChevronRight, FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";
import BlogCard from "../components/blog/BlogCard";
import { useBlog } from "../context/BlogContext";
import { useSearch } from "../context/SearchContext";

const FeaturedSidebar = () => {
    const { t } = useTranslation();
    const { useGetRecentBlogs } = useBlog()
    const { data } = useGetRecentBlogs()
    const recentBlogs = data?.blogs
    console.log(recentBlogs)
    return (
        <div className="bg-white rounded-lg shadow-md pt-5 pb-7 px-4">
            <h4 className="text-lg font-bold text-gray-900 mb-3">{t("Latest")}</h4>
            <div className="flex flex-col gap-6">
                {recentBlogs?.map((post, index) => (
                    <Link to={`/blog/${post.blogId}`}>
                        <div key={index} className="flex gap-3">
                            <img
                                src={post.featuredImage}
                                alt={post.title}
                                className="w-24 h-24 object-cover rounded flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                                <span className="text-sm text-gray-400"> {new Date(post.publishDate!).toISOString().split('T')[0]}</span>
                                <h5 className="text-md font-medium font-ManropeMedium text-gray-900  mb-1 break-words break-all ">
                                    {post.title}
                                </h5>
                            </div>
                        </div>
                    </Link>

                ))}
            </div>
        </div>
    );
};

const TheBlog = () => {
    const [searchKeyword, setSearchKeywork] = useState<string>("")
    const { t } = useTranslation()
    const { useSearchBlogs, setBlogSearchKeyword, setBlogCurrentPageWithSession } = useSearch()
    const { data } = useSearchBlogs()

    const totalPages = data?.totalPages ?? 1
    const currentPage = data?.currentPage ?? 1
    const blogs = data?.blogs

    const handleBlogSearch = () => {
        setBlogSearchKeyword(searchKeyword)
        setBlogCurrentPageWithSession(1)
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Section */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
                    <motion.div
                        className="text-center"
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="mb-4">
                            <span className="text-sm text-gray-500 uppercase tracking-wide">{t("Blog")}</span>
                        </div>
                        <h1 className=" text-2xl sm:text-3xl md:text-4xl font-ManropeBold text-gray-900 mb-4">
                            {t("Discover our latest news")}
                        </h1>
                        <p className="max-w-2xl mx-auto text-sm md:text-md font-ManropeMedium text-gray-600 mb-8">
                            {t("Discover the achievements that set us apart. From groundbreaking projects to industry accolades, we take pride in our accomplishments")}.
                        </p>

                        {/* Search Box */}
                        <div className="flex gap-3 justify-center">
                            <div className="w-[300px] md:w-[380px] lg:w-[400px] xl:w-[450px]">
                                <div className="flex max-w-md w-full">
                                    <div className="relative flex-1">
                                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="text"
                                            placeholder={t("Type Keywords...")}
                                            value={searchKeyword}
                                            onChange={(e) => setSearchKeywork(e.target.value)}
                                            className="w-full font-ManropeRegular text-sm sm:text-base pl-10 pr-4 py-3 border border-gray-300 rounded-l-md focus:outline-none "
                                        />
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={handleBlogSearch}
                                className="px-3 sm:px-6 py-3 text-sm sm:text-base bg-blue-600 text-white font-ManropeMedium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                            >
                                {t("Search")}
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Main Content */}
            <div className="w-full sm:w-[90%] xl:w-[85%] mx-1 sm:mx-auto px-4 sm:px-6 py-12">
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="lg:flex-1">
                        <h2 className="text-2xl sm:text-2xl md:text-3xl font-ManropeSemiBold text-gray-900 mb-6">{t("Whiteboards are remarkable")}.</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-max">
                            {blogs?.map((post, index) => (
                                <motion.div
                                    key={post.blogId}
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: index * 0.1 }}

                                >
                                    <BlogCard
                                        date={post.publishDate!}
                                        blogId={post.blogId!}
                                        title={post.title}
                                        description={post.excerpt}
                                        imageUrl={post.featuredImage}
                                    />
                                </motion.div>
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="mt-24 ml-3 flex items-center">
                            <nav className="flex items-center space-x-2">
                                <motion.button
                                    whileHover={{ backgroundColor: 'rgba(243, 244, 246, 1)' }}
                                    whileTap={{ scale: 0.95 }}
                                    className="p-2 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50"
                                >
                                    <FiChevronLeft className="w-5 h-5" />
                                </motion.button>

                                {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => (
                                    <motion.button
                                        key={i}
                                        whileHover={{ scale: 1.05 }}
                                        onClick={() => setBlogCurrentPageWithSession(i + 1)}
                                        className={`px-4 py-2 rounded-md font-medium ${currentPage === i + 1
                                            ? 'bg-blue-600 text-white'
                                            : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                    >
                                        {i + 1}
                                    </motion.button>
                                ))}

                                {totalPages > 3 && (
                                    <>
                                        <span className="px-2 text-gray-500">...</span>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            onClick={() => setBlogCurrentPageWithSession(totalPages)}
                                            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                                        >
                                            {totalPages}
                                        </motion.button>
                                    </>
                                )}

                                <motion.button
                                    whileHover={{ backgroundColor: 'rgba(243, 244, 246, 1)' }}
                                    whileTap={{ scale: 0.95 }}
                                    className="p-2 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50"
                                >
                                    <FiChevronRight className="w-5 h-5" />
                                </motion.button>

                                <button className="ml-4 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                                    {t("NEXT")}
                                </button>
                            </nav>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="hidden lg:block w-80">
                        <FeaturedSidebar />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TheBlog;
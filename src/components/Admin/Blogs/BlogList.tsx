import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useState } from "react"
import { FaCalendar, FaEdit, FaPlus, FaSearch, FaSort, FaTag, FaTrash } from "react-icons/fa"
import { toast } from "react-toastify"
import { useBlog } from "../../../context/BlogContext"
import ConfirmationModal from "../../ConfirmationModal"
import { AddBlog } from "./AddBlog"
import { UpdateBlog } from "./UpdateBlog"

const BlogList = () => {
    const [showAddBlogModal, setShowAddBlogModal] = useState(false)
    const [showUpdateBlogModal, setShowUpdateBlogModal] = useState(false)
    const [showDeleteConfirmationModal, setDeleteConfirmationModal] = useState(false)
    const [deleteBlogId, setDeleteBlogId] = useState<string>()
    const [searchTerm, setSearchTerm] = useState("")
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
    const [sortBy, setSortBy] = useState<string>("")
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const { getBlogById, useGetAllBlogs, useSearchBlogs, deleteBlog, setCurrentPage } = useBlog()

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm)
        }, 500)

        return () => clearTimeout(timer)
    }, [searchTerm])

    // Determine which query to use based on search parameters
    const hasSearchParams = debouncedSearchTerm.trim() !== "" || sortBy !== ""

    const { data: searchData, isLoading: searchLoading, error: searchError } = useSearchBlogs({
        keyword: debouncedSearchTerm.trim() || undefined,
        sortBy: sortBy || undefined,
        page: 1,
        limit: 10
    })
    const { data: allBlogsData, isLoading: allBlogsLoading, error: allBlogsError } = useGetAllBlogs()

    // Use search results if there are search parameters, otherwise use all blogs
    const data = hasSearchParams ? searchData : allBlogsData
    const isLoading = hasSearchParams ? searchLoading : allBlogsLoading
    const error = hasSearchParams ? searchError : allBlogsError

    const blogs = data?.blogs
    const currentPage = data?.currentPage ?? 1
    const totalPages = data?.totalPages ?? 1
    const total = data?.total ?? 0

    const handleUpdate = async (blogId: string) => {
        try {
            await getBlogById(blogId)
            setShowUpdateBlogModal(true)
        } catch {
            toast.error("Failed to load blog details")
        }
    }
    const handleDelete = (blogId: string) => {
        setDeleteBlogId(blogId)
        setDeleteConfirmationModal(true)
    }

    const confirmDelete = async () => {
        if (!deleteBlogId) return

        try {
            await deleteBlog(deleteBlogId)
            toast.success("Blog deleted successfully")
            setDeleteConfirmationModal(false)
        } catch {
            toast.error("Failed to delete blog")
        }
    }

    const handleSearch = (value: string) => {
        setSearchTerm(value)
        setCurrentPage(1) // Reset to first page when searching
    }

    const handleSort = (value: string) => {
        setSortBy(value)
        setCurrentPage(1) // Reset to first page when sorting
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    if (isLoading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2563eb]"></div>
        </div>
    )
    if (error) return (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <div className="flex items-center">
                <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                </div>
                <div className="ml-3">
                    <p className="text-sm font-medium text-red-700">Failed to load blogs. Please try again.</p>
                </div>
            </div>
        </div>
    )

    return (
        <div className="bg-gray-50 min-h-screen p-6 font-ManropeRegular">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 font-ManropeBold">Blog Management</h1>
                            <p className="text-gray-600 mt-1 font-ManropeRegular">Create, edit, and manage your blog content</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex bg-white rounded-lg border border-gray-200 p-1">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${viewMode === 'grid'
                                        ? 'bg-blue-500 text-white'
                                        : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    Grid
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${viewMode === 'list'
                                        ? 'bg-blue-500 text-white'
                                        : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    List
                                </button>
                            </div>

                            <button
                                onClick={() => setShowAddBlogModal(true)}
                                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <FaPlus className="h-4 w-4" />
                                <span>Add Blog</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search blogs by title, content, or excerpt..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={searchTerm}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <FaSort className="text-gray-400" />
                            <select
                                value={sortBy}
                                onChange={(e) => handleSort(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Sort by</option>
                                <option value="recent">Most Recent</option>
                                <option value="oldest">Oldest First</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <FaTag className="h-4 w-4" />
                            <span>{total} blogs found</span>
                        </div>
                    </div>
                </div>

                {/* Blog Content */}
                {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {blogs?.map((blog, index) => (
                            <motion.div
                                key={`blog${index}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                            >
                                {/* Blog Image */}
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={blog.featuredImage}
                                        alt={blog.title}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Blog+Image'
                                        }}
                                    />
                                    <div className="absolute top-3 left-3">
                                        <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                                            Blog #{blog.blogId}
                                        </span>
                                    </div>
                                </div>

                                {/* Blog Content */}
                                <div className="p-6">
                                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                                        <FaCalendar className="h-3 w-3" />
                                        <span>{blog.publishDate}</span>
                                    </div>

                                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                                        {blog.title}
                                    </h3>

                                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                        {blog.excerpt}
                                    </p>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleUpdate(blog.blogId!)}
                                            className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                                        >
                                            <FaEdit className="h-3 w-3" />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(blog.blogId!)}
                                            className="flex items-center justify-center gap-2 bg-red-50 text-red-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                                        >
                                            <FaTrash className="h-3 w-3" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    /* List View */
                    <div className="space-y-4">
                        {blogs?.map((blog, index) => (
                            <motion.div
                                key={`blog${index}`}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                            >
                                <div className="flex flex-col lg:flex-row gap-6">
                                    {/* Blog Image */}
                                    <div className="lg:w-48 lg:flex-shrink-0">
                                        <div className="w-full h-32 lg:h-40 rounded-lg overflow-hidden border border-gray-200">
                                            <img
                                                src={blog.featuredImage}
                                                alt={blog.title}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Blog+Image'
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Blog Content */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-md text-xs font-medium">
                                                Blog #{blog.blogId}
                                            </span>
                                            <div className="flex items-center gap-1 text-sm text-gray-500">
                                                <FaCalendar className="h-3 w-3" />
                                                <span>{blog.publishDate}</span>
                                            </div>
                                        </div>

                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                            {blog.title}
                                        </h3>

                                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                            {blog.excerpt}
                                        </p>

                                        {/* Actions */}
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => handleUpdate(blog.blogId!)}
                                                className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                                            >
                                                <FaEdit className="h-3 w-3" />
                                                Edit Blog
                                            </button>
                                            <button
                                                onClick={() => handleDelete(blog.blogId!)}
                                                className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                                            >
                                                <FaTrash className="h-3 w-3" />
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {blogs?.length === 0 && (
                    <div className="text-center py-12">
                        <FaSearch className="mx-auto h-12 w-12 text-gray-300" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No blogs found</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {searchTerm ? "Try adjusting your search criteria." : "Get started by creating your first blog post."}
                        </p>
                        {!searchTerm && (
                            <button
                                onClick={() => setShowAddBlogModal(true)}
                                className="mt-4 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors mx-auto"
                            >
                                <FaPlus className="h-4 w-4" />
                                Create First Blog
                            </button>
                        )}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center mt-8">
                        <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 p-2">
                            <button
                                onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed rounded-md hover:bg-gray-50"
                            >
                                Previous
                            </button>

                            <div className="flex items-center gap-1">
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    const page = i + 1
                                    return (
                                        <button
                                            key={page}
                                            onClick={() => handlePageChange(page)}
                                            className={`px-3 py-2 text-sm rounded-md ${currentPage === page
                                                ? 'bg-blue-600 text-white'
                                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    )
                                })}
                            </div>

                            <button
                                onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed rounded-md hover:bg-gray-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            <AnimatePresence>
                {showAddBlogModal && (
                    <AddBlog
                        onClose={() => setShowAddBlogModal(false)}
                        open={showAddBlogModal}
                    />
                )}

                {showUpdateBlogModal && (
                    <UpdateBlog
                        open={showUpdateBlogModal}
                        onClose={() => setShowUpdateBlogModal(false)}
                    />
                )}

                {showDeleteConfirmationModal && (
                    <ConfirmationModal
                        title="Delete Blog"
                        message="Are you sure you want to delete this blog? This action cannot be undone."
                        confirmText="Delete"
                        cancelText="Cancel"
                        onOpen={showDeleteConfirmationModal}
                        onClose={() => setDeleteConfirmationModal(false)}
                        onConfirm={confirmDelete}
                    />
                )}
            </AnimatePresence>
        </div>
    )
}

export default BlogList

import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { useBlog } from "../../context/BlogContext"

const BlogDetail = () => {
    const { getBlogById, blogByIdData, isLoading } = useBlog()
    const { id } = useParams()
    useEffect(() => {
        if (id) {
            getBlogById(id)
        }
    }, [id])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[40vh]">
                <span className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#2563eb]"></span>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full flex flex-col items-center bg-white">
            {/* Featured Image with Overlay */}
            <div className="relative w-full max-w-6xl mx-auto aspect-[2/1] sm:aspect-[16/7] md:aspect-[16/6] lg:aspect-[16/5] overflow-hidden rounded-b-2xl shadow-md">
                <img
                    src={blogByIdData?.featuredImage}
                    alt={blogByIdData?.title}
                    className="w-full h-full object-cover object-center"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/50 flex flex-col justify-end p-6 sm:p-10">
                    <h1 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight max-w-3xl mb-2">
                        {blogByIdData?.title}
                    </h1>
                    <h2 className="text-white text-lg sm:text-xl font-medium mb-4">
                        {blogByIdData?.subtitle || blogByIdData?.description}
                    </h2>
                    <div className="text-gray-200 text-sm">
                        <span>by <span className="font-semibold">{blogByIdData?.authorName}</span></span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="w-full max-w-4xl mx-auto px-4 sm:px-8 py-10">
                <div className="prose prose-lg max-w-none text-gray-800 font-ManropeRegular">
                    <p className="mb-6">
                        {blogByIdData?.intro}
                    </p>
                    <div className="break-words">
                        {blogByIdData?.content}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BlogDetail

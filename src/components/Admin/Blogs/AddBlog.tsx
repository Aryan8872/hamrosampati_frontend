import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../../context/AuthContext';
import { useBlog } from '../../../context/BlogContext';
import { blogSchema } from '../../../schemas/blogSchema';
import { BlogDataType } from '../../../types/payloadType';


type BlogPost = {
    id?: string;
    title: string;
    excerpt: string;
    content: string;
    featuredImage: string;
    author: string;
    publishDate: string;
    tags: string[];
}


// Form schema
// const formSchema = z.object({
//     title: z.string().min(5, { message: 'Title must be at least 5 characters' }),
//     excerpt: z.string().min(10, { message: 'Excerpt must be at least 10 characters' }),
//     content: z.string().min(50, { message: 'Content must be at least 50 characters' }),
//     featuredImage: z.string().url({ message: 'Please enter a valid URL for the featured image' }),
//     author: z.string().min(3, { message: 'Author name is required' }),
//     publishDate: z.string(),
//     tags: z.string().transform(val => val.split(',').map(tag => tag.trim()).filter(Boolean)),
// });

interface CreateBlogDialogProps {
    open: boolean;
    onClose: () => void;
    onSubmit?: (data: BlogPost) => void;
}

export const AddBlog: React.FC<CreateBlogDialogProps> = ({ open, onClose }) => {
    const { createBlog } = useBlog()
    const { user } = useAuth()
    const [blogData, setBlogData] = useState<BlogDataType>({
        creatorId: '',
        authorName:'',
        content: '',
        excerpt: '',
        featuredImage: '',
        publishDate: '',
        tags: [],
        title: '',
    })


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        e.preventDefault()
        const { name, value } = e.target
        setBlogData((prev) => ({
            ...prev,
            [name]: name === "tags" ? [value] : value
        }))

    }

    const handleFormSubmit = async () => {
        blogData.creatorId = user!.id!
        const parsedBlogData = blogSchema.validate(blogData,{abortEarly:false})
        if (parsedBlogData.error) {
            const errorMessages = parsedBlogData.error.details.map(err => err.message);
            toast.error(
                <div>
                    <p><strong>Please fix the following:</strong></p>
                    <ul className="list-disc pl-5">
                        {errorMessages.map((msg, index) => (
                            <li key={index}>{msg}</li>
                        ))}
                    </ul>
                </div>
            ); return;
        }

        const blog = await createBlog(blogData)
        if (blog.success) {
            toast.success("blog created successfully")
            onClose()
        }
        else {
            toast.error(blog.error)

        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white p-6 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">Create New Blog Post</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Column */}
                        <div className="space-y-5">
                            {/* Title */}
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                    Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    name="title"
                                    onChange={handleChange}
                                    type="text"
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500  border-gray-300`}
                                    placeholder="Enter blog title"
                                />

                            </div>

                            {/* Excerpt */}
                            <div>
                                <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">
                                    Excerpt <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    name="excerpt"
                                    onChange={handleChange}
                                    rows={3}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300`
                                    }
                                    placeholder="A brief summary of the blog post"
                                />

                            </div>

                            {/* Featured Image */}
                            <div>
                                <label htmlFor="featuredImage" className="block text-sm font-medium text-gray-700 mb-1">
                                    Featured Image URL <span className="text-red-500">*</span>
                                </label>
                                <input
                                    name="featuredImage"
                                    type="url"
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300`
                                    }
                                    placeholder="https://example.com/image.jpg"
                                />

                            </div>

                            {/* Author & Category */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
                                        Author <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        name="authorName"

                                        onChange={handleChange}
                                        type="text"
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300`
                                        }
                                        placeholder="Author name"
                                    />

                                </div>

                                <div>
                                    <label htmlFor="publishDate" className="block text-sm font-medium text-gray-700 mb-1">
                                        Publish Date
                                    </label>
                                    <input
                                        onChange={handleChange}
                                        name="publishDate"
                                        type="date"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                            </div>


                            {/* Tags */}
                            <div>
                                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                                    Tags
                                </label>
                                <input
                                    name="tags"
                                    type="text"
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="real estate, tips, home buying"
                                />
                                <p className="mt-1 text-xs text-gray-500">Separate tags with commas</p>
                            </div>
                        </div>

                        {/* Right Column - Content */}
                        <div>
                            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                                Content <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="content"
                                rows={15}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300`
                                }
                                placeholder="Write your blog content here..."
                            />

                        </div>
                    </div>

                    {/* Footer */}
                    <div className="sticky bottom-0 bg-white pt-4 border-t border-gray-200 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => handleFormSubmit()}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                          Create Post
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
import { motion, spring } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface BlogCardProps {
    date: string;
    blogId: string
    title: string;
    description: string;
    imageUrl: string;
    tagText?: string;
}

const BlogCard = ({
    date,
    blogId,
    title,
    imageUrl,
}: BlogCardProps) => {

    const navigate = useNavigate()

    const handleNavigation = () => {
        navigate(`/blog/${blogId}`)
    }

    return (
        <motion.div
            className={`relative rounded-xl cursor-pointer  shadow-2xl hover:shadow-2xl overflow-hidden transition-all duration-300 h-[400px]
                } group`}
            whileHover={{ scale: 1.02 }}
            onClick={handleNavigation}
            transition={{ type: spring, stiffness: 300 }}
        >
            <img
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                src={imageUrl}
                alt={title}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-blue-800/30 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <span className="text-sm text-white font-ManropeRegular"> {new Date(date).toISOString().split('T')[0]}</span>
                <h3 className="font-ManropeSemiBold text-xl mt-2 group-hover:text-blue-300 transition-colors duration-300">
                    {title}
                </h3>

                <button className="mt-4 text-sm text-white font-ManropeRegular hover:text-blue-300 transition-colors duration-300 flex items-center">
                    Read More
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 ml-1 transition-transform group-hover:translate-x-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                    </svg>
                </button>
            </div>


        </motion.div>
    );
};

export default BlogCard;
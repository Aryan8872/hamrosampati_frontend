
const LoadingFallback = () => {
    return (
        <div className="flex justify-center items-center h-full min-h-screen">
            <span className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#2563eb]">
            </span>
        </div>
    )
}

export default LoadingFallback

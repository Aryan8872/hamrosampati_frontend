import { useState } from "react";

export default function ImageWithLoader({ src, alt, className }: { src: string, alt: string, className?: string }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  return (
    <div className="relative w-full h-48 flex items-center justify-center bg-gray-100">
      {loading && !error && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <span className="inline-block animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 border-b-4 border-gray-200"></span>
        </div>
      )}
      <img
        src={error ? "/assets/placeholder/house_placeholder.png" : src}
        alt={alt}
        className={`${className} transition-opacity duration-500 ${loading ? 'opacity-0' : 'opacity-100'}`}
        loading="lazy"
        onLoad={() => setLoading(false)}
        onError={() => { setError(true); setLoading(false); }}
      />
    </div>
  );
}
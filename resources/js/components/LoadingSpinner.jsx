const LoadingSpinner = ({ className = '' }) => (
    <div className={`flex justify-center py-12 ${className}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-kids-purple border-t-transparent"></div>
    </div>
);

export default LoadingSpinner;

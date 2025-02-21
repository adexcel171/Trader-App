import "./loader.css";

const Loader = () => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
      <div className="text-center space-y-4">
        {/* Optimized spinner */}
        <div className="loader-spinner"></div>

        {/* Animated text with subtle fade */}
        <p className="text-gray-600 font-medium animate-pulse">
          Loading
          <span className="ml-2 text-xs text-gray-400">(Please wait)</span>
        </p>

        {/* Progress indicator */}
        <div className="h-1 w-36 mx-auto bg-gray-300 rounded-full overflow-hidden">
          <div className="loader-progress"></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;

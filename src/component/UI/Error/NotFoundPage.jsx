// src/components/NotFound.jsx
import { Link } from 'react-router-dom';
import { FaHome, FaSearch } from 'react-icons/fa';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
      <div className="max-w-md mx-auto">
        {/* Error Icon/Image */}
        <div className="text-8xl font-bold text-indigo-600 mb-6">404</div>
        
        {/* Error Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h1>
        <p className="text-lg text-gray-600 mb-8">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <FaHome /> Go Home
          </Link>
          <Link
            to="/products"
            className="flex items-center justify-center gap-2 px-6 py-3 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
          >
            <FaSearch /> Browse Products
          </Link>
        </div>

        {/* Optional: Search Bar */}
        <div className="mt-10">
          <p className="text-gray-500 mb-2">Or try searching:</p>
          <div className="relative max-w-xs mx-auto">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-4 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button className="absolute right-2 top-2 text-gray-500 hover:text-indigo-600">
              <FaSearch />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
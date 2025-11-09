import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiShoppingCart,
  FiChevronRight,
  FiStar,
} from "react-icons/fi";
import useCustomCart from "../../UI/ReUsable/payments/useCustomCart";
import PaginatedItems from "../../pagination/Pagination";
import useProductsAuth from "../../customHook/getProductsData";

const ProductsPage = () => {
  const { updateCart } = useCustomCart();
  const navigate = useNavigate();

  // from your custom hook
  const { products, category, getProducts, getCategory } = useProductsAuth();

  // State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOption, setSortOption] = useState("featured");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        await Promise.all([getProducts(), getCategory()]);
        setError("");
      } catch (err) {
        setError(err?.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Filter + sort
  const filteredProducts = useMemo(() => {
    const safeProducts = Array.isArray(products) ? products : [];
    let result = [...safeProducts];

    // search
    if (searchTerm) {
      result = result.filter(
        (product) =>
          product?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product?.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // category filter (important: compare as strings)
    if (selectedCategory !== "all") {
      result = result.filter(
        (product) => String(product?.category) === String(selectedCategory)
      );
    }

    // sorting
    switch (sortOption) {
      case "price-low":
        result.sort((a, b) => (a?.price || 0) - (b?.price || 0));
        break;
      case "price-high":
        result.sort((a, b) => (b?.price || 0) - (a?.price || 0));
        break;
      case "rating":
        result.sort((a, b) => (b?.rating || 0) - (a?.rating || 0));
        break;
      case "name":
        result.sort((a, b) => (a?.title || "").localeCompare(b?.title || ""));
        break;
      default:
        break;
    }

    return result;
  }, [products, searchTerm, selectedCategory, sortOption]);

  // pagination
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const totalProducts = filteredProducts.length;

  // build category options from API
  const categoryOptions = useMemo(() => {
    // API gives: [{id, title, ...}]
    const base = Array.isArray(category) ? category : [];
    return [{ id: "all", title: "All Categories" }, ...base];
  }, [category]);

  // handlers
  const handleAddToCart = (product, e) => {
    e?.stopPropagation();
    if (product) {
      updateCart(product, 1);
    }
  };

  const handleViewDetails = (productId, e) => {
    e?.stopPropagation();
    if (productId) {
      navigate(`/products/${productId}`);
    }
  };

  const handleProductClick = (productId) => {
    if (productId) {
      navigate(`/products/${productId}`);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // UI
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Our Products
          </h1>
          <p className="text-gray-600 text-lg">
            Discover {totalProducts} amazing products at great prices
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
            {/* search */}
            <div className="relative flex-1 max-w-md">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>

            {/* selects */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* category select */}
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all min-w-[180px]"
              >
                {categoryOptions.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.title}
                  </option>
                ))}
              </select>

              {/* sort select */}
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all min-w-[180px]"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="name">Name A-Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* info */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <p className="text-gray-600 text-sm">
            Showing {paginatedProducts.length} of {filteredProducts.length}{" "}
            products
            {searchTerm && ` for "${searchTerm}"`}
            {selectedCategory !== "all" &&
              ` in ${
                categoryOptions.find(
                  (c) => String(c.id) === String(selectedCategory)
                )?.title || "Selected Category"
              }`}
          </p>

          {totalPages > 1 && (
            <p className="text-gray-500 text-sm">
              Page {currentPage} of {totalPages}
            </p>
          )}
        </div>

        {/* grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          <AnimatePresence>
            {paginatedProducts.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                <p className="text-gray-500 text-lg">
                  {products.length === 0
                    ? "No products available"
                    : "No products found matching your criteria"}
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  {products.length === 0
                    ? "Please check back later"
                    : "Try adjusting your search or filters"}
                </p>
              </div>
            ) : (
              paginatedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  categories={category} // 👈 pass categories here
                  onAddToCart={handleAddToCart}
                  onViewDetails={handleViewDetails}
                  onProductClick={handleProductClick}
                />
              ))
            )}
          </AnimatePresence>
        </div>

        {/* pagination */}
        {filteredProducts.length > itemsPerPage && (
          <div className="mt-10">
            <PaginatedItems
              itemsPerPage={itemsPerPage}
              pageCounter={currentPage}
              totalItems={filteredProducts.length}
              setPageCounter={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// Product Card
const ProductCard = ({
  product,
  categories,
  onAddToCart,
  onViewDetails,
  onProductClick,
}) => {
  if (!product) return null;

  // match category
  const matchedCategory = Array.isArray(categories)
    ? categories.find((item) => String(item.id) === String(product.category))
    : null;

  const discountedPrice =
    product.discount > 0
      ? product.price - (product.price * product.discount) / 100
      : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden hover:border-purple-200"
    >
      {/* image */}
      <div
        className="relative h-48 bg-gray-100 flex items-center justify-center p-4 cursor-pointer overflow-hidden"
        onClick={() => onProductClick(product.id)}
      >
        {product.images?.[0] ? (
          <motion.img
            src={product.images[0]}
            alt={product.title || "Product image"}
            className="max-h-full max-w-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="text-gray-400 text-center">
            <div className="w-16 h-16 mx-auto bg-gray-200 rounded-full flex items-center justify-center mb-2">
              <span className="text-2xl">📷</span>
            </div>
            <span className="text-sm">No image available</span>
          </div>
        )}

        {product.discount > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            -{product.discount}%
          </div>
        )}
      </div>

      {/* content */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-md capitalize">
            {matchedCategory ? matchedCategory.title : "Un categorized"}
          </span>
          <div className="flex items-center">
            <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600 ml-1">
              {product.rating || "N/A"}
            </span>
          </div>
        </div>

        <h3
          className="font-semibold text-gray-900 mb-2 line-clamp-2 cursor-pointer hover:text-purple-600 transition-colors leading-tight"
          onClick={() => onProductClick(product.id)}
        >
          {product.title || "Untitled Product"}
        </h3>

        <p className="text-gray-600 text-sm line-clamp-2 mb-4 leading-relaxed">
          {product.description || "No description available"}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              {discountedPrice ? (
                <>
                  <span className="text-xl font-bold text-purple-600">
                    ${discountedPrice.toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    ${product.price}
                  </span>
                </>
              ) : (
                <span className="text-xl font-bold text-purple-600">
                  ${product.price || "0.00"}
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => onAddToCart(product, e)}
              className="p-2 rounded-lg bg-gray-100 hover:bg-purple-600 hover:text-white text-gray-700 transition-all duration-200"
              aria-label="Add to cart"
            >
              <FiShoppingCart className="w-5 h-5" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => onViewDetails(product.id, e)}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-700 hover:text-white text-gray-700 transition-all duration-200"
              aria-label="View details"
            >
              <FiChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductsPage;

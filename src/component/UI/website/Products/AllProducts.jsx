import React, { useContext, useEffect, useMemo, useRef, useState, useCallback } from "react";
import { ScaleLoader } from "react-spinners";
import { Axios } from "../../../../assets/Auth/Axios";
import { PRODS } from "../../../../assets/Auth/authPaths";
import { FiHeart, FiStar, FiShoppingCart } from "react-icons/fi";
import PaginatedItems from "../../../pagination/Pagination";
import { FaShoppingCart } from "react-icons/fa";
import { motion } from "framer-motion";
import { CartContext } from "../../Modal/cart/cart_context/CartContextPage";

const AllProducts = ({ setIsShowCart }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState("featured");
  const [searchTerm, setSearchTerm] = useState("");
  const [pageCounter, setPageCounter] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(4);

  const cartRef = useRef();
  
  // Get cart context
  const cartContext = useContext(CartContext);
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await Axios.get(PRODS);
        setProducts(data);
      } catch (err) {
        setError("Failed to load products. Please try again later.");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products
      .filter(
        (product) =>
          product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        switch (sortOption) {
          case "price-asc":
            return parseFloat(a.price) - parseFloat(b.price);
          case "price-desc":
            return parseFloat(b.price) - parseFloat(a.price);
          case "rating":
            return (b.rating || 0) - (a.rating || 0);
          default:
            return 0;
        }
      });
  }, [products, searchTerm, sortOption]);

  const paginationData = useMemo(() => {
    const startIndex = (pageCounter - 1) * itemsPerPage;
    const lastIndex = startIndex + itemsPerPage;
    return filteredProducts.slice(startIndex, lastIndex);
  }, [filteredProducts, pageCounter, itemsPerPage]);

  // Stabilize cart items reference
  const cartItems = cartContext?.items || [];
  
  // Calculate cart item count from context
  const cartItemCount = useMemo(() => {
    return cartItems.reduce((total, item) => total + (item.quantity || 0), 0);
  }, [cartItems]);

  // Calculate total amount from context
  const totalAmount = useMemo(() => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.price) || 0;
      const quantity = item.quantity || 0;
      return total + (price * quantity);
    }, 0);
  }, [cartItems]);

  // Get product quantity from cart
  const getProductQuantity = useCallback((productId) => {
    if (!cartItems.length) return 0;
    const cartItem = cartItems.find(item => item.id === productId);
    return cartItem?.quantity || 0;
  }, [cartItems]);

  // Handle opening cart
  const handleOpenCart = () => {
    console.log("Opening cart");
    setIsShowCart(true);
  };

  // Handle adding product to cart
  const updatingCart = (product) => {
    if (!cartContext) {
      console.error("Cart context is not available");
      return;
    }

    try {
      // Create cart item
      const cartItem = {
        id: product.id,
        title: product.title,
        price: parseFloat(product.price) || 0,
        image: product.images?.[0]?.image || product.images?.[0] || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect width='400' height='400' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='24' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E",
        quantity: 1,
        description: product.description
      };

      // Check if item already exists in cart
      const existingItemIndex = cartContext.items.findIndex(item => item.id === product.id);
      
      if (existingItemIndex >= 0) {
        // Update existing item quantity
        const updatedItems = [...cartContext.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: (updatedItems[existingItemIndex].quantity || 0) + 1
        };
        cartContext.setItems(updatedItems);
      } else {
        // Add new item to cart
        cartContext.setItems(prevItems => [...prevItems, cartItem]);
      }

      console.log("Product added to cart:", product.title);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  if (loading) {
    return (
      <div className="mt-2 flex flex-col items-center justify-center min-h-screen py-20">
        <ScaleLoader color="#2563eb" />
        <p className="mt-4 text-blue-600 font-medium">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center">
        <div className="bg-red-50 p-6 rounded-xl">
          <h3 className="text-xl font-semibold text-red-600 mb-2">
            Error Loading Products
          </h3>
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Discover Our Collection
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            High-quality products designed to meet your needs
          </p>
        </div>
      </header>

      {/* Toolbar with search and sort */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-gray-600">Sort by:</span>
            <select
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Show:</span>
            <select
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
            >
              <option value="4">4</option>
              <option value="8">8</option>
              <option value="10">10</option>
              <option value="12">12</option>
            </select>
          </div>
          
          <div
            className="relative flex flex-col items-center justify-center"
            ref={cartRef}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleOpenCart}
              className="p-2 rounded-full relative bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
              aria-label="Cart"
            >
              <FaShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
                >
                  {cartItemCount}
                </motion.span>
              )}
            </motion.button>
            <p className="text-xs text-gray-600 mt-1">${totalAmount.toFixed(2)}</p>
          </div>
        </div>

        {/* Products Grid */}
        {paginationData.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginationData.map((product) => {
              const productQuantity = getProductQuantity(product.id);
              
              return (
                <div
                  key={product.id}
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col"
                >
                  {/* Product Image */}
                  <div className="relative pt-[100%] overflow-hidden bg-gray-200">
                    <img
                      src={product.images?.[0]?.image || product.images?.[0] || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect width='400' height='400' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='24' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E"}
                      alt={product.title}
                      className="absolute top-0 left-0 w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.onerror = null; // Prevent infinite loop
                        e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect width='400' height='400' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='24' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E";
                      }}
                    />
                    <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors">
                      <FiHeart className="text-gray-600 hover:text-red-500" />
                    </button>
                    {product.isNew && (
                      <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                        NEW
                      </span>
                    )}
                  </div>
                  
                  {/* Product Info */}
                  <div className="p-4 flex-grow flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg line-clamp-2">
                        {product.title}
                      </h3>
                      {product.rating && (
                        <div className="flex items-center bg-blue-50 px-2 py-1 rounded">
                          <FiStar className="text-yellow-400 mr-1" />
                          <span className="text-sm font-medium">
                            {product.rating}
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {product.description}
                    </p>

                    <div className="mt-auto">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <span className="font-bold text-lg text-gray-900">
                            ${parseFloat(product.price || 0).toFixed(2)}
                          </span>
                          {product.originalPrice && (
                            <span className="ml-2 text-sm text-gray-400 line-through">
                              ${parseFloat(product.originalPrice).toFixed(2)}
                            </span>
                          )}
                        </div>
                        {product.discount && (
                          <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded">
                            -{product.discount}%
                          </span>
                        )}
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => updatingCart(product)}
                        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                      >
                        <FiShoppingCart />
                        Add to Cart
                        {productQuantity > 0 && (
                          <span className="bg-blue-800 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center ml-1">
                            {productQuantity}
                          </span>
                        )}
                      </motion.button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-xl font-medium text-gray-600 mb-2">
              No products found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
          )}
      </div>
      
      <div className="mt-10">
        <PaginatedItems
          itemsPerPage={itemsPerPage}
          pageCounter={pageCounter}
          totalItems={filteredProducts.length}
          setPageCounter={setPageCounter}
        />
      </div>
    </div>
  );
};

export default AllProducts;
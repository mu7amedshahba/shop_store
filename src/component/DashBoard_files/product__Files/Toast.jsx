// import React, { useEffect } from 'react';

// export default function Toast({ type, message, onClose }) {
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       onClose();
//     }, 5000);

//     return () => clearTimeout(timer);
//   }, [onClose]);

//   const bgColor = {
//     success: 'bg-green-500',
//     error: 'bg-red-500',
//     warning: 'bg-yellow-500',
//     info: 'bg-blue-500'
//   }[type];

//   return (
//     <div className={`fixed bottom-4 right-4 ${bgColor} text-white px-4 py-2 rounded shadow-lg`}>
//       <div className="flex items-center justify-between">
//         <span>{message}</span>
//         <button onClick={onClose} className="ml-4">
//           &times;
//         </button>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiShoppingCart,
  FiFilter,
  FiX,
  FiChevronRight,
  FiStar,
  FiBook,
} from "react-icons/fi";
import { Axios } from "../../../assets/Auth/Axios";
import { PRODS } from "../../../assets/Auth/authPaths";
import PaginatedItems from "../../pagination/Pagination";
import booksData from "../../DateBase_files/book_products.json";

//
const ProductsPage = () => {
  // State management
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOption, setSortOption] = useState("featured");
  const [pageCounter, setPageCounter] = useState(1);
  const [itemsPerPage, setItemPerPage] = useState(8);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const navigate = useNavigate();
  const filtersRef = useRef();

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await Axios.get(`${PRODS}`);
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (err) {
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Apply filters
  useEffect(() => {
    let result = [...products];
    // Search filter
    if (searchTerm) {
      result = result.filter(
        (product) =>
          product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      result = result.filter(
        (product) => product.category === selectedCategory
      );
    }

    // Price filter
    result = result.filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Sorting
    switch (sortOption) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    setFilteredProducts(result);
    setPageCounter(1); // Reset to first page when filters change
  }, [products, searchTerm, selectedCategory, priceRange, sortOption]);

  // Paginated data
  const paginateData = useMemo(() => {
    const startIndex = (pageCounter - 1) * itemsPerPage;
    const lastIndex = startIndex + itemsPerPage;
    return filteredProducts.slice(startIndex, lastIndex);
  }, [filteredProducts, pageCounter, itemsPerPage]);

  // Extract unique categories
  const categories = [
    "all",
    ...new Set(products.map((product) => product.category)),
  ];
  // adding new cart
  const addToCart = async (product) => {
    addingCartItem(product);
    try {
      let cartItems = JSON.parse(localStorage.getItem("product")) || [];
      const productExists = cartItems.some((item) => item.id === product.id);
      console.log(productExists);
      if (productExists) {
        setProducts((prev) =>
          prev.map((item) =>
            item.id === product.id
              ? { ...item, count: item.count + 1, quantity: item.quantity + 1 }
              : item
          )
        );
        console.log(`Product "${product.title}" is already in your cart`);
        return;
      }

      const newProduct = {
        ...product,
        count: product.count ? product.count + 1 : 1,
      };

      const updatedCart = [...cartItems, newProduct];
      localStorage.setItem("product", JSON.stringify(updatedCart));
      console.log(`"${product.title}" has been added to your cart`);
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };

  const addingCartItem = async (newItem) => {
    try {
      const ItemsInCart = JSON.parse(localStorage.getItem("product"));
      const existItem = ItemsInCart.some((items) => items.id === newItem.id);

      if (existItem) {
        ItemsInCart.forEach((e) => ({
          ...e,
          count: e.count + 1 || 1,
          quantity: e.quantity || 1,
        }));
      }
      console.log(`new Cart items :=> ` + { ItemsInCart });
    } catch (error) {
      console.log(error);
    }
  };

  // Close mobile filters when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filtersRef.current && !filtersRef.current.contains(event.target)) {
        setMobileFiltersOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-[var(--color-primary-lighter)] min-h-screen py-8">
      <div className="w-full lg:max-w-[80vw] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile Filters Button */}
        <div className="md:hidden mb-6">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-[var(--color-primary-light)]"
          >
            <FiFilter className="text-[var(--color-primary-dark)]" />
            <span className="text-sm font-medium text-[var(--color-primary-dark)]">
              Filters
            </span>
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Mobile Filters Sidebar */}
          <AnimatePresence>
            {mobileFiltersOpen && (
              <motion.div
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                ref={filtersRef}
                className="fixed inset-y-0 left-0 z-50 w-72 bg-white p-6 shadow-xl overflow-y-auto md:hidden"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-[var(--color-primary-dark)]">
                    Filters
                  </h2>
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    <FiX className="h-5 w-5 text-[var(--color-primary-dark)]" />
                  </button>
                </div>

                {/* Search */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-[var(--color-primary-dark)] mb-2">
                    Search
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search products..."
                      className="w-full p-3 pl-10 border border-[var(--color-primary-light)] rounded-lg focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <FiSearch className="absolute left-3 top-3.5 h-5 w-5 text-[var(--color-primary)]" />
                  </div>
                </div>

                {/* Category */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-[var(--color-primary-dark)] mb-2">
                    Category
                  </label>
                  <select
                    className="w-full p-3 border border-[var(--color-primary-light)] rounded-lg focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category === "all" ? "All Categories" : category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-[var(--color-primary-dark)] mb-2">
                    Price Range: ${priceRange[0]} - ${priceRange[1]}
                  </label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      step="10"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], parseInt(e.target.value)])
                      }
                      className="w-full h-2 bg-[var(--color-primary-light)] rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-sm text-[var(--color-primary)]">
                      <span>$0</span>
                      <span>$1000</span>
                    </div>
                  </div>
                </div>

                {/* Sort */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-[var(--color-primary-dark)] mb-2">
                    Sort By
                  </label>
                  <select
                    className="w-full p-3 border border-[var(--color-primary-light)] rounded-lg focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                </div>

                {/* Items Per Page */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-[var(--color-primary-dark)] mb-2">
                    Items Per Page
                  </label>
                  <select
                    className="w-full p-3 border border-[var(--color-primary-light)] rounded-lg focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
                    value={itemsPerPage}
                    onChange={(e) => setItemPerPage(Number(e.target.value))}
                  >
                    <option value="4">4</option>
                    <option value="8">8</option>
                    <option value="12">12</option>
                    <option value="16">16</option>
                  </select>
                </div>

                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="w-full py-3 bg-[var(--color-accent)] text-white rounded-lg font-medium"
                >
                  Apply Filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Desktop Filters Sidebar */}
          <div className="hidden md:block lg:w-72 w-60  flex-shrink-0">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-[var(--color-primary-light)] sticky top-4">
              <h2 className="text-xl font-bold text-[var(--color-primary-dark)] mb-6">
                Refine Your Search
              </h2>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-[var(--color-primary-dark)] mb-2">
                  Search
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Title, author, keywords..."
                    className="w-full p-3 pl-10 border border-[var(--color-primary-light)] rounded-lg focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <FiSearch className="absolute left-3 top-3.5 h-5 w-5 text-[var(--color-primary)]" />
                </div>
              </div>

              {/* Category */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-[var(--color-primary-dark)] mb-2">
                  Category
                </label>
                <select
                  className="w-full p-3 border border-[var(--color-primary-light)] rounded-lg focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-[var(--color-primary-dark)] mb-2">
                  Price Range: ${priceRange[0]} - ${priceRange[1]}
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    step="10"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], parseInt(e.target.value)])
                    }
                    className="w-full h-2 bg-[var(--color-primary-light)] rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-[var(--color-primary)]">
                    <span>$0</span>
                    <span>$1000</span>
                  </div>
                </div>
              </div>

              {/* Sort */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-[var(--color-primary-dark)] mb-2">
                  Sort By
                </label>
                <select
                  className="w-full p-3 border border-[var(--color-primary-light)] rounded-lg focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>

              {/* Items Per Page */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-[var(--color-primary-dark)] mb-2">
                  Items Per Page
                </label>
                <select
                  className="w-full p-3 border border-[var(--color-primary-light)] rounded-lg focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
                  value={itemsPerPage}
                  onChange={(e) => setItemPerPage(Number(e.target.value))}
                >
                  <option value="4">4</option>
                  <option value="8">8</option>
                  <option value="12">12</option>
                  <option value="16">16</option>
                </select>
              </div>

              {/* Results Count */}
              <div className="text-sm text-[var(--color-primary)]">
                Showing {Math.min(paginateData.length, itemsPerPage)} of{" "}
                {filteredProducts.length} results
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-accent)]"></div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded"
              >
                <p>{error}</p>
              </motion.div>
            )}

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence>
                {paginateData.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-[var(--color-primary-light)] overflow-hidden"
                  >
                    {/* Product Image */}
                    <div
                      className="relative h-60 bg-[var(--color-primary-lightest)] flex items-center justify-center p-4 cursor-pointer"
                      onClick={() => navigate(`/products/${product.id}`)}
                    >
                      {product.images?.[0] ? (
                        <motion.img
                          src={product.images[0].image}
                          alt={product.title}
                          className="max-h-full max-w-full object-contain"
                          loading="lazy"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.3 }}
                        />
                      ) : (
                        <div className="text-[var(--color-primary)] text-center">
                          <div className="w-16 h-16 mx-auto bg-[var(--color-primary-light)] rounded-full flex items-center justify-center">
                            <FiBook className="h-8 w-8 text-[var(--color-primary)]" />
                          </div>
                          <span className="text-sm mt-2 block">
                            No image available
                          </span>
                        </div>
                      )}

                      {/* Discount Badge */}
                      {product.discount && (
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className="absolute top-3 right-3 bg-[var(--color-accent)] text-white text-xs font-bold px-3 py-1 rounded-full"
                        >
                          {product.discount}% OFF
                        </motion.div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-2">
                        {/* Category */}
                        <span className="text-xs font-medium px-2 py-1 rounded bg-[var(--color-accent-lightest)] text-[var(--color-accent-dark)]">
                          {product.category}
                        </span>

                        {/* Rating */}
                        <div className="flex items-center">
                          <FiStar className="w-4 h-4 text-[var(--color-accent)] fill-current" />
                          <span className="text-sm text-[var(--color-primary)] ml-1">
                            {product.rating || "N/A"}
                          </span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3
                        className="font-bold text-[var(--color-primary-dark)] mb-2 line-clamp-2 cursor-pointer"
                        onClick={() => navigate(`/products/${product.id}`)}
                      >
                        {product.title}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-[var(--color-primary)] line-clamp-2 mb-4">
                        {product.description}
                      </p>

                      {/* Price and Actions */}
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-lg font-bold text-[var(--color-primary-dark)]">
                            ${product.price}
                          </span>
                          {product.discount && (
                            <span className="text-sm text-[var(--color-primary)] line-through ml-2">
                              $
                              {Math.round(
                                Number(product.price) /
                                  (1 - Number(product.discount) / 100)
                              ).toFixed(2)}
                            </span>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(product);
                            }}
                            className="p-2 rounded-full hover:bg-[var(--color-primary-light)] transition-colors"
                            aria-label="Add to cart"
                          >
                            <FiShoppingCart className="h-5 w-5 text-[var(--color-primary-dark)]" />
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/products/${product.id}`);
                            }}
                            className="p-2 rounded-full hover:bg-[var(--color-primary-light)] transition-colors"
                            aria-label="View details"
                          >
                            <FiChevronRight className="h-5 w-5 text-[var(--color-primary-dark)]" />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Empty State */}
            {!loading && filteredProducts.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="mx-auto h-24 w-24 bg-[var(--color-primary-light)] rounded-full flex items-center justify-center mb-4">
                  <FiBook className="h-12 w-12 text-[var(--color-primary)]" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-[var(--color-primary-dark)]">
                  No products found
                </h3>
                <p className="mt-2 text-sm text-[var(--color-primary)]">
                  Try adjusting your search or filter criteria
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                    setPriceRange([0, 1000]);
                  }}
                  className="mt-4 px-4 py-2 bg-[var(--color-accent)] text-white rounded-lg hover:bg-[var(--color-accent-dark)] transition-colors"
                >
                  Reset Filters
                </motion.button>
              </motion.div>
            )}

            {/* Pagination */}
            {filteredProducts.length > 0 && (
              <div className="mt-10">
                <PaginatedItems
                  itemsPerPage={itemsPerPage}
                  pageCounter={pageCounter}
                  totalItems={filteredProducts.length}
                  setPageCounter={setPageCounter}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;

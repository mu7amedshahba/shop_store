import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Axios } from "../../../assets/Auth/Axios";
import { Prod } from "../../../assets/Auth/authPaths";
import SpinnerLoad from "../../UI/ReUsable/SpinnerLoad/SpinnerLoad";
import {
  FiStar,
  FiTruck,
  FiRefreshCw,
  FiCheckCircle,
  FiShield,
  FiShoppingCart,
  FiCreditCard,
  FiTrash2,
} from "react-icons/fi";
import CartPage from "../../UI/ReUsable/payments/CartPage";

const SingleProduct = ({ count, setCount }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]); // always strings
  const [mainImage, setMainImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const [stock, setStock] = useState(10);
  const [selectedSize, setSelectedSize] = useState(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await Axios.get(`${Prod}/${id}`);
        console.log(res)
        const productData = res.data;
        console.log(productData);
        if (!productData) {
          setProduct(null);
          return;
        }

        const normalizedImages = (productData.images || []).map((img) =>
          typeof img === "string" ? img : img?.image
        );

        setProduct(productData);
        setMainImage(normalizedImages[0] || "/placeholder-product.jpg");
        setSelectedColor(productData.colors?.[0] || null);
        setSelectedSize(productData.sizes?.[0] || null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const toggleCart = () => {
    setShowCart((p) => !p);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <SpinnerLoad size="xl" />
      </div>
    );

  if (error)
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto p-8 text-center"
      >
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
          <p>Error loading product: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </motion.div>
    );

  if (!product)
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto p-8 text-center"
      >
        <h2 className="text-2xl font-bold text-[var(--color-primary-dark)]">
          Product Not Found
        </h2>
        <p className="mt-2 text-[var(--color-primary)]">
          The requested product could not be found.
        </p>
      </motion.div>
    );

  const ratingValue = parseFloat(product.rating) || 0;
  const ratingsCount = parseInt(product.ratings_number) || 0;
  const discountPrice = product.discount
    ? (
        parseFloat(product.price) *
        (1 - parseFloat(product.discount) / 100)
      ).toFixed(2)
    : null;

  const features = [
    {
      name: "Free shipping",
      icon: FiTruck,
      description: "Get free delivery on all orders over $50",
    },
    {
      name: "30-day returns",
      icon: FiRefreshCw,
      description: "Not happy? Return within 30 days",
    },
    {
      name: "Verified quality",
      icon: FiCheckCircle,
      description: "Quality checked before shipping",
    },
    {
      name: "2-year warranty",
      icon: FiShield,
      description: "Manufacturer warranty included",
    },
  ];

  const handleAddItem = async () => {
    try {
      setIsAddingToCart(true);
      setError(null);

      const cartItems = JSON.parse(localStorage.getItem("product")) || [];

      // quantity selected by user
      const desiredQty = quantity || 1;
      if (desiredQty > stock) {
        setError(`Cannot add ${desiredQty} items (only ${stock} available)`);
        return;
      }

      const existingIndex = cartItems.findIndex((item) => item.id == id);

      if (existingIndex !== -1) {
        // update existing item qty
        const currentQty = cartItems[existingIndex].count || 1;
        const newQty = Math.min(currentQty + desiredQty, stock);
        cartItems[existingIndex] = {
          ...cartItems[existingIndex],
          count: newQty,
        };
        setCount(newQty); // notify parent with this product new qty
      } else {
        // add new item
        const newQty = Math.min(desiredQty, stock);
        cartItems.push({
          ...product,
          count: newQty,
        });
        setCount(newQty);
      }

      localStorage.setItem("product", JSON.stringify(cartItems));
    } catch (err) {
      console.error("Cart error:", err);
      setError("Failed to update cart. Please try again.");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleReset = () => {
    setCount(1);
    setQuantity(1);
    localStorage.removeItem("product");
  };

  return (
    <div className="bg-[var(--color-primary-lightest)] min-h-screen py-12">
      <AnimatePresence>
        {showCart && (
          <CartPage
            setShowCart={setShowCart}
            setCount={setCount}
            count={count}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            {/* images */}
            <div className="space-y-6">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative rounded-xl overflow-hidden bg-[var(--color-primary-lightest)] aspect-square flex items-center justify-center border border-[var(--color-primary-light)]"
              >
                <motion.img
                  src={mainImage}
                  alt={product.title || "Product image"}
                  className="w-full h-full object-contain transition-opacity duration-300 p-8"
                  loading="eager"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                />
                {product.discount && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-4 left-4 bg-[var(--color-accent)] text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg"
                  >
                    {product.discount}% OFF
                  </motion.div>
                )}
              </motion.div>

              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {images.map((img, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setMainImage(img)}
                      className={`relative rounded-lg overflow-hidden border-2 transition-all duration-200 aspect-square ${
                        mainImage === img
                          ? "border-[var(--color-accent)] ring-2 ring-[var(--color-accent-light)]"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.title || "Product"} thumbnail ${index}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </motion.button>
                  ))}
                </div>
              )}
            </div>

            {/* info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-[var(--color-primary-dark)]">
                  {product.title}
                </h1>
                <div className="mt-2 flex items-center">
                  <div className="flex items-center">
                    {[0, 1, 2, 3, 4].map((rating) => (
                      <FiStar
                        key={rating}
                        className={`h-5 w-5 flex-shrink-0 ${
                          rating < ratingValue
                            ? "text-[var(--color-accent)] fill-current"
                            : "text-gray-300 fill-current"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="ml-2 text-sm text-[var(--color-primary)]">
                    {ratingsCount} review{ratingsCount !== 1 ? "s" : ""}
                  </p>
                  <span className="mx-2 text-gray-300">|</span>
                  <span className="text-sm text-green-600">In Stock</span>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center">
                  {discountPrice ? (
                    <>
                      <p className="text-3xl font-bold text-[var(--color-primary-dark)]">
                        ${discountPrice}
                      </p>
                      <p className="ml-3 text-lg text-gray-500 line-through">
                        ${product.price}
                      </p>
                      <span className="ml-3 inline-flex items-center rounded-md bg-[var(--color-accent-light)] px-2 py-0.5 text-sm font-medium text-[var(--color-accent-dark)]">
                        Save {product.discount}%
                      </span>
                    </>
                  ) : (
                    <p className="text-3xl font-bold text-[var(--color-primary-dark)]">
                      ${product.price}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <h2 className="text-lg font-medium text-[var(--color-primary-dark)]">
                  Description
                </h2>
                <p className="mt-2 text-[var(--color-primary)]">
                  {product.description}
                </p>
              </div>

              {product.colors?.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-[var(--color-primary-dark)]">
                    Color
                  </h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <motion.button
                        key={color}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setSelectedColor(color)}
                        className={`rounded-full w-8 h-8 flex items-center justify-center transition-all ${
                          selectedColor === color
                            ? "ring-2 ring-offset-2 ring-[var(--color-accent)]"
                            : ""
                        }`}
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              )}

              {product.sizes?.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-[var(--color-primary-dark)]">
                    Size
                  </h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <motion.button
                        key={size}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
                          selectedSize === size
                            ? "bg-[var(--color-accent)] text-white border-transparent"
                            : "bg-white text-[var(--color-primary-dark)] border-[var(--color-primary-light)] hover:bg-[var(--color-primary-lightest)]"
                        }`}
                      >
                        {size}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6">
                <label
                  htmlFor="quantity"
                  className="block text-sm font-medium text-[var(--color-primary-dark)]"
                >
                  Quantity
                </label>
                <select
                  id="quantity"
                  name="quantity"
                  value={quantity}
                  onChange={(e) => {
                    const v = parseInt(e.target.value);
                    setQuantity(v);
                    setCount(v); 
                  }}
                  className="mt-1 block w-24 rounded-md border border-[var(--color-primary-light)] py-2 pl-3 pr-8 text-base focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] sm:text-sm"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-[var(--color-primary-dark)]">
                  Items in Cart
                </label>
                <div className="mt-1 p-2 bg-[var(--color-primary-lightest)] rounded-md inline-block px-4">
                  <span className="font-medium text-[var(--color-primary-dark)]">
                    {count}
                  </span>
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddItem}
                  disabled={isAddingToCart}
                  className={`flex-1 flex items-center justify-center gap-2 border border-transparent rounded-md py-3 px-8 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-accent)] transition-all ${
                    isAddingToCart
                      ? "bg-[var(--color-accent-dark)] cursor-not-allowed"
                      : "bg-[var(--color-accent)] hover:bg-[var(--color-accent-dark)]"
                  }`}
                >
                  {isAddingToCart ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Adding...
                    </>
                  ) : (
                    <>
                      <FiShoppingCart className="h-5 w-5" />
                      Add to cart
                    </>
                  )}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={toggleCart}
                  className="flex-1 flex items-center justify-center gap-2 bg-white border border-[var(--color-primary-light)] rounded-md py-3 px-8 text-base font-medium text-[var(--color-primary-dark)] hover:bg-[var(--color-primary-lightest)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all"
                >
                  <FiCreditCard className="h-5 w-5" />
                  Buy now
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleReset}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-500 border border-transparent rounded-md py-3 px-8 text-base font-medium text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all"
                >
                  <FiTrash2 className="h-5 w-5" />
                  Clear Cart
                </motion.button>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 bg-red-100 text-red-700 p-3 rounded-md shadow-sm"
                >
                  <p className="text-sm">{error}</p>
                </motion.div>
              )}

              <div className="mt-8 border-t border-[var(--color-primary-light)] pt-8">
                <h2 className="text-lg font-medium text-[var(--color-primary-dark)]">
                  Features
                </h2>
                <div className="mt-4 grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6">
                  {features.map((feature) => (
                    <motion.div
                      key={feature.name}
                      whileHover={{ x: 5 }}
                      className="flex items-start"
                    >
                      <div className="flex-shrink-0">
                        <feature.icon
                          className="h-6 w-6 text-[var(--color-accent)]"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-[var(--color-primary-dark)]">
                          {feature.name}
                        </p>
                        <p className="text-sm text-[var(--color-primary)]">
                          {feature.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SingleProduct;

// src/components/products/SingleProduct.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiStar,
  FiTruck,
  FiRefreshCw,
  FiCheckCircle,
  FiShield,
  FiShoppingCart,
  FiCreditCard,
  FiTrash2,
  FiBook,
  FiGlobe,
  FiFileText,
} from "react-icons/fi";
import SpinnerLoad from "../../UI/ReUsable/SpinnerLoad/SpinnerLoad";
import CartPage from "../../UI/ReUsable/payments/CartPage";
import useProductsAuth from "../../customHook/getProductsData";

const SingleProduct = ({ count, setCount }) => {
  const { id } = useParams();
  const {
    singleProduct,
    error: hookError,
    loading: hookLoading,
    getSingleProduct,
    clearError,
  } = useProductsAuth();

  // local UI state
  const [localError, setLocalError] = useState(null);
  const [images, setImages] = useState([]);
  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [showCart, setShowCart] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // fetch product when id changes
  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        await getSingleProduct(id);
      }
    };
    fetchData();
  }, [id, getSingleProduct]);

  // prepare images when product arrives
  useEffect(() => {
    if (!singleProduct) return;
    const normalizedImages = singleProduct?.images?.filter(Boolean) || [];
    setImages(normalizedImages);
    setMainImage(normalizedImages[0].image || "/placeholder-product.jpg");
  }, [singleProduct]);

  // Clear errors when component unmounts or ID changes
  useEffect(() => {
    return () => {
      clearError();
      setLocalError(null);
    };
  }, [id, clearError]);

  const toggleCart = () => setShowCart((prev) => !prev);

  // Retry fetching product
  const retryFetch = () => {
    clearError();
    setLocalError(null);
    if (id) {
      getSingleProduct(id);
    }
  };

  // --------------- loading ---------------
  if (hookLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 py-20">
        <SpinnerLoad size="xl" />
        <p className="mt-4 text-blue-600 font-medium">
          Loading product details...
        </p>
      </div>
    );
  }

  // --------------- error ---------------
  const errorToShow = hookError || localError;
  if (errorToShow && !singleProduct) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-3xl mx-auto p-8 text-center"
      >
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-6 rounded-lg">
          <FiAlertCircle className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
          <h3 className="text-xl font-semibold mb-2">Product Loading Issue</h3>
          <p className="mb-4">{errorToShow}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={retryFetch}
              className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Try API Again
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
            >
              Reload Page
            </button>
          </div>
        </div>
      </motion.div>
    );
  }
  // --------------- no product ---------------
  if (!singleProduct) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-3xl mx-auto p-8 text-center"
      >
        <h2 className="text-2xl font-bold text-slate-900">Product not found</h2>
        <p className="mt-2 text-slate-500">
          The product you're looking for doesn't exist or was removed.
        </p>
      </motion.div>
    );
  }

  // --------------- main view ---------------
  const product = singleProduct;
  const ratingValue = parseFloat(product.rating) || 0;
  const ratingsCount = product.ratings_number || "0";
  const discountPrice = product.discount
    ? (
        parseFloat(product.price) *
        (1 - parseFloat(product.discount) / 100)
      ).toFixed(2)
    : null;

  // Calculate stock based on product type (ebooks typically have unlimited stock)
  const stock = product.status === "classic" ? 999 : 100;

  const featureList = [
    {
      name: "Instant Download",
      icon: FiFileText,
      desc: "Get immediate access after purchase",
    },
    {
      name: "Multiple Formats",
      icon: FiBook,
      desc: `Available in ${product.format || "PDF, EPUB"}`,
    },
    {
      name: "DRM Free",
      icon: FiCheckCircle,
      desc: "Use on any compatible device",
    },
    {
      name: "Free Updates",
      icon: FiRefreshCw,
      desc: "Receive future editions for free",
    },
  ];

  const handleAddItem = async () => {
    try {
      setIsAddingToCart(true);
      setLocalError(null);

      const cartItems = JSON.parse(localStorage.getItem("product")) || [];
      const desiredQty = quantity || 1;

      if (desiredQty > stock) {
        setLocalError(
          `Cannot add ${desiredQty} items (only ${stock} available)`
        );
        return;
      }

      const existingIndex = cartItems.findIndex(
        (item) => item.id === product.id
      );

      if (existingIndex !== -1) {
        const currentQty = cartItems[existingIndex].count || 1;
        const newQty = Math.min(currentQty + desiredQty, stock);
        cartItems[existingIndex] = {
          ...cartItems[existingIndex],
          count: newQty,
        };
        setCount(newQty);
      } else {
        const newQty = Math.min(desiredQty, stock);
        cartItems.push({
          ...product,
          count: newQty,
          type: "ebook", // Add product type
          finalPrice: discountPrice || product.price,
        });
        setCount(newQty);
      }

      localStorage.setItem("product", JSON.stringify(cartItems));

      // Show success feedback
      setTimeout(() => {
        setIsAddingToCart(false);
      }, 1000);
    } catch (err) {
      console.error("Cart error:", err);
      setLocalError("Failed to update cart. Please try again.");
      setIsAddingToCart(false);
    }
  };

  const handleReset = () => {
    setCount(1);
    setQuantity(1);
    localStorage.removeItem("product");
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      {/* floating cart */}
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
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-6xl mx-auto px-4 lg:px-0"
      >
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-10 p-6 lg:p-10">
            {/* LEFT: images */}
            <div className="space-y-6">
              <div className="relative rounded-2xl bg-slate-100 h-80 lg:h-[420px] flex items-center justify-center overflow-hidden border border-slate-200">
                <motion.img
                  key={mainImage}
                  src={mainImage}
                  alt={product.title || "Product image"}
                  className="max-h-full max-w-full object-contain p-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  onError={(e) => {
                    e.target.src =
                      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop";
                  }}
                />
                {product.discount && (
                  <span className="absolute top-4 left-4 bg-emerald-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                    {product.discount}% OFF
                  </span>
                )}
                {product.status && (
                  <span className="absolute top-4 right-4 bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                    {product.status}
                  </span>
                )}
              </div>

              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {images.map((img, idx) => (
                    
                    <button
                      key={idx}
                      onClick={() => setMainImage(img.image)}
                      className={`h-20 rounded-xl overflow-hidden border transition ${
                        mainImage === img.image
                          ? "border-emerald-500 ring-2 ring-emerald-200"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <img
                        src={img.image}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src =
                            "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=100&h=100&fit=crop";
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT: info */}
            <div className="space-y-6">
              {/* title + rating */}
              <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                  {product.title}
                </h1>
                <p className="mt-2 text-lg text-slate-600">
                  by {product.author}
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <FiStar
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(ratingValue)
                            ? "text-amber-400 fill-amber-400"
                            : "text-slate-200"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-slate-500">
                    {ratingValue.toFixed(1)} ({ratingsCount} ratings)
                  </p>
                  <span className="text-slate-300">•</span>
                  <span className="text-sm text-emerald-600 font-medium">
                    In stock
                  </span>
                </div>
              </div>

              {/* price */}
              <div className="flex items-center gap-3">
                {discountPrice ? (
                  <>
                    <span className="text-3xl font-bold text-slate-900">
                      ${discountPrice}
                    </span>
                    <span className="text-slate-400 line-through">
                      ${product.price}
                    </span>
                    <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full">
                      Save {product.discount}%
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-bold text-slate-900">
                    ${product.price}
                  </span>
                )}
              </div>

              {/* description */}
              <div>
                <h2 className="text-sm font-semibold text-slate-800 mb-2">
                  Description
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* product details */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <FiFileText className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-600">Format:</span>
                  <span className="text-sm font-medium text-slate-800">
                    {product.format}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FiBook className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-600">Pages:</span>
                  <span className="text-sm font-medium text-slate-800">
                    {product.pages}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FiGlobe className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-600">Language:</span>
                  <span className="text-sm font-medium text-slate-800">
                    {product.language}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FiCheckCircle className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-600">Category:</span>
                  <span className="text-sm font-medium text-slate-800 capitalize">
                    {product.category}
                  </span>
                </div>
              </div>

              {/* publication info */}
              <div className="text-xs text-slate-500 space-y-1">
                <p>Published: {formatDate(product.created_at)}</p>
                <p>Last updated: {formatDate(product.updated_at)}</p>
              </div>

              {/* quantity + current cart count */}
              <div className="flex items-center gap-6 flex-wrap">
                <div>
                  <label
                    htmlFor="quantity"
                    className="block text-sm font-medium text-slate-700 mb-1"
                  >
                    Quantity
                  </label>
                  <select
                    id="quantity"
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      setQuantity(val);
                    }}
                    className="w-24 rounded-lg border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-700">
                    Items in cart
                  </p>
                  <p className="mt-1 inline-block px-4 py-1 bg-slate-100 rounded-full text-slate-800 font-semibold">
                    {count}
                  </p>
                </div>
              </div>

              {/* actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAddItem}
                  disabled={isAddingToCart}
                  className={`flex-1 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-white transition ${
                    isAddingToCart
                      ? "bg-emerald-400 cursor-not-allowed"
                      : "bg-emerald-500 hover:bg-emerald-600"
                  }`}
                >
                  {isAddingToCart ? (
                    <>
                      <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <FiShoppingCart className="w-5 h-5" />
                      Add to cart
                    </>
                  )}
                </button>

                <button
                  onClick={toggleCart}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold border border-slate-200 text-slate-800 hover:bg-slate-50 transition"
                >
                  <FiCreditCard className="w-5 h-5" />
                  Buy now
                </button>

                <button
                  onClick={handleReset}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold bg-red-500 text-white hover:bg-red-600 transition"
                >
                  <FiTrash2 className="w-5 h-5" />
                  Clear cart
                </button>
              </div>

              {localError && (
                <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-md px-3 py-2">
                  {localError}
                </p>
              )}

              {/* features */}
              <div className="pt-6 border-t border-slate-100">
                <h3 className="text-sm font-semibold text-slate-800 mb-3">
                  Ebook Features
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {featureList.map((f) => (
                    <div key={f.name} className="flex gap-3 items-start">
                      <f.icon className="w-6 h-6 text-emerald-500 mt-1" />
                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          {f.name}
                        </p>
                        <p className="text-xs text-slate-500">{f.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Preview button */}
              {product.preview && (
                <div className="pt-4">
                  <a
                    href={product.preview}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
                  >
                    <FiFileText className="w-4 h-4" />
                    Read Preview
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SingleProduct;

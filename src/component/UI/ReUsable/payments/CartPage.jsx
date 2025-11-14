"use client";

import { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import PlusMinus from "./PlusMinus";
import { Link } from "react-router-dom";

const CartPage = ({ setIsShowCart, count, setCount }) => {
  const [products, setProducts] = useState([]);
  const [isVisible, setIsVisible] = useState(true);

  // Initialize products from localStorage
  useEffect(() => {
    try {
      const storedProducts = JSON.parse(localStorage.getItem("product")) || [];
      setProducts(storedProducts);
    } catch (err) {
      console.error("Error loading cart:", err);
      setProducts([]);
    }
  }, []);

  // Safe close function
  const handleClose = () => {
    setIsVisible(false);
    // Use the prop if available, otherwise just hide locally
    if (typeof setIsShowCart === "function") {
      setIsShowCart(false);
    }
  };

  // Remove the problematic setIsCartOpen line
  // const handleClose = () => {
  //   setIsShowCart(false);
  //   setIsCartOpen(false); // Remove this line - setIsCartOpen doesn't exist
  // };

  const total = products.reduce((sum, item) => {
    const price = Number(item.price) || 0;
    const quantity = item.count || 1;
    return sum + price * quantity;
  }, 0);

  const handleCount = (productId, newCount) => {
    const updatedProducts = products.map((item) =>
      item.id === productId
        ? { ...item, quantity: newCount, count: newCount }
        : item
    );
    setProducts(updatedProducts);
    localStorage.setItem("product", JSON.stringify(updatedProducts));

    // Update global count if needed
    if (typeof setCount === "function") {
      const totalItems = updatedProducts.reduce(
        (sum, item) => sum + (item.count || 1),
        0
      );
      setCount(totalItems);
    }
  };

  const removeProduct = (productId) => {
    const updatedProducts = products.filter((item) => item.id !== productId);
    setProducts(updatedProducts);
    localStorage.setItem("product", JSON.stringify(updatedProducts));

    // Update global count
    if (typeof setCount === "function") {
      const totalItems = updatedProducts.reduce(
        (sum, item) => sum + (item.count || 1),
        0
      );
      setCount(totalItems);
    }
  };

  const clearCart = () => {
    setProducts([]);
    localStorage.setItem("product", JSON.stringify([]));
    if (typeof setCount === "function") setCount(0);
  };

  // If not visible, don't render
  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Cart Panel */}
      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        <div className="relative w-screen max-w-md">
          <div className="flex h-full flex-col bg-white shadow-xl">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-6 sm:px-6">
              <div className="flex items-start justify-between">
                <h2 className="text-lg font-bold text-white">
                  Your Shopping Cart
                </h2>
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-full p-1.5 text-white hover:bg-white/10 transition-colors"
                >
                  <span className="sr-only">Close panel</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-1 flex items-center justify-between">
                <span className="inline-flex items-center rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium text-white">
                  {products.length} {products.length === 1 ? "item" : "items"}
                </span>
                {products.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-xs text-white/80 hover:text-white transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>

            {/* Cart items */}
            <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
              {products.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-lg mb-2">
                    Your cart is empty
                  </p>
                  <p className="text-gray-400 text-sm mb-6">
                    Add some items to get started
                  </p>
                  <button
                    onClick={handleClose}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="flow-root">
                  <ul role="list" className="-my-6 divide-y divide-gray-200">
                    {products.map((product) => (
                      <li key={product.id} className="flex py-6">
                        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                          <img
                            src={
                              product.image ||
                              product.images?.[0] ||
                              ""
                            }
                            alt={product.title}
                            className="h-full w-full object-cover object-center"
                          />
                        </div>

                        <div className="ml-4 flex flex-1 flex-col">
                          <div className="flex justify-between text-base font-medium text-gray-900">
                            <h3 className="text-sm line-clamp-2">
                              {product.title}
                            </h3>
                            <p className="ml-4 font-bold text-indigo-600">
                              ${(Number(product.price) || 0).toFixed(2)}
                            </p>
                          </div>

                          {product.author && (
                            <p className="mt-1 text-sm text-gray-500">
                              by {product.author}
                            </p>
                          )}

                          <div className="flex flex-1 items-end justify-between text-sm">
                            <PlusMinus
                              setCount={(newValue) =>
                                handleCount(product.id, newValue)
                              }
                              count={product.count || 1}
                              initialValue={product.quantity || 1}
                              min={1}
                              max={10}
                            />
                            <button
                              type="button"
                              onClick={() => removeProduct(product.id)}
                              className="font-medium text-red-600 hover:text-red-500 transition-colors"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Footer - Only show if there are items */}
            {products.length > 0 && (
              <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                <div className="flex justify-between text-lg font-bold text-gray-900 mb-4">
                  <p>Subtotal</p>
                  <p className="text-indigo-600">${total.toFixed(2)}</p>
                </div>

                <p className="mt-0.5 text-sm text-gray-500 mb-6">
                  Shipping and taxes calculated at checkout.
                </p>

                <div className="space-y-3">
                  <Link
                    to="/payment"
                    onClick={handleClose}
                    className="flex items-center justify-center rounded-md bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors w-full"
                  >
                    Proceed to Checkout
                  </Link>

                  <button
                    onClick={handleClose}
                    className="flex items-center justify-center rounded-md border border-gray-300 px-6 py-3 text-base font-semibold text-gray-700 hover:bg-gray-50 transition-colors w-full"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

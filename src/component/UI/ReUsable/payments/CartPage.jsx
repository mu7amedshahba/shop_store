"use client";

import { useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import PlusMinus from "./PlusMinus";
import { Link } from "react-router-dom";

// Brand colors
const colors = {
  primary: "#4F46E5", // indigo-600
  primaryHover: "#4338CA", // indigo-700
  secondary: "#10B981", // emerald-500
  accent: "#F59E0B", // amber-500
  light: "#F3F4F6", // gray-100
  dark: "#111827", // gray-900
  muted: "#6B7280", // gray-500
};

const CartPage = ({ setShowCart, count, setIsCartOpen, setIsShowCart }) => {
  const [products, setProduct] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("product")) || []; 
    } catch (err) {
      console.log(err);
    }
  });

  const [open, setOpen] = useState(true);
  const productsCount = products.map((item) => ({
    id: item.id,
    count: item.count,
  }));
  const total =
    products.reduce((sum, item) => sum + (Number(item.price) || 0), 0) *
    (count || 1);
  console.log(productsCount);

  //

  const handleClose = () => {
    setOpen(false);
    setIsCartOpen(false);
    setIsShowCart(false);
  };

  const handleCount = (productId, newCount) => {
    setProduct((prev) =>
      prev.map((item) =>
        item.id === productId
          ? { ...item, quantity: newCount, count: newCount } // update count
          : item
      )
    );
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
          setIsCartOpen(false);
          setShowCart(false);
          setIsShowCart(false);
        }}
        className="relative z-50"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ease-in-out data-closed:opacity-0"
        />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <DialogPanel
                transition
                className="pointer-events-auto w-screen max-w-md transform transition-all duration-300 ease-in-out data-closed:translate-x-full"
              >
                <div className="flex h-full flex-col overflow-y-auto bg-white shadow-xl">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] px-4 py-6 sm:px-6">
                    <div className="flex items-start justify-between">
                      <DialogTitle className="text-lg font-bold text-white">
                        Your Shopping Cart
                      </DialogTitle>
                      <button
                        type="button"
                        onClick={handleClose}
                        className="rounded-full p-1.5 text-white hover:bg-white/10 transition-colors"
                      >
                        <span className="sr-only">Close panel</span>
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                    <div className="mt-1 flex items-center text-sm text-white/90">
                      <span className="inline-flex items-center rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium">
                        {products.length} items
                      </span>
                    </div>
                  </div>
                  {/* Cart items */}
                  <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                    <div className="flow-root">
                      <ul
                        role="list"
                        className="-my-6 divide-y divide-gray-200"
                      >
                        {products.map((product) => (
                          <li
                            key={product.id}
                            className="flex p-2 group border my-2 rounded-2xl"
                          >
                            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 transition-all duration-200 group-hover:border-[#4F46E5]">
                              <img
                                src={product.image}
                                alt={product.title}
                                className="h-full w-full object-cover object-center"
                              />
                            </div>

                            <div className="ml-4 flex flex-1 flex-col">
                              <div>
                                <div className="flex justify-between text-base font-medium text-gray-900">
                                  <h3>
                                    <a
                                      href={product.href}
                                      className="hover:text-[#4F46E5] transition-colors"
                                    >
                                      {product.title}
                                    </a>
                                  </h3>
                                  <p className="ml-4 font-bold text-[#4F46E5]">
                                    {product.price}
                                  </p>
                                </div>
                                <p className="mt-1 text-sm text-gray-500">
                                  {product.color}
                                </p>
                              </div>
                              <div className="flex flex-1 items-end justify-between gap-4">
                                <PlusMinus
                                  setCount={(newValue) =>
                                    handleCount(product.id, newValue)
                                  }
                                  count={product.count}
                                  initialValue={product.quantity}
                                  min={1}
                                  max={10}
                                  // onChange={handleCount(newValue)}
                                  className="mt-2"
                                />
                                <button
                                  type="button"
                                  className="font-medium text-red-500 hover:text-red-700 transition-colors"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <Link
                    to="/payment"
                    className="payment inline-block w-[20vw] mx-auto text-center px-6 py-3 mb-4 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Go To Payment
                  </Link>
                  {/* Footer */}
                  <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <p>Subtotal</p>
                      <p className="underline text-[var(--color-accent-dark)">
                        {total} $
                      </p>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Shipping and taxes calculated at checkout.
                    </p>
                    <div className="mt-6">
                      <a
                        href="#"
                        className={`flex items-center justify-center rounded-md px-6 py-3 text-base font-bold text-white shadow-sm hover:bg-[${colors.primaryHover}] bg-[${colors.primary}] transition-colors duration-200`}
                      >
                        Proceed to Checkout
                      </a>
                    </div>
                    <div className="mt-4 flex justify-center text-center text-sm text-gray-500">
                      <p>
                        or{" "}
                        <button
                          type="button"
                          onClick={() => setOpen(false)}
                          className="font-medium text-[#4F46E5] hover:text-[#4338CA] transition-colors"
                        >
                          Continue Shopping
                          <span aria-hidden="true"> &rarr;</span>
                        </button>
                      </p>
                    </div>
                  </div>
                </div>
              </DialogPanel>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default CartPage;

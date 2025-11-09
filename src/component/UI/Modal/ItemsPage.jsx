import React, { useState } from "react";
import { ShoppingCartIcon } from "@heroicons/react/24/outline"; // Install heroicons if not already

const ItemsPage = ({ setIsShowCart }) => {
  const products = [
    {
      id: 1,
      name: "Wireless Mouse",
      description: "Smooth wireless mouse",
      price: 19.99,
    },
    {
      id: 2,
      name: "Mechanical Keyboard",
      description: "RGB mechanical keyboard",
      price: 59.99,
    },
    {
      id: 3,
      name: "Noise-Cancelling Headphones",
      description: "Block out the noise",
      price: 89.99,
    },
    {
      id: 4,
      name: "Portable Charger",
      description: "Fast charging on the go",
      price: 29.99,
    },
  ];

  const [cart, setCart] = useState([]);
  const [quantities, setQuantities] = useState({});

  const increaseQty = (id) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: (prev[id] || 1) + 1,
    }));
  };

  const decreaseQty = (id) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max((prev[id] || 1) - 1, 1),
    }));
  };

  const addToCart = (product) => {
    const qty = quantities[product.id] || 1;
    const existing = cart.find((item) => item.id === product.id);

    if (existing) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + qty }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: qty }]);
    }
  };

  // two quantities =>
  // 1- item quantity
  // 2- new selected quantity
  // two quantities =>
  // 1- item count
  // 2- new selected count

  const addingCarts = (product) => {
    const itemQuantity = quantities[product.id] || 1;
    const existingItem = cart.find((item) => item.id == product.id);

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + itemQuantity }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: itemQuantity }]);
    }
  };

  // oldCart => array

  const handleCloseCart = (e) => {
    e.preventDefault();
    setIsShowCart(true);
    console.log("closed item");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-800">My Store</h1>
          <div className="relative">
            <ShoppingCartIcon
              onClick={handleCloseCart}
              className="w-8 h-8 text-gray-700"
            />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
                {cart.reduce((total, item) => total + item.quantity, 0)}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Products List */}
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="border border-gray-200 rounded-2xl shadow-md p-5 bg-white hover:shadow-lg transition-shadow duration-300"
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              {product.name}
            </h2>
            <p className="text-gray-600 text-sm mb-4">{product.description}</p>
            <span className="block text-lg font-bold text-green-600 mb-4">
              ${product.price.toFixed(2)}
            </span>

            {/* Quantity Controls */}
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={() => decreaseQty(product.id)}
                className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                −
              </button>
              <span className="min-w-[30px] text-center">
                {quantities[product.id] || 1}
              </span>
              <button
                onClick={() => increaseQty(product.id)}
                className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                +
              </button>
            </div>

            {/* Add to Cart */}
            <button
              onClick={() => addToCart(product)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg w-full transition-colors duration-300"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItemsPage;

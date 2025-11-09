import { useEffect, useState, useCallback } from "react";

const useCustomCart = () => {
  // Load cart from localStorage once
  const [cartData, setCartData] = useState(() => {
    return JSON.parse(localStorage.getItem("product")) || [];
  });

  // Persist cartData into localStorage on change
  useEffect(() => {
    localStorage.setItem("product", JSON.stringify(cartData));
  }, [cartData]);

  // Add or update item in cart
  const updateCart = useCallback((newItem, change = 1) => {
    setCartData((prev) => {
      const existItem = prev.find((itm) => itm.id === newItem.id);
      if (existItem) {
        return prev.map((item) =>
          item.id === newItem.id
            ? {
                ...item,
                quantity: (item.quantity || 0) + change,
                count: (item.count || 0) + change,
              }
            : item
        );
      } else {
        return [...prev, { ...newItem, quantity: change, count: change }];
      }
    });
  }, []);

  // Remove item by id
  const removeFromCart = useCallback((id) => {
    setCartData((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // Clear whole cart
  const clearCart = useCallback(() => {
    setCartData([]);
  }, []);

  // Calculate totals
  const totalQuantity = cartData.reduce(
    (sum, item) => sum + (item.quantity || 0),
    0
  );

  const totalCost = cartData.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
    0
  );

  return {
    cartData,
    updateCart,
    removeFromCart,
    clearCart,
    totalQuantity,
    totalCost,
  };
};

export default useCustomCart;

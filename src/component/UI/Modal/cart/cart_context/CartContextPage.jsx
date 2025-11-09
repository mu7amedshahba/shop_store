import { createContext, useReducer, useState } from "react";

const initialValues = {
  items: [],
  totalAmount: 0,
};

const cartReducer = (data, action) => {
  if (action.type === "ADD") {
    const updatedData = data.items.concat(action.item);
    const updatedTotalAmount =
      data.totalAmount + action.item.price * action.item.quantity;

    return {
      items: updatedData,
      totalAmount: updatedTotalAmount,
    };
  }
  if (action.type === "REMOVE") {
    const filteredItems = data.items.filter((item) => item.id !== action.id);

    return {
      items: filteredItems,
    };
  }

  return ;
};

export const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cartState, dispatchCartAction] = useReducer(
    cartReducer,
    initialValues
  );
  const addCartItems = (newItem) => {
    dispatchCartAction({
      type: "ADD",
      item: newItem,
    });
  };
  //
  const removeCartItems = (newItem) => {
    dispatchCartAction({
      type: "REMOVE",
      id: newItem.id,
    });
  };
  //
  const cartData = {
    items: cartState.items,
    totalAmount: cartState.totalAmount,
    addItem: addCartItems,
    removeItem: removeCartItems,
  };

  return (
    <CartContext.Provider value={cartData}>{children}</CartContext.Provider>
  );
};

export default CartProvider;

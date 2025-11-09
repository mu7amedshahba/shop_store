import React from "react";
import Cart from "./Cart";

const CartBacket = ({ data }) => {
  return (
    <div>
      <Cart items={data} />
    </div>
  );
};

export default CartBacket;

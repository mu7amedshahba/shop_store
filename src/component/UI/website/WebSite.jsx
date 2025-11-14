import React, { useState } from "react";
import Hero from "./HomePage/Hero";
import About from "./About/About";
import ProductsPage from "../../DashBoard_files/product__Files/ProductsPage";
import FeaturedCollections from "./Proposition/FeaturedCollections";
import CartProvider from "../Modal/cart/cart_context/CartContextPage";

const WebSite = () => {
  const [isShowCart, setIsShowCart] = useState(false);
  const [count, setCount] = useState(1);

  return (
    <div className="w-full">
      <CartProvider>
        <Hero />
        <About />
        <ProductsPage
          setIsShowCart={setIsShowCart}
          count={count}
          setCount={setCount}
        />
        <FeaturedCollections />
      </CartProvider>
    </div>
  );
};

export default WebSite;
import { useEffect, useState } from "react";

const Shipping = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrices, setTotalPrice] = useState();
  

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("product"));
    setCartItems(items);
    setTotalPrice(calcTotal(items));
  }, []);

  return <></>;
};

const calcTotal = (prices) =>
  prices.reduce((sum, prod) => sum + prod.price * prod.count);

const updateItems = (id,newCount) => {
const updatingItems = cartItems.map(item => 
    item.id === id ? {...item , count : Math.max(1 , Math.min(newCount , item.stock)) } : item
)
setCartItems(updatingItems)
localStorage.setItem('product',updatingItems)
setTotalPrice(calcTotal(updatingItems))
}





export default Shipping;

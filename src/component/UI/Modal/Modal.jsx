import React, { useState } from "react";

import CartItem from "./cart/CartItem.jsx";

const Modal = () => {
  const overLay = document.getElementById("overLay");
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div>
      {ReactDOM.createPortal(
        <CartItem isOpen={isOpen} setIsOpen={setIsOpen} />,
        overLay
      )}
    </div>
  );
};

export default Modal;

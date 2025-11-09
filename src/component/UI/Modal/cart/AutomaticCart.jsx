import React, { useCallback, useState, useMemo } from "react";

const AutomaticCart = () => {
  const [cart, setCart] = useState([]);
  const [tickets, setTickets] = useState([
    { id: 1, direction: "Riyadh - Sanaa", price: 250, date: "25 - 8 " },
    { id: 2, direction: "Dammam - Kuwait", price: 300, date: "28 - 8" },
    { id: 3, direction: "Cairo - Gadda", price: 650, date: "25 - 8 " },
    { id: 4, direction: "Makka - Madina", price: 150, date: "27 - 8 " },
  ]);

  const addToCart = useCallback((newItem) => {
    setCart((prev) => {
      if (prev.find((item) => item.id === newItem.id)) {
        return prev;
      } else {
        return [...prev, newItem];
      }
    });
  }, []);

  //   remove item from cart
  const removeTicket = useCallback((id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  }, []);

  //   total price
  const totalPrice = useMemo(
    () => cart.reduce((sum, item) => sum + item.price, 0),
    [cart]
  );
  
  return (
    <div className="p-6">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Today Tickets</h1>
        {tickets.map((tic) => (
          <div
            className="bg-white rounded-lg shadow-md p-4 border border-gray-200 relative"
            key={tic.id}
          >
            <div className="text-lg font-semibold text-gray-700">
              {tic.direction}
            </div>
            <p className="text-gray-500 mt-1">{tic.date}</p>
            <p className="text-green-900 font-medium mt-1">{tic.price}$</p>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded mt-3 transition-colors"
              onClick={() => addToCart(tic)}
            >
              Book Now
            </button>
          </div>
        ))}
      </div>

      <div className="bg-gray-100 rounded-lg p-6 mt-8 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Shopping Cart</h2>
        {cart.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-md p-4 mb-3 border border-gray-200 flex justify-between items-center"
          >
            <div className="flex-1">
              <div className="text-gray-700 font-medium">{item.direction}</div>
              <div className="text-gray-500 text-sm">{item.date}</div>
              <div className="text-green-900 font-medium">{item.price}$</div>
            </div>
            <button
              onClick={() => removeTicket(item.id)}
              classNameName="text-red-600 hover:text-red-800 p-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        ))}
        <div className="border-t border-gray-300 pt-4 mt-4">
          <div className="text-xl font-bold text-gray-800 flex justify-between">
            <span>Total:</span>
            <span>{totalPrice}$</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutomaticCart;

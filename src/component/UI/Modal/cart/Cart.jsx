import React from 'react'

const Cart = ({item}) => {
  return (
    <div>
      <div
        key={item.id}
        className="flex flex-col md:flex-row items-center justify-between p-6 bg-white rounded-lg shadow-md w-full max-w-2xl"
      >
        <div className="flex-1 mb-4 md:mb-0">
          <h2 className="text-xl font-bold text-gray-800">{item.name}</h2>
          <p className="text-gray-600 mt-2">{item.description}</p>
          <p className="text-lg font-semibold text-blue-600 mt-2">
            ${item.price.toFixed(2)}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setCount((prev) => (prev > 1 ? prev - 1 : prev))}
            className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full text-gray-700 hover:bg-gray-300 transition-colors"
          >
            -
          </button>
          <span className="text-lg font-medium w-8 text-center">{count}</span>
          <button
            onClick={() => setCount((prev) => (prev < 10 ? prev + 1 : 10))}
            className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full text-gray-700 hover:bg-gray-300 transition-colors"
          >
            +
          </button>
        </div>
      </div>
    </div>
  )
}

export default Cart

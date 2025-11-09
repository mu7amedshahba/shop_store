import React, { useContext, useState } from 'react';
import { FiShoppingCart, FiTrash2, FiPlus, FiMinus, FiArrowLeft, FiX } from 'react-icons/fi';
import { CartContext } from '../Modal/cart/cart_context/CartContextPage';

const CartComponent = ({ setIsShowCart }) => {
  const products = JSON.parse(localStorage.getItem('product')) || []
  const [items, setItems] = useState( products );
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setItems(items.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === 'SAVE10') {
      setDiscount(0.1); // 10% discount
    }
  };

const cartContextItems = useContext(CartContext)
console.log(cartContextItems)
const onContinueShopping = () => {}
const onCheckout = () => {}


  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalDiscount = subtotal * discount;
  const total = subtotal - totalDiscount;
  const shippingFee = total > 50 || items.length === 0 ? 0 : 5.99;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold flex items-center">
            <FiShoppingCart className="mr-2" />
            Your Cart ({items.length})
          </h2>
          <button onClick={() => setIsShowCart(false)}>
            <FiX className="text-lg" />
          </button>
        </div>

        {/* Cart Content */}
        <div className="p-4">
          {items.length === 0 ? (
            <div className="text-center py-8">
              <FiShoppingCart className="mx-auto text-4xl mb-4" />
              <p className="mb-4">Your cart is empty</p>
              <button 
                onClick={onContinueShopping}
                className="px-4 py-2 bg-black text-white rounded"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="divide-y">
              {items.map((item) => (
                <div key={item.id} className="py-4">
                  <div className="flex gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-contain border"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-medium">{item.name}</h3>
                        <button onClick={() => removeItem(item.id)}>
                          <FiTrash2 />
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 my-1">{item.description}</p>
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center border">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-2 py-1"
                          >
                            <FiMinus />
                          </button>
                          <span className="px-3">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-2 py-1"
                          >
                            <FiPlus />
                          </button>
                        </div>
                        <p className="font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Summary */}
        {items.length > 0 && (
          <div className="p-4 border-t">
            <h3 className="font-bold mb-4">Order Summary</h3>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shippingFee === 0 ? 'Free' : `$${shippingFee.toFixed(2)}`}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between">
                  <span>Discount</span>
                  <span>-${totalDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold border-t pt-2">
                <span>Total</span>
                <span>${(total + shippingFee).toFixed(2)}</span>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Coupon code"
                  className="flex-1 border p-2 rounded-l"
                />
                <button 
                  onClick={applyCoupon}
                  className="bg-black text-white px-4 rounded-r"
                >
                  Apply
                </button>
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={onContinueShopping}
                className="flex-1 border border-black py-2 rounded flex items-center justify-center gap-1"
              >
                <FiArrowLeft /> Continue Shopping
              </button>
              <button 
                onClick={onCheckout}
                className="flex-1 bg-black text-white py-2 rounded"
              >
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartComponent;
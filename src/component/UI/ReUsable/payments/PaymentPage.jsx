import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const PaymentPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Load cart from localStorage
  useEffect(() => {
    try {
      const items = JSON.parse(localStorage.getItem('product')) || [];
      setCartItems(items);
      setTotal(calculateTotal(items));
    } catch (err) {
      setError('Failed to load cart');
      console.error(err);
    }
  }, []);

  const calculateTotal = (items) => {
    return items.reduce((sum, item) => sum + (item.price * item.count), 0);
  };

  const updateCount = (id, newCount) => {
    const updatedItems = cartItems.map(item => 
      item.id === id ? { ...item, count: Math.max(1, Math.min(newCount, item.stock)) } : item
    );    
    
    setCartItems(updatedItems);
    localStorage.setItem('product', JSON.stringify(updatedItems));
    setTotal(calculateTotal(updatedItems));
  };

  const removeItem = (id) => {
    const updatedItems = cartItems.filter(item => item.id !== id);
    setCartItems(updatedItems);
    localStorage.setItem('product', JSON.stringify(updatedItems));
    setTotal(calculateTotal(updatedItems));
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      localStorage.removeItem('product');
      navigate('/order-confirmation');
    } catch (err) {
      setError('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link to="/" className="text-2xl font-bold text-indigo-600 hover:text-indigo-700 transition">
            YourBrand
          </Link>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Secure Checkout</span>
            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden  outline-0 border-2 border-[var(--color-accent-light)]">
          <div className="md:flex bg-[var(--color-primary-lightest)]">
            {/* Cart Items */}
            <div className="md:w-2/3 p-6 sm:p-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Cart ({cartItems.length})</h1>
              
              {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {cartItems.length === 0 ? (
                <div className="text-center py-12">
                  <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <h3 className="mt-2 text-lg font-medium text-gray-900">Your cart is empty</h3>
                  <p className="mt-1 text-gray-500">Start adding some items to your cart</p>
                  <div className="mt-6">
                    <Link to="/" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {cartItems.map(item => (
                    <div key={item.id} className="py-6 flex">
                      <div className="flex-shrink-0 w-24 h-24 rounded-md overflow-hidden">
                        <img
                          src={item.images[0].image}
                          alt={item.name}
                          className="w-full h-full object-center object-cover"
                        />
                      </div>

                      <div className="ml-4 flex-1 flex flex-col">
                        <div>
                          <div className="flex justify-between text-base font-medium text-gray-900">
                            <h3>{item.name}</h3>
                            <p className="ml-4">${(item.price * item.count)}</p>
                          </div>
                          <p className="mt-1 text-sm text-gray-500">${item.price} each</p>
                        </div>

                        <div className="flex-1 flex items-end justify-between text-sm">
                          <div className="flex items-center border border-gray-300 rounded-md">
                            <button
                              onClick={() => updateCount(item.id, item.count - 1)}
                              disabled={item.count <= 1}
                              className="px-3 py-1 text-gray-600 disabled:text-gray-300"
                            >
                              -
                            </button>
                            <span className="px-2 py-1 text-center w-12">{item.count}</span>
                            <button
                              onClick={() => updateCount(item.id, item.count + 1)}
                              disabled={item.count >= item.stock}
                              className="px-3 py-1 text-gray-600 disabled:text-gray-300"
                            >
                              +
                            </button>
                          </div>

                          <div className="flex">
                            <button
                              onClick={() => removeItem(item.id)}
                              type="button"
                              className="font-medium text-indigo-600 hover:text-indigo-500"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="md:w-1/3 p-6 sm:p-8 bg-[var(--color-accent-light)]">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Order summary</h2>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Subtotal</dt>
                  <dd className="text-sm font-medium text-gray-900">${total}</dd>
                </div>

                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Shipping</dt>
                  <dd className="text-sm font-medium text-gray-900">Free</dd>
                </div>

                <div className="border-t border-gray-200 pt-4 flex justify-between">
                  <dt className="text-base font-medium text-gray-900">Order total</dt>
                  <dd className="text-base font-medium text-gray-900">${total}</dd>
                </div>
              </div>

              <div className="mt-8">
                <button
                  onClick={handlePayment}
                  disabled={cartItems.length === 0 || loading}
                  className={`w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${cartItems.length === 0 || loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    'Checkout'
                  )}
                </button>
              </div>

              <div className="mt-6 flex justify-center text-sm text-center text-gray-500">
                <p>
                  or{' '}
                  <Link to="/" className="text-indigo-600 font-medium hover:text-indigo-500">
                    Continue Shopping<span aria-hidden="true"> &rarr;</span>
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
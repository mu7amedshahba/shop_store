import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

// Replace these with your actual brand colors
const brandColors = {
  primary: 'bg-[#4F46E5]',       // Indigo-600
  primaryHover: 'hover:bg-[#4338CA]', // Indigo-700
  primaryText: 'text-[#4F46E5]',
  secondary: 'bg-[#10B981]',      // Emerald-500
  secondaryHover: 'hover:bg-[#059669]', // Emerald-600
  background: 'bg-[#F9FAFB]',     // Gray-50
  card: 'bg-white',
  textPrimary: 'text-gray-900',
  textSecondary: 'text-gray-600',
  border: 'border-gray-200',
};
  // 
const OrderConfirmation = () => {
  const location = useLocation();
  const orderDetails = location.state?.orderDetails || {  
    orderId: `#${Math.floor(Math.random() * 1000000)}`,
    date: new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    total: 0,
    items: []
  };
  //  
  // Clear cart on confirmation page load
  useEffect(() => {
    localStorage.removeItem('product');
  }, []);
  // 
  return (
    <div className={`min-h-screen ${brandColors.background} py-12 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Link 
            to="/" 
            className={`inline-block text-2xl font-bold ${brandColors.primaryText} hover:opacity-90 transition-opacity mb-8`}
          >
            YourBrand
          </Link>
          
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-50 mb-6">
            <CheckCircleIcon className="h-12 w-12 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl mb-3">
            Order Confirmed!
          </h1>
          <p className="text-lg text-gray-600 mb-1">
            Thank you for your purchase!
          </p>
          <p className="text-gray-500">
            We've sent your order confirmation to your email.
          </p>
        </div>

        {/* Order Card */}
        <div className={`${brandColors.card} shadow-lg rounded-xl overflow-hidden mb-8 border ${brandColors.border}`}>
          <div className={`px-6 py-5 ${brandColors.background} border-b ${brandColors.border}`}>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Order {orderDetails.orderId}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Placed on {orderDetails.date}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${brandColors.secondary} text-white`}>
                Completed
              </span>
            </div>
          </div>
          
          <div className="px-6 py-5">
            <h4 className="font-medium text-gray-900 mb-5">Order Details</h4>
            
            <div className="space-y-6">
              {orderDetails.items.map((item) => (
                <div key={item.id} className="flex">
                  <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border border-gray-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between text-base">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <p className="ml-4 font-medium">${(item.price * item.count).toFixed(2)}</p>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Qty: {item.count} × ${item.price.toFixed(2)} each
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-200 space-y-3">
              <div className="flex justify-between">
                <p className="text-gray-600">Subtotal</p>
                <p className="font-medium">${orderDetails.total.toFixed(2)}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-600">Shipping</p>
                <p className="font-medium">Free</p>
              </div>
              <div className="flex justify-between pt-3">
                <p className="font-semibold text-gray-900">Total</p>
                <p className="font-semibold">${orderDetails.total.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>


        <div className={`${brandColors.card} shadow-lg rounded-xl overflow-hidden mb-8 border ${brandColors.border}`}>
          <div className="px-6 py-5 border-b border-gray-200">
            <h4 className="font-medium text-gray-900">Customer Information</h4>
          </div>
          
          <div className="px-6 py-5 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <h5 className="text-sm font-medium text-gray-500 mb-2">Shipping Address</h5>
              <address className="not-italic text-gray-700">
                John Smith<br />
                123 Main Street<br />
                San Francisco, CA 94103<br />
                United States
              </address>
            </div>
            
            <div>
              <h5 className="text-sm font-medium text-gray-500 mb-2">Contact Information</h5>
              <p className="text-gray-700">john.smith@example.com</p>
              <p className="text-gray-700 mt-1">(123) 456-7890</p>
            </div>
            
            <div>
              <h5 className="text-sm font-medium text-gray-500 mb-2">Payment Method</h5>
              <div className="flex items-center mt-1">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm0 2v12h16V6H4zm4 3h8v2H8V9zm0 4h5v2H8v-2z"/>
                  </svg>
                </div>
                <span className="text-gray-700">VISA ending in 4242</span>
              </div>
            </div>
            
            <div>
              <h5 className="text-sm font-medium text-gray-500 mb-2">Shipping Method</h5>
              <p className="text-gray-700">Standard Shipping</p>
              <p className="text-sm text-gray-500 mt-1">Estimated delivery: 3-5 business days</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
          <Link
            to="/orders"
            className={`px-6 py-3 border border-gray-300 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors text-center`}
          >
            View Order History
          </Link>
          <Link
            to="/products"
            className={`px-6 py-3 rounded-md shadow-sm text-base font-medium text-white ${brandColors.primary} ${brandColors.primaryHover} transition-colors text-center`}
          >
            Continue Shopping
          </Link>
        </div>
        
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Need help? <Link to="/contact" className={`${brandColors.primaryText} hover:underline`}>Contact our support</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
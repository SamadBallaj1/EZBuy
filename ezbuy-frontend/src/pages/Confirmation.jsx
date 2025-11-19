import { useLocation, Link } from "react-router-dom";

const Confirmation = () => {
  const location = useLocation();
  const { order, orderDetails, shippingInfo } = location.state || {};

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No order found</h2>
          <Link to="/products" className="text-blue-600 font-semibold hover:underline">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-4xl font-black text-white mb-2">Payment Successful!</h1>
            <p className="text-green-100 text-lg">Thank you for your order</p>
          </div>

          <div className="p-8 space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Order Number</p>
                  <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                    {order.order_number}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-600">Order Date</p>
                  <p className="text-lg font-bold text-gray-900">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Customer Information
                </h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-semibold text-gray-700">Name:</span> <span className="text-gray-900">{shippingInfo.name}</span></p>
                  <p><span className="font-semibold text-gray-700">Email:</span> <span className="text-gray-900">{shippingInfo.email}</span></p>
                  <p><span className="font-semibold text-gray-700">Phone:</span> <span className="text-gray-900">{shippingInfo.phone}</span></p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Shipping Address
                </h3>
                <p className="text-sm text-gray-900">{shippingInfo.address}</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
              <h3 className="text-xl font-black text-gray-900 mb-6">Order Summary</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 font-medium">Subtotal</span>
                  <span className="font-bold text-gray-900">${orderDetails.subtotal.toFixed(2)}</span>
                </div>

                {orderDetails.studentDiscount > 0 && (
                  <div className="flex justify-between text-sm bg-green-50 -mx-6 px-6 py-3 border-y border-green-100">
                    <span className="text-green-700 font-bold flex items-center gap-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      Student Discount (30%)
                    </span>
                    <span className="font-black text-green-600">−${orderDetails.studentDiscount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 font-medium">Shipping</span>
                  <span className="font-bold text-gray-900">${orderDetails.shipping.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 font-medium">Tax (7%)</span>
                  <span className="font-bold text-gray-900">${orderDetails.tax.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-xl font-black border-t-2 border-gray-300 pt-4 mt-4">
                  <span className="text-gray-900">Total Paid</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                    ${orderDetails.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-blue-900 mb-2">What's Next?</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Order confirmation sent to {shippingInfo.email}</li>
                    <li>• You'll receive shipping updates via email</li>
                    <li>• Expected delivery: 3-5 business days</li>
                    <li>• Track your order in Order History</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <Link
                to="/orders"
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-bold text-center hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl hover:scale-105"
              >
                View Order History
              </Link>
              <Link
                to="/products"
                className="flex-1 bg-white border-2 border-gray-300 text-gray-900 py-4 px-6 rounded-xl font-bold text-center hover:border-gray-400 hover:bg-gray-50 transition-all"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
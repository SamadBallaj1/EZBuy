import { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const Profile = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalSavings, setTotalSavings] = useState(0);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    fetchOrders();
  }, [user, navigate]);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/orders/user/${user.id}`);
      const data = await response.json();
      setOrders(data);
      
      const savings = data.reduce((sum, order) => sum + (order.student_discount_applied || 0), 0);
      setTotalSavings(savings);
    } catch (error) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  const getStatusColor = (status) => {
    switch(status) {
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-white/20">
              <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-8 text-center relative">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative">
                  <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl mx-auto mb-4 flex items-center justify-center border-4 border-white/30 shadow-xl">
                    <span className="text-5xl font-black text-white">
                      {user.full_name ? user.full_name[0].toUpperCase() : user.email[0].toUpperCase()}
                    </span>
                  </div>
                  <h2 className="text-2xl font-black text-white mb-1">{user.full_name || 'User'}</h2>
                  <p className="text-white/90 text-sm font-medium">{user.email}</p>
                </div>
              </div>

              <div className="p-6">
                {user.is_student && (
                  <div className="mb-6">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200 shadow-lg">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md">
                          <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                          </svg>
                        </div>
                        <div>
                          <p className="text-lg font-black text-green-900">Student Verified</p>
                          <p className="text-xs font-semibold text-green-700 uppercase tracking-wide">Active Status</p>
                        </div>
                      </div>
                      <div className="bg-white rounded-xl p-4 border border-green-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-gray-600 uppercase">Verified Identity</span>
                          <span className="text-xs font-black text-green-600">VERIFIED</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-gray-600">ID Type</span>
                          <span className="text-xs font-bold text-gray-900">STUDENT</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-200">
                  <div className="text-center">
                    <p className="text-sm font-bold text-gray-700 mb-2">Total Savings</p>
                    <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                      ${totalSavings.toFixed(2)}
                    </p>
                    <p className="text-xs font-semibold text-gray-600 mt-2">{orders.length} orders placed</p>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <Link to="/student-discount" className="w-full flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl transition-all shadow-lg hover:shadow-xl font-bold">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z"/>
                    </svg>
                    Student Benefits
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
                <h2 className="text-3xl font-black text-white flex items-center gap-3">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Order History
                </h2>
              </div>

              <div className="p-6">
                {loading ? (
                  <div className="text-center py-16">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 font-semibold">Loading orders...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-16">
                    <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h3>
                    <p className="text-gray-600 mb-6">Start shopping and save with student discounts!</p>
                    <Link to="/products" className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-bold hover:shadow-xl transition-all">
                      Browse Products
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <div key={order.id} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border-2 border-gray-200 overflow-hidden shadow-lg hover:shadow-xl transition-all">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 text-white">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <p className="text-sm font-semibold text-white/80 mb-1">Order Number</p>
                              <p className="text-xl font-black">{order.order_number}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-semibold text-white/80 mb-1">Total</p>
                              <p className="text-2xl font-black">${order.total_amount?.toFixed(2)}</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-white/90">
                              {new Date(order.created_at).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </p>
                            <span className={`px-4 py-2 rounded-full text-sm font-black border-2 ${getStatusColor(order.order_status)} shadow-md`}>
                              {order.order_status?.toUpperCase() || 'PROCESSING'}
                            </span>
                          </div>
                        </div>

                        <div className="p-6">
                          <div className="space-y-4 mb-6">
                            {order.items?.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-4 bg-gray-50 rounded-xl p-4 border border-gray-200">
                                <img 
                                  src={item.image} 
                                  alt={item.name} 
                                  className="w-20 h-20 object-cover rounded-lg border-2 border-white shadow-md"
                                />
                                <div className="flex-1">
                                  <h4 className="font-bold text-gray-900 text-lg">{item.name}</h4>
                                  <p className="text-sm text-gray-600 font-semibold">Quantity: {item.quantity}</p>
                                  <p className="text-blue-600 font-black text-lg">${(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                              </div>
                            ))}
                          </div>

                          {order.student_discount_applied > 0 && (
                            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 mb-4">
                              <div className="flex items-center justify-between">
                                <span className="text-green-700 font-bold flex items-center gap-2">
                                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                                  </svg>
                                  You saved with Student Discount
                                </span>
                                <span className="text-2xl font-black text-green-600">
                                  ${order.student_discount_applied.toFixed(2)}
                                </span>
                              </div>
                            </div>
                          )}

                          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                            <div className="flex gap-3">
                              <svg className="w-6 h-6 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              </svg>
                              <div>
                                <p className="font-bold text-blue-900 mb-1">Shipping Address</p>
                                <p className="text-sm text-blue-800">{order.shipping_address}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
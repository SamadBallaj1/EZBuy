import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const searchRef = useRef(null);
  const debounceTimeout = useRef(null);

  const categories = [
    { id: 'all', name: 'All Categories', icon: '🏪' },
    { id: 'electronics', name: 'Electronics', icon: '💻' },
    { id: 'fashion', name: 'Fashion', icon: '👕' },
    { id: 'home', name: 'Home & Kitchen', icon: '🏠' },
    { id: 'student', name: 'Student Essentials', icon: '📚' },
    { id: 'coffee', name: 'Coffee & Drinks', icon: '☕' },
    { id: 'accessories', name: 'Accessories', icon: '🎧' }
  ];

  const quickSearchTerms = [
    'Laptop', 'Headphones', 'Mouse', 'Keyboard', 'Webcam', 
    'Charger', 'Speaker', 'Tablet', 'Monitor', 'Backpack'
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) setRecentSearches(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (searchQuery.length > 0) {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
      
      debounceTimeout.current = setTimeout(() => {
        const filtered = quickSearchTerms.filter(term => 
          term.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSuggestions(filtered);
      }, 200);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  const handleSearch = (query = searchQuery, category = selectedCategory) => {
    if (!query.trim()) return;
    
    const updatedRecent = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(updatedRecent);
    localStorage.setItem('recentSearches', JSON.stringify(updatedRecent));
    
    const params = new URLSearchParams();
    params.set('q', query);
    if (category !== 'all') params.set('category', category);
    
    navigate(`/products?${params.toString()}`);
    setShowSuggestions(false);
  };

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    if (categoryId === 'all') {
      navigate('/products');
    } else {
      navigate(`/products?category=${categoryId}`);
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  return (
    <>
      <nav className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 text-white shadow-2xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 flex-shrink-0 group">
              <img 
                src="/assets/logo.png" 
                alt="EzBuy Logo" 
                className="w-10 h-10 group-hover:scale-105 transition-transform"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-xl shadow-lg group-hover:shadow-blue-500/50 transition-all duration-300 group-hover:scale-105" style={{display: 'none'}}>
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <span className="text-2xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                EzBuy
              </span>
            </Link>

            <div ref={searchRef} className="flex-1 max-w-3xl relative">
              <div className="flex items-center bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-gray-50 text-gray-700 px-4 py-3.5 pr-8 font-medium cursor-pointer border-r border-gray-200 focus:outline-none focus:bg-gray-100 transition-colors appearance-none"
                    style={{ minWidth: '160px' }}
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                  </select>
                  <svg className="w-4 h-4 text-gray-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search for products, brands, and more..."
                  className="flex-1 px-4 py-3.5 text-gray-800 placeholder-gray-400 focus:outline-none text-sm"
                />

                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSuggestions([]);
                    }}
                    className="px-3 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}

                <button
                  onClick={() => handleSearch()}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3.5 font-bold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>

              {showSuggestions && (searchQuery || recentSearches.length > 0) && (
                <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 max-h-96 overflow-y-auto">
                  {recentSearches.length > 0 && !searchQuery && (
                    <div className="p-3 border-b border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Recent</span>
                        <button
                          onClick={clearRecentSearches}
                          className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
                        >
                          Clear All
                        </button>
                      </div>
                      {recentSearches.map((term, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setSearchQuery(term);
                            handleSearch(term);
                          }}
                          className="w-full text-left px-3 py-2.5 hover:bg-gray-50 rounded-lg flex items-center gap-3 group transition-colors"
                        >
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-gray-700 text-sm">{term}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {searchQuery && suggestions.length > 0 && (
                    <div className="p-3">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Suggestions</span>
                      {suggestions.map((term, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setSearchQuery(term);
                            handleSearch(term);
                          }}
                          className="w-full text-left px-3 py-2.5 hover:bg-blue-50 rounded-lg flex items-center gap-3 group transition-colors"
                        >
                          <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                          <span className="text-gray-700 text-sm font-medium">{term}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {searchQuery && suggestions.length === 0 && (
                    <div className="p-6 text-center text-gray-500">
                      <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <p className="text-sm">No suggestions found</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-1">
              <Link
                to="/account"
                className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg hover:bg-white/10 transition-all duration-300 group"
              >
                <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-xs font-semibold">Account</span>
              </Link>

              <Link
                to="/products"
                className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg hover:bg-white/10 transition-all duration-300 group"
              >
                <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <span className="text-xs font-semibold">Products</span>
              </Link>

              <Link
                to="/cart"
                className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg hover:bg-white/10 transition-all duration-300 group relative"
              >
                <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span className="text-xs font-semibold">Cart</span>
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                    {cartItems.length}
                  </span>
                )}
              </Link>

              <Link
                to="/orders"
                className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg hover:bg-white/10 transition-all duration-300 group"
              >
                <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-xs font-semibold">Orders</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm border-t border-slate-700/50">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between gap-4 overflow-x-auto scrollbar-hide">
              {categories.slice(1).map(category => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className={`flex flex-col items-center gap-2 px-4 py-2 rounded-xl hover:bg-white/10 transition-all duration-300 group flex-shrink-0 ${
                    selectedCategory === category.id ? 'bg-white/10 shadow-lg' : ''
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all duration-300 ${
                    selectedCategory === category.id 
                      ? 'bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg scale-110' 
                      : 'bg-slate-800 group-hover:bg-slate-700 group-hover:scale-105'
                  }`}>
                    {category.icon}
                  </div>
                  <span className="text-xs font-semibold text-center whitespace-nowrap">
                    {category.name}
                  </span>
                </button>
              ))}

              <Link
                to="/products"
                className="flex flex-col items-center gap-2 px-4 py-2 rounded-xl hover:bg-white/10 transition-all duration-300 group flex-shrink-0"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </div>
                <span className="text-xs font-semibold">View All</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="relative min-h-[580px] bg-cover bg-center overflow-hidden mb-8" style={{ backgroundImage: "url('/assets/feature-image.png')" }}>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/75 via-purple-600/70 to-pink-600/65"></div>
        
        <div className="relative max-w-7xl mx-auto px-8 py-16 flex items-center min-h-[580px]">
          <div className="text-white max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-400 to-pink-500 px-5 py-2.5 rounded-full text-sm font-bold mb-8 shadow-lg">
              <span className="w-2 h-2 bg-white rounded-full"></span>
              Student Exclusive Offer
            </div>
            
            <h1 className="text-6xl md:text-7xl font-black mb-5 leading-tight">
              No Codes.<br/>
              <span className="bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 bg-clip-text text-transparent">
                Just Savings.
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-10 text-white leading-relaxed">
              Automatic student discounts on everything.<br/>
              No hunting, no hassle, no expired coupons.
            </p>
            
            <div className="flex gap-4 mb-14">
              <Link to="/products" className="bg-white text-gray-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg">
                Shop Now →
              </Link>
              
              <Link to="/how-it-works" className="bg-white/20 backdrop-blur-sm border-2 border-white/40 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/30 transition-colors">
                Learn More
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl">
              <div className="flex items-center gap-3 bg-white/20 backdrop-blur-md rounded-xl p-4 border border-white/30">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <div className="font-bold text-base">Instant Discount</div>
                  <div className="text-white/80 text-sm">At Checkout</div>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/20 backdrop-blur-md rounded-xl p-4 border border-white/30">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="font-bold text-base">Never Expires</div>
                  <div className="text-white/80 text-sm">Always Active</div>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/20 backdrop-blur-md rounded-xl p-4 border border-white/30">
                <div className="w-12 h-12 bg-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="font-bold text-base">One-Time Setup</div>
                  <div className="text-white/80 text-sm">Set & Forget</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
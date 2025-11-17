import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';

export default function Navbar() {
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [user, setUser] = useState(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const searchRef = useRef(null);
  const userRef = useRef(null);
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
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
      if (userRef.current && !userRef.current.contains(event.target)) {
        setShowUserDropdown(false);
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

  const handleAccountClick = () => {
    if (user) {
      setShowUserDropdown(!showUserDropdown);
    } else {
      navigate('/login');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('user');
      setUser(null);
      setShowUserDropdown(false);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-50">
        <div className="relative bg-slate-950 border-b border-slate-800/50">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-600/5"></div>
          
          <div className="relative max-w-7xl mx-auto px-6 py-5">
            <div className="flex items-center justify-between gap-8 mb-6">
              
              <Link to="/" className="flex items-center gap-3 group">
                <img 
                  src="/assets/logo.png" 
                  alt="EzBuy Logo" 
                  className="w-11 h-11 group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'flex';
                  }}
                />
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2.5 rounded-xl shadow-lg group-hover:shadow-blue-500/50 transition-all duration-300 group-hover:scale-105" style={{display: 'none'}}>
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <div>
                  <span className="text-2xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    EzBuy
                  </span>
                  <p className="text-[9px] text-slate-500 font-bold tracking-widest -mt-1">STUDENT DEALS</p>
                </div>
              </Link>

              <div ref={searchRef} className="flex-1 max-w-2xl">
                <div className="relative">
                  <div className="absolute -inset-1 bg-white/10 rounded-full blur-lg"></div>
                  <div className="relative bg-white rounded-full shadow-2xl overflow-hidden border border-slate-200/50">
                    <div className="flex items-center">
                      
                      <div className="relative pl-6 pr-4 border-r border-slate-200">
                        <select
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="bg-transparent text-slate-900 font-bold cursor-pointer focus:outline-none appearance-none pr-8 py-4"
                        >
                          {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                          ))}
                        </select>
                        <svg className="w-4 h-4 text-slate-600 absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
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
                        placeholder="What do you need today?"
                        className="flex-1 px-6 py-4 text-slate-900 placeholder-slate-400 focus:outline-none font-semibold bg-transparent"
                      />

                      {searchQuery && (
                        <button onClick={() => { setSearchQuery(''); setSuggestions([]); }} className="px-3 text-slate-400 hover:text-slate-700">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}

                      <button onClick={() => handleSearch()} className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-full m-1.5 px-8 py-3 font-black transition-all duration-300 shadow-lg">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {showSuggestions && (searchQuery || recentSearches.length > 0) && (
                  <div className="absolute top-full mt-3 w-full bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-fadeIn z-50">
                    {recentSearches.length > 0 && !searchQuery && (
                      <div className="p-5 border-b border-slate-100">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-black text-slate-600 uppercase tracking-wider">Recent</span>
                          <button onClick={clearRecentSearches} className="text-xs text-orange-600 hover:text-orange-800 font-black">Clear</button>
                        </div>
                        {recentSearches.map((term, idx) => (
                          <button key={idx} onClick={() => { setSearchQuery(term); handleSearch(term); }} className="w-full text-left px-4 py-3 hover:bg-slate-50 rounded-xl flex items-center gap-3 mb-1 group">
                            <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-orange-100">
                              <svg className="w-4 h-4 text-slate-500 group-hover:text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <span className="text-slate-800 font-semibold">{term}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {searchQuery && suggestions.length > 0 && (
                      <div className="p-5">
                        <span className="text-xs font-black text-slate-600 uppercase tracking-wider block mb-3">Suggestions</span>
                        {suggestions.map((term, idx) => (
                          <button key={idx} onClick={() => { setSearchQuery(term); handleSearch(term); }} className="w-full text-left px-4 py-3 hover:bg-slate-50 rounded-xl flex items-center gap-3 mb-1 group">
                            <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-orange-100">
                              <svg className="w-4 h-4 text-slate-500 group-hover:text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                              </svg>
                            </div>
                            <span className="text-slate-800 font-semibold">{term}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {searchQuery && suggestions.length === 0 && (
                      <div className="p-8 text-center">
                        <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-slate-100 flex items-center justify-center">
                          <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                        <p className="text-sm font-bold text-slate-500">No results</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <div ref={userRef} className="relative">
                  <button onClick={handleAccountClick} className="group relative">
                    <div className="absolute inset-0 bg-white/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative w-12 h-12 bg-slate-800/50 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:bg-slate-700/50 transition-all">
                      <svg className="w-6 h-6 text-slate-300 group-hover:text-white group-hover:scale-110 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {user?.is_student && (
                        <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-slate-950"></span>
                      )}
                    </div>
                  </button>

                  {showUserDropdown && user && (
                    <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-50">
                      <div className="p-5 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-b border-slate-700">
                        <p className="font-bold text-white text-lg">{user.name}</p>
                        <p className="text-sm text-slate-400 mt-1">{user.email}</p>
                        {user.is_student && (
                          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-full">
                            <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                            </svg>
                            <span className="text-xs font-bold text-green-400">Student Member</span>
                          </div>
                        )}
                      </div>

                      <div className="py-2">
                        <Link
                          to="/orders"
                          onClick={() => setShowUserDropdown(false)}
                          className="flex items-center gap-3 px-5 py-3 hover:bg-slate-800 transition-colors text-slate-300 hover:text-white"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span className="text-sm font-semibold">My Orders</span>
                        </Link>

                        {user.is_student && (
                          <Link
                            to="/student-discount"
                            onClick={() => setShowUserDropdown(false)}
                            className="flex items-center gap-3 px-5 py-3 hover:bg-slate-800 transition-colors text-slate-300 hover:text-white"
                          >
                            <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z"/>
                            </svg>
                            <span className="text-sm font-semibold">Student Discounts</span>
                          </Link>
                        )}

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-5 py-3 hover:bg-red-500/10 transition-colors text-red-400"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          <span className="text-sm font-semibold">Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <Link to="/products" className="group relative">
                  <div className="absolute inset-0 bg-white/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative w-12 h-12 bg-slate-800/50 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:bg-slate-700/50 transition-all">
                    <svg className="w-6 h-6 text-slate-300 group-hover:text-white group-hover:scale-110 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                </Link>

                <Link to="/cart" className="group relative">
                  <div className="absolute inset-0 bg-white/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    {cartItems.length > 0 && (
                      <div className="absolute -top-1.5 -right-1.5 bg-white text-orange-600 text-xs font-black rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 shadow-lg border-2 border-slate-950">
                        {cartItems.length}
                      </div>
                    )}
                  </div>
                </Link>

                <Link to="/orders" className="group relative">
                  <div className="absolute inset-0 bg-white/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative w-12 h-12 bg-slate-800/50 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:bg-slate-700/50 transition-all">
                    <svg className="w-6 h-6 text-slate-300 group-hover:text-white group-hover:scale-110 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide pb-1">
              {categories.slice(1).map(category => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className={`group relative flex items-center gap-3 px-5 py-3 rounded-full transition-all flex-shrink-0 ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-white/10'
                      : 'bg-slate-800/50 backdrop-blur-sm text-slate-300 hover:bg-slate-700/50 hover:text-white'
                  }`}
                >
                  <span className="text-xl">{category.icon}</span>
                  <span className="text-sm font-bold whitespace-nowrap">{category.name}</span>
                </button>
              ))}

              <Link to="/products" className="group relative flex items-center gap-3 px-5 py-3 rounded-full bg-slate-800/50 backdrop-blur-sm text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                <span className="text-sm font-bold whitespace-nowrap">View All</span>
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
            
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Tired of hunting for discount codes that don't work? Get automatic 30% student discounts on every purchase. No codes needed.
            </p>
            
            <div className="flex gap-4 mb-14">
              <Link to="/products" className="bg-white text-gray-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg">
                Shop Now →
              </Link>
              
              <Link to="/student-discount" className="bg-white/20 backdrop-blur-sm border-2 border-white/40 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/30 transition-colors">
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
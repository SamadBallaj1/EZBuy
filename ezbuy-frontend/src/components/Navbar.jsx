import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <>
      <nav className="bg-[#3d5a80] text-white py-3 px-5 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-6">
          <Link to="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
            <img src="/assets/logo.png" alt="EzBuy" className="h-11 w-auto" />
            <span className="text-4xl font-black tracking-wide text-white translate-y-0.5" style={{ fontFamily: '"Segoe UI", Roboto, system-ui, sans-serif', fontWeight: '900' }}>
              EzBuy
            </span>
          </Link>

          <div className="flex-1 max-w-3xl flex gap-0 shadow-md rounded-lg overflow-hidden">
            <select className="px-4 py-2.5 text-sm bg-white text-gray-700 border-none focus:outline-none cursor-pointer">
              <option>All Categories</option>
              <option>Electronics</option>
              <option>Fashion</option>
              <option>Home & Kitchen</option>
              <option>Student Essentials</option>
            </select>
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search for products..."
                className="w-full px-4 py-2.5 text-sm text-gray-800 placeholder-gray-500 border-none focus:outline-none"
              />
              <button className="absolute right-0 top-0 h-full px-5 bg-orange-500 hover:bg-orange-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-6 flex-shrink-0">
            <Link to="/account" className="flex flex-col items-center hover:text-orange-400 transition-colors">
              <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-xs font-semibold">Account</span>
            </Link>

            <Link to="/products" className="flex flex-col items-center hover:text-orange-400 transition-colors">
              <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
              </svg>
              <span className="text-xs font-semibold">Products</span>
            </Link>

            <Link to="/cart" className="flex flex-col items-center hover:text-orange-400 transition-colors">
              <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
              <span className="text-xs font-semibold">Cart</span>
            </Link>

            <Link to="/orders" className="flex flex-col items-center hover:text-orange-400 transition-colors">
              <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
              </svg>
              <span className="text-xs font-semibold">Orders</span>
            </Link>
          </div>
        </div>
      </nav>

      <div className="bg-gray-100 border-b border-gray-300 py-4">
        <div className="max-w-7xl mx-auto px-5">
          <div className="flex justify-center items-center gap-8">
            <Link to="/category/electronics" className="flex flex-col items-center gap-2 hover:text-blue-600 transition-colors text-gray-700">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
              </svg>
              <span className="text-sm font-medium">Electronics</span>
            </Link>

            <Link to="/category/fashion" className="flex flex-col items-center gap-2 hover:text-blue-600 transition-colors text-gray-700">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              <span className="text-sm font-medium">Fashion</span>
            </Link>

            <Link to="/category/home" className="flex flex-col items-center gap-2 hover:text-blue-600 transition-colors text-gray-700">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
              <span className="text-sm font-medium">Home & Kitchen</span>
            </Link>

            <Link to="/category/student" className="flex flex-col items-center gap-2 hover:text-blue-600 transition-colors text-gray-700">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
              <span className="text-sm font-medium">Student Essentials</span>
            </Link>

            <Link to="/category/coffee" className="flex flex-col items-center gap-2 hover:text-blue-600 transition-colors text-gray-700">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
              </svg>
              <span className="text-sm font-medium">Coffee & Drinks</span>
            </Link>

            <Link to="/category/accessories" className="flex flex-col items-center gap-2 hover:text-blue-600 transition-colors text-gray-700">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
              </svg>
              <span className="text-sm font-medium">Accessories</span>
            </Link>

            <Link to="/products" className="flex flex-col items-center gap-2 hover:text-blue-600 transition-colors text-gray-700">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
              </svg>
              <span className="text-sm font-medium">All Products</span>
            </Link>
          </div>
        </div>
      </div>

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
import { createContext, useContext, useState, useEffect } from "react";
import { toast } from 'react-toastify';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('ezbuy-cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('ezbuy-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const normalizeProduct = (product) => {
    const studentPrice = parseFloat(product.student_price || product.studentPrice || 0);
    const regularPrice = parseFloat(product.price || 0);
    
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: studentPrice || regularPrice,
      originalPrice: regularPrice,
      studentPrice: studentPrice,
      imageUrl: product.image_url || product.imageUrl || product.images?.[0] || '/assets/placeholder.jpg',
      category: product.category_name || product.category || '',
      colors: product.colors || [],
      specs: product.specs || '',
    };
  };

  const addToCart = (product, quantity = 1) => {
    const normalized = normalizeProduct(product);
    
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === normalized.id);
      
      if (existing) {
        toast.success(
          <div className="flex items-center gap-2">
            <span className="text-2xl">✓</span>
            <div>
              <p className="font-bold">{normalized.name}</p>
              <p className="text-xs opacity-80">Quantity updated</p>
            </div>
          </div>,
          { className: 'toast-modern', autoClose: 2000 }
        );
        
        return prev.map((item) =>
          item.id === normalized.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      toast.success(
        <div className="flex items-center gap-2">
          <span className="text-2xl">🛒</span>
          <div>
            <p className="font-bold">{normalized.name}</p>
            <p className="text-xs opacity-80">Added to cart</p>
          </div>
        </div>,
        { className: 'toast-modern', autoClose: 2000 }
      );
      
      return [...prev, { ...normalized, quantity }];
    });
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(id);
      return;
    }
    
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (id) => {
    const item = cartItems.find(i => i.id === id);
    
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    
    if (item) {
      toast.info(
        <div className="flex items-center gap-2">
          <span className="text-2xl">🗑️</span>
          <div>
            <p className="font-bold">{item.name}</p>
            <p className="text-xs opacity-80">Removed from cart</p>
          </div>
        </div>,
        { className: 'toast-modern', autoClose: 2000 }
      );
    }
  };

  const clearCart = () => {
    setCartItems([]);
    toast.info('Cart cleared', { className: 'toast-modern' });
  };

  const getCartTotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const getItemCount = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{ 
        cartItems, 
        addToCart, 
        updateQuantity, 
        removeFromCart, 
        clearCart,
        getCartTotal,
        getItemCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
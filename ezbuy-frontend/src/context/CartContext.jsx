import { createContext, useContext, useState } from "react";
import { toast } from 'react-toastify';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const normalizeProduct = (product) => {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: parseFloat(product.price || product.studentPrice || 0),
      studentPrice: parseFloat(product.student_price || product.studentPrice || product.price || 0),
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
        toast.success(`✓ Updated ${normalized.name}`);
        return prev.map((item) =>
          item.id === normalized.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      toast.success(`✓ Added ${normalized.name}`);
      return [...prev, { ...normalized, quantity }];
    });
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (id) => {
    const item = cartItems.find(i => i.id === id);
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    toast.info(`Removed ${item?.name}`);
  };

  const clearCart = () => {
    setCartItems([]);
    toast.info('Cart cleared');
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, updateQuantity, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
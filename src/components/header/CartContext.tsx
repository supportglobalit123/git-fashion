'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface CartItem {
  id: number;
  image: string;
  title: string;
  price: number;
  quantity: number;
  active: boolean; // true = cart, false = wishlist
}

interface CartContextProps {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  addToWishlist: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  updateItemQuantity: (id: number, quantity: number) => void;
  isCartLoaded: boolean;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

// Derive a stable numeric id from the item's image + title so that adding the
// same product from different places (grid, list, detail modal) merges into a
// single cart line instead of creating duplicates.
const stableId = (input: string): number => {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 31 + input.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
};

const normalizeItem = (item: CartItem): CartItem => ({
  ...item,
  id: stableId(`${item.image}|${item.title}`),
});

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartLoaded, setIsCartLoaded] = useState(false);

  // Load from localStorage on first mount
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        const parsed = JSON.parse(storedCart);
        if (Array.isArray(parsed)) {
          setCartItems(parsed);
        } else {
          localStorage.removeItem('cart');
        }
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error);
        localStorage.removeItem('cart');
      }
    }
    setIsCartLoaded(true);
  }, []);

  // Save to localStorage whenever cart changes
  useEffect(() => {
    if (isCartLoaded) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isCartLoaded]);

  // Add item to cart (active: true)
  const addToCart = (item: CartItem) => {
    const normalized = normalizeItem(item);
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === normalized.id && i.active === true);
      if (existing) {
        return prev.map((i) =>
          i.id === normalized.id && i.active === true
            ? { ...i, quantity: i.quantity + normalized.quantity }
            : i
        );
      } else {
        return [...prev, normalized];
      }
    });
  };

  // Add item to wishlist (active: false)
  const addToWishlist = (item: CartItem) => {
    const normalized = normalizeItem(item);
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === normalized.id && i.active === false);
      if (existing) {
        return prev.map((i) =>
          i.id === normalized.id && i.active === false
            ? { ...i, quantity: i.quantity + normalized.quantity }
            : i
        );
      } else {
        return [...prev, normalized];
      }
    });
  };

  // Remove item by ID
  const removeFromCart = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Update quantity (cart or wishlist)
  const updateItemQuantity = (id: number, quantity: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        addToWishlist,
        removeFromCart,
        updateItemQuantity,
        isCartLoaded,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

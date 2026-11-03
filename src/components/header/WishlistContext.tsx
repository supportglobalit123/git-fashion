'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface WishlistItem {
  id: number;
  image: string;
  title: string;
  price: number;
  quantity: number;
}

interface WishlistContextProps {
  wishlistItems: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: number) => void;
  updateItemQuantity: (id: number, quantity: number) => void;
  isWishlistLoaded: boolean;
}

const WishlistContext = createContext<WishlistContextProps | undefined>(undefined);

const stableId = (input: string): number => {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 31 + input.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
};

export const useWishlist = (): WishlistContextProps => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isWishlistLoaded, setIsWishlistLoaded] = useState(false);

  // Load from localStorage on first mount
  useEffect(() => {
    const storedWishlist = localStorage.getItem('wishlist');
    if (storedWishlist) {
      try {
        const parsed = JSON.parse(storedWishlist);
        if (Array.isArray(parsed)) {
          setWishlistItems(parsed);
        } else {
          localStorage.removeItem('wishlist');
        }
      } catch (error) {
        console.error('Failed to parse wishlist from localStorage:', error);
        localStorage.removeItem('wishlist');
      }
    }
    setIsWishlistLoaded(true);
  }, []);

  // Save to localStorage whenever wishlist changes
  useEffect(() => {
    if (isWishlistLoaded) {
      localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
    }
  }, [wishlistItems, isWishlistLoaded]);

  // Add to wishlist (no duplicates) — id derived from image + title so the same
  // product added from any component is recognised as one entry.
  const addToWishlist = (item: WishlistItem) => {
    const normalized = {
      ...item,
      id: stableId(`${item.image}|${item.title}`),
    };
    setWishlistItems((prev) => {
      const existing = prev.find((i) => i.id === normalized.id);
      if (existing) return prev;
      return [...prev, normalized];
    });
  };

  // Remove from wishlist
  const removeFromWishlist = (id: number) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Update quantity
  const updateItemQuantity = (id: number, quantity: number) => {
    setWishlistItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        updateItemQuantity,
        isWishlistLoaded,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { MenuItem, OrderItem, Coupon, AdminSettings, dbService } from '@/lib/db';

interface CartContextType {
  cart: OrderItem[];
  addToCart: (item: MenuItem, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  coupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  notes: string;
  setNotes: (notes: string) => void;
  timeSlot: string;
  setTimeSlot: (slot: string) => void;
  subtotal: number;
  deliveryCharge: number;
  tax: number;
  discount: number;
  total: number;
  settings: AdminSettings;
  refreshSettings: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [notes, setNotes] = useState<string>('');
  const [timeSlot, setTimeSlot] = useState<string>('Afternoon (12:00 PM - 2:00 PM)');
  const [settings, setSettings] = useState<AdminSettings>({
    isAcceptingOrders: true,
    announcementText: '',
    deliveryCharge: 30,
    freeDeliveryAbove: 299,
    taxPercent: 5
  });

  // Load settings on mount
  useEffect(() => {
    refreshSettings();
    // Load persisted cart
    const savedCart = localStorage.getItem('tirth_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Error parsing saved cart:', e);
      }
    }
  }, []);

  const refreshSettings = async () => {
    const s = await dbService.getSettings();
    setSettings(s);
  };

  // Persist cart changes
  const saveCartState = (newCart: OrderItem[]) => {
    setCart(newCart);
    localStorage.setItem('tirth_cart', JSON.stringify(newCart));
  };

  const addToCart = (item: MenuItem, quantity = 1) => {
    const existingIndex = cart.findIndex(i => i.menuItem.id === item.id);
    let newCart = [...cart];
    
    if (existingIndex !== -1) {
      newCart[existingIndex].quantity += quantity;
    } else {
      newCart.push({ menuItem: item, quantity });
    }
    saveCartState(newCart);
  };

  const removeFromCart = (itemId: string) => {
    const newCart = cart.filter(i => i.menuItem.id !== itemId);
    saveCartState(newCart);
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    const newCart = cart.map(i => 
      i.menuItem.id === itemId ? { ...i, quantity } : i
    );
    saveCartState(newCart);
  };

  const clearCart = () => {
    saveCartState([]);
    setCoupon(null);
    setNotes('');
  };

  const applyCoupon = (code: string) => {
    const calcSubtotal = cart.reduce((sum, i) => sum + i.menuItem.price * i.quantity, 0);
    const validation = dbService.validateCoupon(code, calcSubtotal);
    
    if (validation.valid && validation.coupon) {
      setCoupon(validation.coupon);
      return { success: true, message: 'Coupon applied successfully!' };
    } else {
      setCoupon(null);
      return { success: false, message: validation.error || 'Failed to apply coupon.' };
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
  };

  // State calculations
  const subtotal = cart.reduce((sum, i) => sum + i.menuItem.price * i.quantity, 0);
  
  const discount = coupon 
    ? Math.min((subtotal * coupon.discountPercent) / 100, coupon.maxDiscount) 
    : 0;

  const deliveryCharge = subtotal >= settings.freeDeliveryAbove || subtotal === 0
    ? 0 
    : settings.deliveryCharge;

  const tax = 0; // Forced to 0 as requested by the user
  const total = subtotal - discount + deliveryCharge;

  // Auto-remove or validate coupon if cart items change
  useEffect(() => {
    if (coupon && subtotal < coupon.minOrder) {
      setCoupon(null);
    }
  }, [subtotal, coupon]);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      coupon,
      applyCoupon,
      removeCoupon,
      notes,
      setNotes,
      timeSlot,
      setTimeSlot,
      subtotal,
      deliveryCharge,
      tax,
      discount,
      total,
      settings,
      refreshSettings
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

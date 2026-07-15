'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useCart } from '@/context/CartContext';
import { dbService, Order } from '@/lib/db';
import { geocodeAddress, getDeliveryCharge, getRoadDistance, getDeliveryChargeForDistance, DEFAULT_DELIVERY_CHARGE } from '@/lib/delivery';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  Clock, 
  FileText, 
  MapPin, 
  Phone, 
  User, 
  CreditCard,
  CheckCircle,
  Sparkles,
  ArrowRight,
  Info,
  Smartphone
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CartPage() {
  const { 
    cart, 
    updateQuantity, 
    removeFromCart, 
    clearCart,
    subtotal, 
    discount, 
    deliveryCharge, 
    tax, 
    total, 
    coupon, 
    applyCoupon, 
    removeCoupon,
    notes,
    setNotes,
    timeSlot,
    setTimeSlot,
    settings
  } = useCart();

  // Checkout form details
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card'>('UPI');
  
  // Coupon input
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);

  // checkout states
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'idle' | 'processing' | 'success'>('idle');
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  // Time Slots
  const timeSlots = [
    'Afternoon (12:00 PM - 2:00 PM)',
    'Evening (7:30 PM - 9:30 PM)'
  ];

  // Load User Info on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setName(localStorage.getItem('tirth_user_name') || '');
      setPhone(localStorage.getItem('tirth_user_phone') || '');
      setAddress(localStorage.getItem('tirth_user_address') || '');
    }
  }, []);

  // Local dynamic delivery charge state based on distance from Dhayari
  const [localDeliveryCharge, setLocalDeliveryCharge] = useState(DEFAULT_DELIVERY_CHARGE);
  const [localDistance, setLocalDistance] = useState<number | null>(null);
  const [localZone, setLocalZone] = useState('0 to 7 km');
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    if (!address || address.length < 10) {
      setLocalDeliveryCharge(DEFAULT_DELIVERY_CHARGE);
      setLocalDistance(null);
      setLocalZone('0 to 7 km');
      return;
    }

    const timer = setTimeout(async () => {
      setIsCalculating(true);
      try {
        const coords = await geocodeAddress(address);
        if (coords) {
          // Calculate actual road distance (OSRM with haversine fallback)
          const roadDist = await getRoadDistance(coords.lat, coords.lng);
          const result = getDeliveryChargeForDistance(roadDist);
          setLocalDeliveryCharge(result.charge);
          setLocalDistance(result.distanceKm);
          setLocalZone(result.zone);
        } else {
          setLocalDeliveryCharge(DEFAULT_DELIVERY_CHARGE);
          setLocalDistance(null);
          setLocalZone('Within 7 km (estimated)');
        }
      } catch {
        setLocalDeliveryCharge(DEFAULT_DELIVERY_CHARGE);
        setLocalDistance(null);
      }
      setIsCalculating(false);
    }, 1500); // 1.5s debounce

    return () => clearTimeout(timer);
  }, [address]);

  // Local delivery calculations
  const finalDeliveryCharge = (subtotal === 0 || subtotal >= settings.freeDeliveryAbove) ? 0 : localDeliveryCharge;
  const finalTotal = subtotal - discount + finalDeliveryCharge;

  // Save User Info on input change
  const saveUserInfo = (n: string, p: string, a: string) => {
    localStorage.setItem('tirth_user_name', n);
    localStorage.setItem('tirth_user_phone', p);
    localStorage.setItem('tirth_user_address', a);
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    if (!couponInput.trim()) return;

    const res = applyCoupon(couponInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponInput('');
    }
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    // Validate details
    if (!name.trim() || !phone.trim() || !address.trim()) {
      alert('Please fill out all delivery details!');
      return;
    }

    saveUserInfo(name, phone, address);
    setIsProcessing(true);
    setPaymentStep('processing');

    // Simulate Razorpay UPI SDK loading & payment confirmation (1.8s)
    await new Promise(resolve => setTimeout(resolve, 1800));

    // Save order in local DB
    const orderData = {
      customerName: name,
      customerPhone: phone,
      customerAddress: address,
      customerNotes: notes,
      items: cart,
      subtotal,
      deliveryCharge: finalDeliveryCharge,
      tax,
      discount,
      total: finalTotal,
      paymentMethod,
      timeSlot,
      paymentId: 'pay_RZR_' + Math.random().toString(36).substr(2, 9).toUpperCase()
    };

    const newOrder = await dbService.createOrder(orderData);
    setCreatedOrder(newOrder);
    setPaymentStep('success');
    setIsProcessing(false);

    // Trigger explosive success confetti!
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 }
    });

    // Fire automatic WhatsApp notifications to both customer and admin in the background
    try {
      await fetch('/api/whatsapp/send-receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: newOrder, adminPhone: '8380070757' })
      });
    } catch (err) {
      console.error('Automated WhatsApp send failed:', err);
    }

    clearCart();
  };

  // Build structured WhatsApp Web Link pre-filling the complete dabba order receipt!
  const getWhatsAppLink = (order: Order) => {
    const space = '%20';
    const newline = '%0A';
    
    let itemsText = '';
    order.items.forEach(i => {
      itemsText += `•${space}${i.menuItem.name}${space}x${space}${i.quantity}${space}(₹${i.menuItem.price * i.quantity})${newline}`;
    });

    const message = `*तीर्थ${space}–${space}The${space}Food${space}Studio*${newline}` +
                    `*ORDER${space}CONFIRMED!*${newline}${newline}` +
                    `*Order${space}ID:*${space}${order.id}${newline}` +
                    `*Customer:*${space}${order.customerName}${newline}` +
                    `*Phone:*${space}${order.customerPhone}${newline}` +
                    `*Delivery${space}Slot:*${space}${order.timeSlot}${newline}` +
                    `*Notes:*${space}${order.customerNotes || 'None'}${newline}${newline}` +
                    `*Items:*${newline}${itemsText}${newline}` +
                    `*Grand${space}Total:*${space}₹${order.total}${space}(Paid${space}via${space}${order.paymentMethod})${newline}${newline}` +
                    `*Delivery${space}Address:*${space}${order.customerAddress}${newline}${newline}` +
                    `Thank${space}you!${space}Please${space}prepare${space}my${space}fresh${space}Satvik${space}dabba!${space}🙏`;

    return `https://api.whatsapp.com/send?phone=918380070757&text=${message}`;
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gradient-to-b from-cream-light via-background to-cream-dark py-10 pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 select-none">
          
          <h1 className="font-yatra font-black text-3xl text-leaf-dark mb-8 flex items-center gap-2">
            <ShoppingBag className="w-8 h-8 text-saffron" /> Shopping Cart
          </h1>

          {cart.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* LEFT: CART ITEMS LIST & CUSTOM CHECKS (8 cols) */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Cart list card */}
                <div className="bg-white border border-leaf-light/10 p-5 rounded-3xl shadow-sm">
                  <h3 className="font-yatra font-bold text-base text-leaf-dark border-b border-leaf-light/10 pb-3 mb-4">
                    Your Selection
                  </h3>

                  <div className="divide-y divide-leaf-light/10">
                    {cart.map((item) => (
                      <div key={item.menuItem.id} className="py-4 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                        <div className="flex items-center gap-3">
                          {/* Item Thumbnail */}
                          <img
                            src={item.menuItem.imageUrl}
                            alt={item.menuItem.name}
                            className="w-16 h-16 object-cover rounded-xl border border-leaf-light/10 shadow-sm shrink-0"
                          />
                          <div>
                            <span className="text-[10px] font-bold text-saffron leading-none block">
                              {item.menuItem.nameDevnagari}
                            </span>
                            <h4 className="font-outfit font-bold text-sm text-charcoal leading-tight">
                              {item.menuItem.name}
                            </h4>
                            <p className="text-[11px] text-charcoal/50 font-bold mt-0.5">
                              ₹{item.menuItem.price} <span className="font-normal text-charcoal/40">each</span>
                            </p>
                          </div>
                        </div>

                        {/* Quantity Controller & Delete */}
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2.5 bg-cream border border-leaf-light/10 p-1.5 rounded-full shadow-inner scale-90">
                            <button
                              onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
                              className="p-1 bg-white text-charcoal rounded-full shadow-sm cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="font-outfit font-bold text-xs text-charcoal w-3 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
                              className="p-1 bg-leaf text-white rounded-full cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.menuItem.id)}
                            className="p-2 text-charcoal/40 hover:text-rose-500 rounded-full hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4 text-charcoal/40" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery Time Slot Picker */}
                <div className="bg-white border border-leaf-light/10 p-5 rounded-3xl shadow-sm">
                  <h3 className="font-yatra font-bold text-base text-leaf-dark border-b border-leaf-light/10 pb-3 mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-saffron" /> Delivery Time Slot
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {timeSlots.map((slot) => {
                      const isSelected = timeSlot === slot;
                      const slotLabel = slot.includes('Afternoon') 
                        ? 'Afternoon (12:00 PM - 2:00 PM)' 
                        : 'Evening (7:30 PM - 9:30 PM)';
                      return (
                        <button
                          key={slot}
                          onClick={() => setTimeSlot(slot)}
                          className={`p-3 text-xs font-semibold rounded-2xl border text-center transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-leaf-light/10 text-leaf border-leaf font-bold shadow-inner'
                              : 'bg-cream text-charcoal/80 border-leaf-light/10 hover:border-leaf-light/30'
                          }`}
                        >
                          {slotLabel}
                        </button>
                      );
                    })}
                  </div>
                  <span className="text-[10px] text-charcoal/40 leading-relaxed font-semibold mt-2.5 flex items-center gap-1">
                    <Info className="w-3.5 h-3.5 text-saffron shrink-0" />
                     Afternoon orders dispatch by 11:30 AM. Evening dabbas go out at 7:00 PM.
                  </span>
                </div>

                {/* Chef delivery instruction note */}
                <div className="bg-white border border-leaf-light/10 p-5 rounded-3xl shadow-sm">
                  <h3 className="font-yatra font-bold text-base text-leaf-dark border-b border-leaf-light/10 pb-3 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-saffron" /> Special Delivery Instructions
                  </h3>
                  <textarea
                    placeholder="E.g. Medium spicy, no onion-garlic, extra garlic chutney..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-3 bg-cream border border-leaf-light/20 focus:border-leaf rounded-2xl text-xs font-semibold shadow-inner min-h-[80px]"
                  />
                </div>
              </div>

              {/* RIGHT: CHECKOUT FORMS & BILL SUMMARY (4 cols) */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Delivery details form */}
                <div className="bg-white border border-leaf-light/10 p-5 rounded-3xl shadow-sm">
                  <h3 className="font-yatra font-bold text-base text-leaf-dark border-b border-leaf-light/10 pb-3 mb-4">
                    Delivery Details
                  </h3>

                  <form onSubmit={handleCheckout} className="space-y-3.5">
                    {/* Name */}
                    <div>
                      <label className="text-[10px] text-charcoal/40 uppercase font-semibold block mb-1 leading-none">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/30" />
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => { setName(e.target.value); saveUserInfo(e.target.value, phone, address); }}
                          placeholder="Enter customer name"
                          className="w-full pl-10 p-2.5 bg-cream border border-leaf-light/10 focus:border-leaf rounded-xl text-xs font-semibold"
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="text-[10px] text-charcoal/40 uppercase font-semibold block mb-1 leading-none">Phone / WhatsApp</label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/30" />
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => { setPhone(e.target.value); saveUserInfo(name, e.target.value, address); }}
                          placeholder="E.g. 8380070757"
                          className="w-full pl-10 p-2.5 bg-cream border border-leaf-light/10 focus:border-leaf rounded-xl text-xs font-semibold"
                        />
                      </div>
                    </div>

                    {/* Address */}
                    <div>
                      <label className="text-[10px] text-charcoal/40 uppercase font-semibold block mb-1 leading-none">Delivery Address</label>
                      <div className="relative">
                        <MapPin className="absolute left-3.5 top-2.5 w-4 h-4 text-charcoal/30" />
                        <textarea
                          required
                          value={address}
                          onChange={(e) => { setAddress(e.target.value); saveUserInfo(name, phone, e.target.value); }}
                          placeholder="House no, Building name, Society, Area, Pune"
                          className="w-full pl-10 p-2.5 bg-cream border border-leaf-light/10 focus:border-leaf rounded-xl text-xs font-semibold min-h-[70px]"
                        />
                      </div>
                    </div>

                    {/* Payment selection */}
                    <div className="pt-2 border-t border-leaf-light/5">
                      <label className="text-[10px] text-charcoal/40 uppercase font-semibold block mb-1 leading-none">Payment Method</label>
                      <div className="grid grid-cols-2 gap-2">
                        {(['UPI', 'Card'] as const).map((method) => {
                          const isSelected = paymentMethod === method;
                          return (
                            <button
                              key={method}
                              type="button"
                              onClick={() => setPaymentMethod(method)}
                              className={`p-2.5 text-[10px] font-bold rounded-xl border text-center transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-saffron text-white border-saffron shadow-sm shadow-saffron/10'
                                  : 'bg-cream text-charcoal border-leaf-light/10 hover:border-leaf-light/25'
                              }`}
                            >
                              {method === 'UPI' ? 'UPI / Google Pay' : 'Razorpay Card'}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </form>
                </div>

                {/* Coupon Code Redemption */}
                <div className="bg-white border border-leaf-light/10 p-5 rounded-3xl shadow-sm">
                  <h3 className="font-yatra font-bold text-base text-leaf-dark border-b border-leaf-light/10 pb-3 mb-4">
                    Have a Coupon Code?
                  </h3>

                  {coupon ? (
                    <div className="flex items-center justify-between bg-leaf-light/10 p-2 px-3 rounded-2xl border border-leaf">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-saffron" />
                        <div>
                          <span className="text-[10px] font-extrabold text-leaf uppercase">{coupon.code} Applied!</span>
                          <p className="text-[9px] text-charcoal/60 leading-none">Coupon discount applied.</p>
                        </div>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-xs font-bold text-rose-500 hover:text-rose-700 bg-white p-1 px-2.5 rounded-xl border cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder="E.g. SATVIK10"
                        className="w-full p-2.5 bg-cream border border-leaf-light/15 focus:border-leaf rounded-xl text-xs font-bold uppercase shadow-inner"
                      />
                      <button
                        type="submit"
                        className="p-2.5 px-4 bg-leaf hover:bg-leaf-dark text-white text-xs font-bold rounded-xl shrink-0 cursor-pointer"
                      >
                        Apply
                      </button>
                    </form>
                  )}

                  {couponError && (
                    <p className="text-[10px] text-rose-500 font-bold mt-1.5 flex items-center gap-1">
                      ⚠️ {couponError}
                    </p>
                  )}
                </div>

                {/* Final Bill calculations summary card */}
                <div className="bg-white border border-leaf-light/10 p-5 rounded-3xl shadow-md">
                  <h3 className="font-yatra font-bold text-base text-leaf-dark border-b border-leaf-light/10 pb-3 mb-4">
                    Bill Summary
                  </h3>

                  <div className="space-y-2.5 text-xs border-b border-leaf-light/10 pb-4 mb-4">
                    <div className="flex justify-between text-charcoal/70 font-semibold">
                      <span>Subtotal</span>
                      <span className="font-outfit text-charcoal font-bold">₹{subtotal}</span>
                    </div>

                    {discount > 0 && (
                      <div className="flex justify-between text-emerald-600 font-bold">
                        <span>Coupon Discount ({coupon?.code})</span>
                        <span className="font-outfit">-₹{discount}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-charcoal/70 font-semibold items-center">
                      <div>
                        <span>Delivery Charge</span>
                        {localDistance !== null && finalDeliveryCharge > 0 && (
                          <span className="block text-[8px] font-bold text-charcoal/40 -mt-0.5">
                            {localZone} ({localDistance} km from Dhayari)
                          </span>
                        )}
                      </div>
                      <span className="font-outfit text-charcoal font-bold">
                        {isCalculating ? (
                          <span className="text-[10px] text-charcoal/30 animate-pulse uppercase">Calculating...</span>
                        ) : finalDeliveryCharge === 0 ? (
                          <span className="text-leaf uppercase font-bold text-[10px]">
                            {subtotal >= settings.freeDeliveryAbove ? 'FREE (Order > ₹299)' : 'FREE'}
                          </span>
                        ) : (
                          `₹${finalDeliveryCharge}`
                        )}
                      </span>
                    </div>

                  </div>

                  {/* Grand total */}
                  <div className="flex justify-between items-center mb-6">
                    <span className="font-outfit font-extrabold text-base text-charcoal">Grand Total</span>
                    <span className="font-outfit font-black text-2xl text-saffron">₹{finalTotal}</span>
                  </div>

                  {/* Place Order CTA */}
                  <button
                    onClick={handleCheckout}
                    className="w-full p-4 bg-gradient-to-r from-saffron to-saffron-light hover:scale-[1.02] active:scale-95 text-white text-sm font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-saffron/20 border border-brass/10 transition-all cursor-pointer"
                  >
                    Place Order & Pay ₹{total} <ArrowRight className="w-4.5 h-4.5" />
                  </button>
                </div>
              </div>

            </div>
          ) : (
            /* EMPTY BASKET FALLBACK */
            <div className="satvik-card bg-white p-12 text-center flex flex-col items-center justify-center max-w-md mx-auto border-dashed border-2 border-leaf-light/20 mt-10">
              <ShoppingBag className="w-12 h-12 text-saffron mb-4 animate-bounce" />
              <h3 className="font-yatra font-bold text-lg text-leaf-dark tracking-tight">Your Tiffin Box is Empty</h3>
              <p className="text-xs text-charcoal/60 mt-1 max-w-xs leading-relaxed">
                Add Puranpoli or Maharashtrian Thali to your cart and enjoy a homely meal!
              </p>
              <Link
                href="/order"
                className="mt-6 p-3 px-6 bg-leaf hover:bg-leaf-dark text-white text-xs font-bold rounded-full flex items-center gap-2 transition-colors shadow-md shadow-leaf/10 cursor-pointer"
              >
                Go to Menu <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </main>

      {/* RAZORPAY UPI SIMULATION MODAL & SUCCESS MODAL */}
      {paymentStep !== 'idle' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-cream-light satvik-card border-2 border-brass/30 max-w-md w-full overflow-hidden shadow-2xl relative animate-fade-in p-6 text-center">
            
            {/* 1. Loader Processing State */}
            {paymentStep === 'processing' && (
              <div className="py-8">
                <div className="w-16 h-16 border-4 border-leaf border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                <h3 className="font-yatra font-black text-xl text-leaf-dark tracking-tight">
                  Processing Razorpay UPI Payment
                </h3>
                <p className="text-xs text-charcoal/50 mt-1.5 font-bold flex items-center justify-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-saffron" /> Opening payment gateway...
                </p>
                <div className="bg-white p-3.5 rounded-2xl border border-leaf-light/10 max-w-xs mx-auto mt-6 text-left shadow-inner">
                  <span className="text-[9px] font-bold text-charcoal/30 uppercase leading-none block">Checkout ID</span>
                  <span className="text-xs font-bold text-charcoal">tirth_pay_upi_rzr_checkout_sim</span>
                  <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-leaf-light/5 text-xs">
                    <span className="font-semibold text-charcoal/60">Total Amount:</span>
                    <span className="font-outfit font-extrabold text-saffron">₹{total}</span>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Success Modal Details State */}
            {paymentStep === 'success' && createdOrder && (
              <div className="py-2">
                <div className="w-16 h-16 bg-leaf/10 text-leaf rounded-full flex items-center justify-center mx-auto mb-4 border border-leaf shadow-inner">
                  <CheckCircle className="w-8 h-8 text-leaf" />
                </div>
                
                <span className="p-1 px-3 bg-leaf/10 text-leaf text-[9px] font-bold tracking-widest uppercase rounded-full mb-2 inline-block">
                  Order Confirmed!
                </span>
                
                <h3 className="font-yatra font-black text-2xl text-charcoal tracking-tight leading-none mb-1">
                  Thank You!
                </h3>
                <p className="text-[10px] font-bold text-saffron tracking-wide">
                  Order ID: {createdOrder.id}
                </p>

                <div className="bg-white border border-leaf-light/15 p-4 rounded-2xl my-5 text-left text-xs space-y-2 max-h-[160px] overflow-y-auto">
                  <span className="font-bold text-charcoal block border-b pb-1.5 mb-1 text-[10px] uppercase text-charcoal/40">Order Receipt</span>
                  {createdOrder.items.map((i) => (
                    <div key={i.menuItem.id} className="flex justify-between text-charcoal/80 font-medium">
                      <span>{i.menuItem.name} (x{i.quantity})</span>
                      <span className="font-outfit font-bold">₹{i.menuItem.price * i.quantity}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 mt-2 flex justify-between font-bold text-charcoal text-[13px]">
                    <span>Total Paid</span>
                    <span className="font-outfit text-saffron">₹{createdOrder.total}</span>
                  </div>
                </div>

                <div className="p-3 bg-saffron/10 border border-saffron/20 rounded-2xl text-left text-[11px] text-charcoal/80 leading-relaxed mb-6">
                  📢 **Important Step**: Click the green button below to send your receipt on WhatsApp to confirm your order!
                </div>

                {/* WhatsApp Link builder & Restart options */}
                <div className="flex flex-col gap-3">
                  <a
                    href={getWhatsAppLink(createdOrder)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 text-xs cursor-pointer"
                  >
                    Confirm Order on WhatsApp <ArrowRight className="w-4 h-4" />
                  </a>

                  <button
                    onClick={() => setPaymentStep('idle')}
                    className="p-3 text-xs text-charcoal/50 font-bold hover:text-charcoal hover:underline cursor-pointer"
                  >
                    Back to Menu
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
}

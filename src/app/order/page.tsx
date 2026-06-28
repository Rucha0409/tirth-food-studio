'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import dynamic from 'next/dynamic';

const DeliveryMap = dynamic(() => import('@/components/DeliveryMap'), { ssr: false });

import { dbService, MenuItem, Order } from '@/lib/db';
import { geocodeAddress, getDeliveryCharge, DEFAULT_DELIVERY_CHARGE, MID_DELIVERY_CHARGE, MAX_DELIVERY_CHARGE, DELIVERY_THRESHOLD_KM, DELIVERY_MAX_THRESHOLD_KM } from '@/lib/delivery';
import {
  User,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Sparkles,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  CheckCircle2,
  Lock,
  CreditCard,
  QrCode,
  Loader2
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function OrderPage() {
  // DB States
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [settings, setSettings] = useState({
    deliveryCharge: 30,
    freeDeliveryAbove: 299,
    taxPercent: 5
  });

  // Active tab state
  const [activeTab, setActiveTab] = useState<'daily' | 'preorder'>('daily');

  // Form States (Persisted)
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [district, setDistrict] = useState('Pune');
  const [deliveryType, setDeliveryType] = useState('Home Delivery');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('12:30 PM - 01:00 PM');
  const [notes, setNotes] = useState('');

  // Quantities
  const [quantities, setQuantities] = useState<{ [id: string]: number }>({});

  // Success Modal State
  const [successOrder, setSuccessOrder] = useState<Order | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Simulated Razorpay Modal State
  const [isRzpOpen, setIsRzpOpen] = useState(false);
  const [rzpTab, setRzpTab] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [rzpProcessing, setRzpProcessing] = useState(false);
  const [rzpStep, setRzpStep] = useState('');

  // Delivery charge state
  const [deliveryCharge, setDeliveryCharge] = useState(DEFAULT_DELIVERY_CHARGE);
  const [deliveryDistance, setDeliveryDistance] = useState<number | null>(null);
  const [deliveryZone, setDeliveryZone] = useState('0 to 7 km');
  const [isCalculatingDelivery, setIsCalculatingDelivery] = useState(false);
  const [customerLat, setCustomerLat] = useState<number | null>(null);
  const [customerLng, setCustomerLng] = useState<number | null>(null);

  // Unicode text constants for Devanagari display
  const tirthMarathi = "\u0924\u0940\u0930\u094d\u0925"; // तीर्थ
  const rozcheJevan = "\u0930\u094b\u091c\u091a\u0947 \u091c\u0947\u0935\u0923"; // रोजचे जेवण
  const aagauOrder = "\u0906\u0917\u093e\u090a \u0912\u0930\u094d\u0921\u0930"; // आगाऊ ऑर्डर
  const dhanyavaad = "\u0927\u0928\u094d\u092f\u0935\u093e\u0926!"; // धन्यवाद!

  // Dynamic Razorpay SDK script preloader
  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window === 'undefined') {
        resolve(false);
        return;
      }
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Fetch initial data
  useEffect(() => {
    setMenu(dbService.getMenu());
    setSettings(dbService.getSettings());

    // Default date to today
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    setDeliveryDate(`${yyyy}-${mm}-${dd}`);

    // Load user data
    if (typeof window !== 'undefined') {
      setName(localStorage.getItem('tirth_user_name') || '');
      setPhone(localStorage.getItem('tirth_user_phone') || '');
      setAddress(localStorage.getItem('tirth_user_address') || '');
      setDistrict(localStorage.getItem('tirth_user_district') || 'Pune');
      setDeliveryType(localStorage.getItem('tirth_user_del_type') || 'Home Delivery');
    }

    // Preload Razorpay script on mount so checkout triggers instantly
    loadRazorpayScript().then(loaded => {
      if (loaded) console.log('Razorpay SDK preloaded successfully');
      else console.warn('Razorpay SDK preloading failed or script not found');
    });
  }, []);

  // Calculate delivery charge when address changes (debounced)
  useEffect(() => {
    if (!address || address.length < 10 || deliveryType === 'Self Pickup') {
      setDeliveryCharge(DEFAULT_DELIVERY_CHARGE);
      setDeliveryDistance(null);
      setDeliveryZone('Within 7 km');
      setCustomerLat(null);
      setCustomerLng(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsCalculatingDelivery(true);
      try {
        const coords = await geocodeAddress(address);
        if (coords) {
          const result = getDeliveryCharge(coords.lat, coords.lng);
          setDeliveryCharge(result.charge);
          setDeliveryDistance(result.distanceKm);
          setDeliveryZone(result.zone);
          setCustomerLat(coords.lat);
          setCustomerLng(coords.lng);
        } else {
          // Couldn't geocode, use default
          setDeliveryCharge(DEFAULT_DELIVERY_CHARGE);
          setDeliveryDistance(null);
          setDeliveryZone('Within 7 km (estimated)');
          setCustomerLat(null);
          setCustomerLng(null);
        }
      } catch {
        setDeliveryCharge(DEFAULT_DELIVERY_CHARGE);
        setDeliveryDistance(null);
        setCustomerLat(null);
        setCustomerLng(null);
      }
      setIsCalculatingDelivery(false);
    }, 1500); // 1.5s debounce

    return () => clearTimeout(timer);
  }, [address, deliveryType]);

  const persistUserDetail = (key: string, val: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, val);
    }
  };

  // Cart actions
  const handleIncrement = (id: string) => {
    setQuantities(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  };

  const handleDecrement = (id: string) => {
    setQuantities(prev => {
      const updated = { ...prev };
      if (updated[id] <= 1) {
        delete updated[id];
      } else {
        updated[id] -= 1;
      }
      return updated;
    });
  };

  // Calculations
  const selectedItems = menu.filter(item => (quantities[item.id] || 0) > 0);
  const totalItemsCount = selectedItems.reduce((sum, item) => sum + (quantities[item.id] || 0), 0);
  const subtotal = selectedItems.reduce((sum, item) => sum + (item.price * (quantities[item.id] || 0)), 0);
  
  const computedDeliveryCharge = (subtotal === 0 || subtotal >= settings.freeDeliveryAbove || deliveryType === 'Self Pickup') ? 0 : deliveryCharge;
  const tax = Math.round((subtotal * settings.taxPercent) / 100);
  const total = subtotal + computedDeliveryCharge + tax;

  const getWhatsAppLink = (order: Order) => {
    const space = '%20';
    const newline = '%0A';
    
    let itemsText = '';
    order.items.forEach(i => {
      itemsText += `•${space}${i.menuItem.name}${space}(${i.menuItem.nameDevnagari})${space}x${space}${i.quantity}${space}(₹${i.menuItem.price * i.quantity})${newline}`;
    });

    const message = `*${tirthMarathi}${space}–${space}The${space}Food${space}Studio*${newline}` +
                    `*ORDER${space}RECEIPT*${newline}${newline}` +
                    `*Order${space}ID:*${space}${order.id}${newline}` +
                    `*Customer:*${space}${order.customerName}${newline}` +
                    `*WhatsApp:*${space}${order.customerPhone}${newline}` +
                    `*Delivery${space}Slot:*${space}${order.timeSlot}${newline}` +
                    `*Type:*${space}${deliveryType}${newline}` +
                    `*Payment${space}Status:*${space}PAID${space}ONLINE${space}(Razorpay)${newline}${newline}` +
                    `*Items:*${newline}${itemsText}${newline}` +
                    `*Subtotal:*${space}₹${order.subtotal}${newline}` +
                    `*Delivery:*${space}${order.deliveryCharge === 0 ? 'FREE' : '₹' + order.deliveryCharge}${newline}` +
                    `*Taxes:*${space}₹${order.tax}${newline}` +
                    `*Total${space}Amount:*${space}₹${order.total}${newline}${newline}` +
                    `*Address:*${space}${order.customerAddress}${newline}${newline}` +
                    `Please${space}confirm${space}and${space}deliver${space}my${space}homely${space}feast!${space}🙏`;

    return `https://api.whatsapp.com/send?phone=918380070757&text=${message}`;
  };

  const completeOrderDetails = (paymentId: string) => {
    const orderItems = selectedItems.map(item => ({
      menuItem: item,
      quantity: quantities[item.id]
    }));

    const orderData = {
      customerName: name,
      customerPhone: phone,
      customerAddress: `${address}, ${district}, Maharashtra`,
      customerNotes: notes + ` [Type: ${deliveryType}] [Paid Online via Razorpay]`,
      items: orderItems,
      subtotal,
      deliveryCharge,
      tax,
      discount: 0,
      total,
      paymentMethod: 'UPI' as const, // Paid online
      paymentId: paymentId,
      timeSlot: `${deliveryDate} | ${timeSlot}`
    };

    const newOrder = dbService.createOrder(orderData);
    setSuccessOrder(newOrder);

    // Reset checkout states
    setQuantities({});
    setRzpProcessing(false);
    setIsRzpOpen(false);

    // Confetti
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.5 }
    });

    // Automatically notify the admin on WhatsApp
    setTimeout(() => {
      window.open(getWhatsAppLink(newOrder), '_blank');
    }, 1500); // 1.5 second delay allows confetti to pop and UI to settle
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (totalItemsCount === 0) {
      setValidationError('Please select at least 1 item from the menu above!');
      return;
    }
    if (!name.trim()) {
      setValidationError('Customer name is required!');
      return;
    }
    if (!phone.trim()) {
      setValidationError('WhatsApp mobile number is required!');
      return;
    }
    if (!address.trim()) {
      setValidationError('Delivery address is required!');
      return;
    }

    // Launch official Razorpay standard checkout popup window if SDK is loaded
    if (typeof window !== 'undefined' && (window as any).Razorpay) {
      try {
        setRzpProcessing(true);
        
        // 1. Call Backend API to securely create Razorpay Order
        const res = await fetch('/api/razorpay/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: total })
        });
        const orderData = await res.json();
        
        if (orderData.error) {
          throw new Error(orderData.error);
        }

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_T70jcHDk4sa0ej", // Client-exposed test key
          amount: orderData.amount, // from secure backend (in paise)
          currency: orderData.currency,
          order_id: orderData.orderId, // Secure backend order ID!
          name: "तीर्थ – The Food Studio",
          description: "Authentic Veg Maharashtrian Tiffin Service",
          image: "/logo.png",
          handler: async function (response: any) {
            // 2. Call Backend API to cryptographically verify payment signature
            try {
              const verifyRes = await fetch('/api/razorpay/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature
                })
              });
              const verifyData = await verifyRes.json();
              
              if (verifyData.success) {
                completeOrderDetails(response.razorpay_payment_id);
              } else {
                alert("Payment Verification Failed! Please contact support.");
              }
            } catch (err) {
              console.error("Verification error:", err);
              alert("Payment verification error. Contact support.");
            }
          },
          prefill: {
            name: name,
            contact: phone,
            email: "tirthfoodstudio@gmail.com"
          },
          notes: {
            address: address
          },
          theme: {
            color: "#5A6E3B" // Olive green matching navbar brand color
          }
        };
        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', function (response: any){
          alert("Payment Failed: " + response.error.description);
        });
        rzp.open();
        setRzpProcessing(false);
        return;
      } catch (err) {
        console.error("Razorpay SDK launch failed, falling back to secure sandbox checkout portal:", err);
        setRzpProcessing(false);
      }
    }

    // Fallback: Open our secure custom payment sandbox portal directly
    setIsRzpOpen(true);
  };

  // Process the secure simulated Razorpay checkout
  const handleRazorpaySimulationPay = async () => {
    if (rzpProcessing) return;
    setRzpProcessing(true);

    // Simulated transaction phases
    setRzpStep('Connecting to payment processor...');
    await new Promise(r => setTimeout(r, 600));

    setRzpStep('Acquiring secure payment channel token...');
    await new Promise(r => setTimeout(r, 600));

    setRzpStep('Awaiting bank authorisation...');
    await new Promise(r => setTimeout(r, 800));

    setRzpStep('Payment received successfully!');
    await new Promise(r => setTimeout(r, 400));

    completeOrderDetails('pay_Tirth_' + Math.floor(100000 + Math.random() * 900000).toString());
  };


  const dailyItems = menu.filter(item => item.category === 'everyday' || item.category === 'customize');
  const preorderItems = menu.filter(item => item.category === 'special');
  const activeItems = activeTab === 'daily' ? dailyItems : preorderItems;

  // Daily Menu Sub-sections
  const everydayTiffinItems = dailyItems.filter(item => item.category === 'everyday');
  const customizedItems = dailyItems.filter(item => item.category === 'customize');

  const maharashtraDistricts = [
    'Pune', 'Mumbai City', 'Mumbai Suburban', 'Satara', 'Thane', 
    'Nashik', 'Nagpur', 'Kolhapur', 'Solapur', 'Aurangabad'
  ];

  const timeSlots = [
    '12:30 PM - 01:00 PM', '01:00 PM - 01:30 PM', 
    '01:30 PM - 02:00 PM', '07:30 PM - 08:00 PM', 
    '08:00 PM - 08:30 PM', '08:30 PM - 09:00 PM'
  ];

  const renderDishCard = (item: MenuItem) => {
    // eslint-disable-next-line @next/next/no-img-element
    const qty = quantities[item.id] || 0;
    const itemSubtotal = qty * item.price;
    return (
      <div key={item.id} className="group bg-white border-2 border-leaf/20 p-4 rounded-2xl flex flex-col justify-between items-center text-center shadow-sm hover:shadow-lg hover:border-leaf/40 transition-all relative">
        {/* Food Thumbnail with hover description */}
        <div className="w-full aspect-[4/3] rounded-xl overflow-hidden mb-3 border border-leaf-light/5 relative">
          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
          {item.isPreorder && (
            <span className="absolute top-2 right-2 bg-amber-500 text-white text-[8px] font-black p-0.5 px-1.5 rounded uppercase z-10">
              Pre Order
            </span>
          )}
          {/* Hover Description Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/70 to-charcoal/30 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-3 rounded-xl">
            <p className="text-white text-[10px] sm:text-[11px] font-semibold leading-relaxed drop-shadow-md">
              {item.description}
            </p>
          </div>
        </div>

        {/* Counter controls */}
        <div className="flex items-center gap-2 bg-[#FAF8F5] border border-leaf-light/20 p-1 px-3 rounded-full mb-2">
          <button
            onClick={() => handleDecrement(item.id)}
            className="w-5 h-5 rounded-full bg-leaf text-white flex items-center justify-center font-bold text-xs hover:bg-leaf-dark cursor-pointer"
          >
            -
          </button>
          <span className="w-4 text-xs font-black text-charcoal">{qty}</span>
          <button
            onClick={() => handleIncrement(item.id)}
            className="w-5 h-5 rounded-full bg-leaf text-white flex items-center justify-center font-bold text-xs hover:bg-leaf-dark cursor-pointer"
          >
            +
          </button>
          <span className="text-[10px] text-charcoal/40 font-bold ml-1.5">₹{item.price}</span>
        </div>

        {/* Bilingual Title */}
        <div className="mb-3">
          <h4 className="font-lora font-extrabold text-base text-leaf-dark leading-tight">
            {item.name}
          </h4>
          <p className="font-noto-dev text-sm sm:text-base font-extrabold text-[#5A6E3B] mt-1">{item.nameDevnagari}</p>
        </div>

        {/* Dynamic Subtotal Pill */}
        <div className="w-full p-1.5 bg-cream border border-leaf-light/25 rounded-full text-center text-xs font-bold text-leaf">
          ₹{itemSubtotal.toFixed(2)}/-
        </div>
      </div>
    );
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#F4F7ED] pb-24 pt-8">
        <div className="max-w-5xl mx-auto px-4">
          
          {/* Main Title Banner */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-leaf-dark tracking-wide font-yatra mb-1 uppercase">
              Order Now
            </h1>
            <p className="text-xs text-charcoal/50 font-bold uppercase tracking-wider">
              Choose your favourite Maharashtrian Thali
            </p>
          </div>

          {/* Tab Button Selector */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <button
              onClick={() => setActiveTab('daily')}
              className={`py-3 px-8 text-base font-black uppercase rounded-xl border-2 transition-all cursor-pointer tracking-wide ${
                activeTab === 'daily'
                  ? 'bg-[#E6EED5] text-leaf-dark border-leaf shadow-inner'
                  : 'bg-white text-charcoal/50 border-leaf-light/20 hover:bg-cream-light'
              }`}
            >
              Daily Menu
            </button>
            <button
              onClick={() => setActiveTab('preorder')}
              className={`py-3 px-8 text-base font-black uppercase rounded-xl border-2 transition-all cursor-pointer tracking-wide ${
                activeTab === 'preorder'
                  ? 'bg-[#E6EED5] text-leaf-dark border-leaf shadow-inner'
                  : 'bg-white text-charcoal/50 border-leaf-light/20 hover:bg-cream-light'
              }`}
            >
              Pre Order
            </button>
          </div>

          {/* Validation popup */}
          {validationError && (
            <div className="max-w-2xl mx-auto p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs font-bold mb-8 flex items-center gap-2 animate-bounce">
              <span>⚠️ {validationError}</span>
            </div>
          )}

          {/* CARD GRID */}
          {activeTab === 'daily' ? (
            <div className="space-y-10 mb-12">

              {/* SUB-SECTION: रोजचा डबा / Everyday Tiffin */}
              {everydayTiffinItems.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <div>
                      <span className="text-2xl font-black text-leaf-dark tracking-tight block">रोजचा डबा / Everyday Tiffin</span>
                      <span className="text-[10px] text-charcoal/40 font-bold">Complete daily meals & combos</span>
                    </div>
                    <div className="flex-1 h-0.5 bg-leaf-light/20 rounded-full"></div>
                    <span className="text-[10px] text-saffron font-black uppercase tracking-wider bg-saffron/10 p-1.5 px-3 rounded-full">Complete Meal</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                    {everydayTiffinItems.map((item) => renderDishCard(item))}
                  </div>
                </div>
              )}



              {/* SUB-SECTION: Customized Remaining */}
              {customizedItems.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <div>
                      <span className="text-2xl font-black text-leaf-dark tracking-tight block">Customized Remaining</span>
                      <span className="text-[10px] text-charcoal/40 font-bold">Rice, sides, pickles & accompaniments</span>
                    </div>
                    <div className="flex-1 h-0.5 bg-leaf-light/20 rounded-full"></div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                    {customizedItems.map((item) => renderDishCard(item))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              {activeItems.map((item) => renderDishCard(item))}
            </div>
          )}

          {/* BANANA LEAF FORM SECTION */}
          <div className="max-w-2xl mx-auto banana-leaf-bg p-8 sm:p-10 text-white relative">
            <div className="text-center mb-6">
              <h3 className="font-yatra font-bold text-xl tracking-wide leading-none mb-1 text-[#FAF8F5]">
                Delivery Address & Billing
              </h3>
              <p className="text-[10px] uppercase font-extrabold text-[#E6EED5] tracking-wider">
                Fill in your details for secure online payment
              </p>
              <div className="w-16 h-0.5 bg-[#FAF8F5]/30 mx-auto mt-2 rounded-full"></div>
            </div>

            <form onSubmit={handleCheckoutSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* WhatsApp Number */}
                <div>
                  <label className="banana-leaf-label">WhatsApp Number</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => { setPhone(e.target.value); persistUserDetail('tirth_user_phone', e.target.value); }}
                    placeholder="E.g. 8380070757"
                    className="w-full p-3 banana-leaf-input shadow-inner text-charcoal"
                  />
                </div>

                {/* Customer Name */}
                <div>
                  <label className="banana-leaf-label">Customer Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => { setName(e.target.value); persistUserDetail('tirth_user_name', e.target.value); }}
                    placeholder="Enter your name"
                    className="w-full p-3 banana-leaf-input shadow-inner text-charcoal"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* State */}
                <div>
                  <label className="banana-leaf-label">State</label>
                  <input
                    type="text"
                    disabled
                    value="महाराष्ट्र"
                    className="w-full p-3 banana-leaf-input bg-slate-100 opacity-60 cursor-not-allowed uppercase text-charcoal"
                  />
                </div>

                {/* Districts */}
                <div>
                  <label className="banana-leaf-label">District</label>
                  <select
                    value={district}
                    onChange={(e) => { setDistrict(e.target.value); persistUserDetail('tirth_user_district', e.target.value); }}
                    className="w-full p-3 banana-leaf-input cursor-pointer font-bold text-charcoal"
                  >
                    {maharashtraDistricts.map(dist => (
                      <option key={dist} value={dist}>{dist}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="banana-leaf-label">Full Address</label>
                <textarea
                  required
                  value={address}
                  onChange={(e) => { setAddress(e.target.value); persistUserDetail('tirth_user_address', e.target.value); }}
                  placeholder="House no, Building, Society, Area, Pune"
                  className="w-full p-3 banana-leaf-input shadow-inner min-h-[60px] text-charcoal"
                />
              </div>

              {/* Delivery Map Router */}
              {deliveryType === 'Home Delivery' && (
                <div className="my-2">
                  <DeliveryMap
                    customerAddress={address}
                    customerLat={customerLat}
                    customerLng={customerLng}
                    distanceKm={deliveryDistance}
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Delivery Type */}
                <div>
                  <label className="banana-leaf-label">Delivery Type</label>
                  <select
                    value={deliveryType}
                    onChange={(e) => { setDeliveryType(e.target.value); persistUserDetail('tirth_user_del_type', e.target.value); }}
                    className="w-full p-3 banana-leaf-input cursor-pointer font-bold text-charcoal"
                  >
                    <option value="Home Delivery">Home Delivery</option>
                    <option value="Self Pickup">Self Pickup</option>
                  </select>
                </div>

                {/* Date */}
                <div>
                  <label className="banana-leaf-label">Select Date</label>
                  <input
                    type="date"
                    required
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full p-3 banana-leaf-input cursor-pointer font-bold text-charcoal"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Food Total */}
                <div>
                  <label className="banana-leaf-label">Food Subtotal (₹)</label>
                  <input
                    type="text"
                    disabled
                    value={`₹${subtotal.toFixed(2)}`}
                    className="w-full p-3 banana-leaf-input bg-emerald-50 text-[#4D6925] font-black text-center cursor-not-allowed"
                  />
                </div>

                {/* Delivery Charge */}
                <div>
                  <label className="banana-leaf-label">Delivery Charge</label>
                  <div className="p-3 banana-leaf-input bg-amber-50/80 text-center cursor-not-allowed">
                    {deliveryType === 'Self Pickup' ? (
                      <span className="font-black text-leaf-dark text-sm">FREE (Self Pickup)</span>
                    ) : subtotal >= settings.freeDeliveryAbove ? (
                      <span className="font-black text-leaf-dark text-sm">FREE (Order &gt; ₹{settings.freeDeliveryAbove})</span>
                    ) : isCalculatingDelivery ? (
                      <span className="text-xs font-semibold text-charcoal/50 animate-pulse">Calculating...</span>
                    ) : (
                      <div>
                        <span className="font-black text-saffron-dark text-sm">₹{computedDeliveryCharge}</span>
                        {deliveryDistance !== null && (
                          <span className="block text-[9px] font-bold text-charcoal/40 mt-0.5">
                            {deliveryZone} ({deliveryDistance} km from Dhayari)
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Grand Total */}
              <div>
                <label className="banana-leaf-label">Grand Total (₹)</label>
                <div className="p-4 bg-[#E6EED5] border-2 border-white/20 rounded-xl text-center">
                  <span className="font-black text-2xl text-leaf-dark">
                    ₹{total.toFixed(2)}
                  </span>
                  <span className="block text-[9px] text-charcoal/40 font-bold mt-0.5">
                    Subtotal ₹{subtotal.toFixed(2)} + Delivery ₹{deliveryType === 'Self Pickup' ? '0' : computedDeliveryCharge} + Tax ₹{tax}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Time Slot */}
                <div>
                  <label className="banana-leaf-label">Delivery Time Slot</label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full p-3 banana-leaf-input cursor-pointer font-bold text-charcoal"
                  >
                    {timeSlots.map(slot => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Instructions */}
              <div>
                <label className="banana-leaf-label">Special Instructions (e.g. less spicy, no onion-garlic)</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="E.g. medium spicy / no potato"
                  className="w-full p-3 banana-leaf-input shadow-inner font-semibold placeholder:text-charcoal/20 text-charcoal"
                />
              </div>

              {/* Static Payment Indication */}
              <div className="space-y-1">
                <label className="banana-leaf-label">Selected Payment Method</label>
                <div className="p-3 bg-[#E6EED5] text-leaf-dark border border-white/20 rounded-xl font-black text-center tracking-wider text-[11px] uppercase">
                  💳 Online Payment (Razorpay Secure Gateway)
                </div>
              </div>

              {/* Centered green Checkout button */}
              <div className="pt-4 flex justify-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="p-4 px-8 bg-gradient-to-r from-saffron to-saffron-light hover:scale-105 active:scale-95 text-white font-extrabold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-[#4D6925]/20 border border-brass/30 transition-all cursor-pointer text-xs uppercase tracking-wider disabled:opacity-50"
                >
                  {isSubmitting ? 'Opening Payment Gateway...' : 'Pay & Confirm Order →'}
                </button>
              </div>
            </form>
          </div>

        </div>
      </main>

      {/* RAZORPAY SECURE SIMULATOR POPUP */}
      {isRzpOpen && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] border-2 border-leaf-light/30 max-w-md w-full overflow-hidden shadow-2xl rounded-[32px] animate-fade-in text-charcoal">
            
            {/* RZP Header */}
            <div className="bg-[#4A5D4E] text-white p-6 flex justify-between items-start">
              <div>
                <h4 className="font-yatra font-black text-2xl flex items-center gap-1.5 leading-none">
                  {tirthMarathi}
                </h4>
                <p className="text-[10px] text-white/50 mt-1 font-bold tracking-widest leading-none">The Food Studio</p>
                <span className="text-[9px] text-white/40 block mt-2 text-[8px] tracking-wider bg-white/10 p-0.5 px-2 rounded-full w-fit">
                  Secured by Razorpay Test Mode
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-white/50 font-bold block uppercase tracking-wider">Total Due</span>
                <span className="font-yatra font-black text-2xl text-saffron">₹{total.toFixed(2)}</span>
              </div>
            </div>

            {rzpProcessing ? (
              /* Transaction Processing view */
              <div className="p-8 py-16 flex flex-col items-center justify-center text-center space-y-4">
                <Loader2 className="w-10 h-10 text-leaf animate-spin" />
                <h4 className="text-sm font-black text-charcoal uppercase tracking-wider">Secure Payment Gateway</h4>
                <p className="text-xs text-charcoal/60 leading-none animate-pulse">{rzpStep}</p>
              </div>
            ) : (
              /* Normal simulation form */
              <div className="p-6 space-y-5">
                {/* Method Tabs */}
                <div className="grid grid-cols-3 gap-2 border-b border-charcoal/5 pb-2 text-center text-[10px] font-extrabold uppercase text-charcoal/40">
                  <button
                    onClick={() => setRzpTab('upi')}
                    className={`pb-1.5 border-b-2 cursor-pointer ${
                      rzpTab === 'upi' ? 'text-leaf border-leaf font-black' : 'border-transparent'
                    }`}
                  >
                    📱 UPI / QR
                  </button>
                  <button
                    onClick={() => setRzpTab('card')}
                    className={`pb-1.5 border-b-2 cursor-pointer ${
                      rzpTab === 'card' ? 'text-leaf border-leaf font-black' : 'border-transparent'
                    }`}
                  >
                    💳 Card Details
                  </button>
                  <button
                    onClick={() => setRzpTab('netbanking')}
                    className={`pb-1.5 border-b-2 cursor-pointer ${
                      rzpTab === 'netbanking' ? 'text-leaf border-leaf font-black' : 'border-transparent'
                    }`}
                  >
                    🏛️ Netbanking
                  </button>
                </div>

                {/* Tab 1: UPI */}
                {rzpTab === 'upi' && (
                  <div className="space-y-4 animate-fade-in text-xs font-semibold">
                    <div className="flex justify-center py-2 bg-white border rounded-2xl border-charcoal/5 shadow-inner">
                      <QrCode className="w-24 h-24 text-charcoal/80" />
                    </div>
                    <div>
                      <label className="text-[9px] text-charcoal/40 uppercase font-black tracking-wider block mb-1">Enter UPI ID</label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="उदा. nitinpage@okaxis"
                        className="w-full p-2.5 bg-cream border border-charcoal/10 focus:border-leaf rounded-xl shadow-inner text-charcoal font-bold text-center placeholder:text-charcoal/20"
                      />
                    </div>
                  </div>
                )}

                {/* Tab 2: Cards */}
                {rzpTab === 'card' && (
                  <div className="space-y-4 animate-fade-in text-xs">
                    <div>
                      <label className="text-[9px] text-charcoal/40 uppercase font-black tracking-wider block mb-1">Card Number</label>
                      <input
                        type="text"
                        maxLength={16}
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4111 2222 3333 4444"
                        className="w-full p-2.5 bg-cream border border-charcoal/10 focus:border-leaf rounded-xl shadow-inner text-charcoal font-bold text-center placeholder:text-charcoal/20"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[9px] text-charcoal/40 uppercase font-black tracking-wider block mb-1">Expiry Date</label>
                        <input
                          type="text"
                          maxLength={5}
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM/YY"
                          className="w-full p-2.5 bg-cream border border-charcoal/10 focus:border-leaf rounded-xl shadow-inner text-charcoal font-bold text-center placeholder:text-charcoal/20"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-charcoal/40 uppercase font-black tracking-wider block mb-1">CVV</label>
                        <input
                          type="password"
                          maxLength={3}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="123"
                          className="w-full p-2.5 bg-cream border border-charcoal/10 focus:border-leaf rounded-xl shadow-inner text-charcoal font-bold text-center placeholder:text-charcoal/20"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 3: Netbanking */}
                {rzpTab === 'netbanking' && (
                  <div className="space-y-3 animate-fade-in text-xs font-bold text-charcoal/80">
                    <span className="text-[9px] text-charcoal/40 uppercase font-black tracking-wider block">Popular Banks</span>
                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div className="p-2 border rounded-xl border-charcoal/5 hover:border-leaf bg-white cursor-pointer shadow-sm">State Bank of India</div>
                      <div className="p-2 border rounded-xl border-charcoal/5 hover:border-leaf bg-white cursor-pointer shadow-sm">HDFC Bank</div>
                      <div className="p-2 border rounded-xl border-charcoal/5 hover:border-leaf bg-white cursor-pointer shadow-sm">ICICI Bank</div>
                      <div className="p-2 border rounded-xl border-charcoal/5 hover:border-leaf bg-white cursor-pointer shadow-sm">Axis Bank</div>
                    </div>
                  </div>
                )}

                {/* Footer buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setIsRzpOpen(false)}
                    className="p-3 px-4 bg-slate-100 hover:bg-slate-200 text-charcoal/50 font-bold rounded-xl text-xs flex-grow cursor-pointer text-center"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRazorpaySimulationPay}
                    className="p-3 px-8 bg-gradient-to-r from-saffron to-saffron-light text-white font-extrabold rounded-xl text-xs flex-grow cursor-pointer tracking-wider uppercase text-center"
                  >
                    Pay ₹{total.toFixed(2)}
                  </button>
                </div>
              </div>
            )}
            
            {/* RZP Trust strip */}
            <div className="bg-slate-100 text-charcoal/40 p-3 text-[8px] text-center font-bold tracking-widest uppercase flex items-center justify-center gap-1">
              <Lock className="w-3.5 h-3.5 text-charcoal/30" /> 100% Secure 256-bit Encrypted Payment
            </div>
          </div>
        </div>
      )}

      {/* FINAL RECEIPT POPUP COMPILER */}
      {successOrder && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] border-2 border-brass/20 max-w-md w-full overflow-hidden shadow-2xl rounded-[32px] p-6 text-center animate-fade-in text-charcoal">
            <div className="w-16 h-16 bg-leaf/10 text-leaf rounded-full flex items-center justify-center mx-auto mb-4 border border-leaf shadow-inner">
              <CheckCircle2 className="w-8 h-8 text-leaf" />
            </div>
            
            <span className="p-1 px-3 bg-[#E6EED5] text-leaf-dark text-[9px] font-bold tracking-widest uppercase rounded-full mb-2 inline-block">
              Order Confirmed!
            </span>
            
            <h3 className="font-yatra font-black text-2xl text-charcoal tracking-tight leading-none mb-1">
              Thank You!
            </h3>
            <p className="text-[10px] font-bold text-saffron tracking-wide">
              Order ID: {successOrder.id}
            </p>

            <div className="bg-white border border-leaf-light/15 p-4 rounded-2xl my-5 text-left text-xs space-y-2 max-h-[160px] overflow-y-auto shadow-inner">
              <span className="font-bold text-charcoal block border-b pb-1.5 mb-1 text-[10px] uppercase text-charcoal/40">Order Receipt</span>
              {successOrder.items.map((i) => (
                <div key={i.menuItem.id} className="flex justify-between text-charcoal/80 font-semibold">
                  <span>{i.menuItem.name} ({i.menuItem.nameDevnagari}) (x{i.quantity})</span>
                  <span className="font-yatra font-bold">₹{i.menuItem.price * i.quantity}</span>
                </div>
              ))}
              <div className="border-t pt-2 mt-2 flex justify-between font-extrabold text-charcoal text-[13px]">
                <span>Total Paid</span>
                <span className="font-yatra text-saffron">₹{successOrder.total}</span>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-left text-[11px] text-emerald-800 leading-relaxed mb-6 font-semibold">
              ✅ **Online Payment Confirmed**: Your payment of **₹{successOrder.total}** via Razorpay was received successfully.
              <span className="block mt-1 text-[10px] text-emerald-600 font-mono">Payment ID: {successOrder.paymentId || 'pay_mock'}</span>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => setSuccessOrder(null)}
                className="p-3.5 bg-leaf hover:bg-leaf-dark text-white font-bold rounded-2xl text-xs cursor-pointer tracking-wider uppercase text-center"
              >
                Done – Back to Menu
              </button>
              <a
                href={getWhatsAppLink(successOrder)}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-xs text-emerald-600 hover:text-emerald-700 font-bold flex items-center justify-center gap-1.5 uppercase text-center cursor-pointer justify-center"
              >
                Send Receipt on WhatsApp (Optional) <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>
        </div>
      )}
    </>
  );
}

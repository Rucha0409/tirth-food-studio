'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { dbService, Subscription } from '@/lib/db';
import { 
  CalendarRange, 
  Check, 
  Sparkles, 
  Clock, 
  ArrowRight, 
  MapPin, 
  Phone, 
  User, 
  Smartphone,
  CheckCircle,
  TrendingUp
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function SubscriptionPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [timeSlot, setTimeSlot] = useState('Afternoon (12:00 PM - 2:00 PM)');
  const [planType, setPlanType] = useState<'Weekly' | 'Monthly'>('Weekly');
  const [mealType, setMealType] = useState<'Veg Thali' | 'Special Thali'>('Veg Thali');

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'idle' | 'processing' | 'success'>('idle');
  const [createdSub, setCreatedSub] = useState<Subscription | null>(null);

  // Load persisted user details on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setName(localStorage.getItem('tirth_user_name') || '');
      setPhone(localStorage.getItem('tirth_user_phone') || '');
      setAddress(localStorage.getItem('tirth_user_address') || '');
    }
  }, []);

  // Pricing calculations
  const getPlanPrice = () => {
    if (mealType === 'Veg Thali') {
      return planType === 'Weekly' ? 999 : 3999;
    } else {
      return planType === 'Weekly' ? 1550 : 5999;
    }
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !address.trim()) {
      alert('Please fill out all subscription details!');
      return;
    }

    // Persist details
    localStorage.setItem('tirth_user_name', name);
    localStorage.setItem('tirth_user_phone', phone);
    localStorage.setItem('tirth_user_address', address);

    setIsProcessing(true);
    setPaymentStep('processing');

    // Simulate Razorpay gateway loading (1.8s)
    await new Promise(resolve => setTimeout(resolve, 1800));

    const subData = {
      customerName: name,
      customerPhone: phone,
      customerAddress: address,
      planType,
      mealType,
      price: getPlanPrice(),
      timeSlot,
      startDate: new Date().toISOString()
    };

    const newSub = dbService.createSubscription(subData);
    setCreatedSub(newSub);
    setPaymentStep('success');
    setIsProcessing(false);

    // Blast celebratory confetti!
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 }
    });
  };

  // Build automated WhatsApp message for subscription plans!
  const getSubWhatsAppLink = (sub: Subscription) => {
    const space = '%20';
    const newline = '%0A';
    const message = `*तीर्थ${space}–${space}The${space}Food${space}Studio*${newline}` +
                    `*NEW${space}TIFFIN${space}SUBSCRIPTION*${newline}${newline}` +
                    `*Sub${space}ID:*${space}${sub.id}${newline}` +
                    `*Customer:*${space}${sub.customerName}${newline}` +
                    `*Phone:*${space}${sub.customerPhone}${newline}` +
                    `*Plan:*${space}${sub.planType}${space}(${sub.mealType})${newline}` +
                    `*Price:*${space}₹${sub.price}${newline}` +
                    `*Start${space}Date:*${space}${new Date(sub.startDate).toLocaleDateString()}${newline}` +
                    `*Time${space}Slot:*${space}${sub.timeSlot}${newline}${newline}` +
                    `*Delivery${space}Address:*${space}${sub.customerAddress}${newline}${newline}` +
                    `Thank${space}you!${space}Please${space}activate${space}my${space}homely${space}tiffin${space}plan!${space}🙏`;

    return `https://api.whatsapp.com/send?phone=919890990757&text=${message}`;
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gradient-to-b from-cream-light via-background to-cream-dark py-10 pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 select-none">
          
          {/* HEADER AREA */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="p-1 px-3 bg-leaf-light/10 text-leaf text-[10px] font-extrabold tracking-widest uppercase rounded-full mb-3 inline-block">
              Daily Nutritious Meals
            </span>
            <h1 className="font-yatra font-black text-3xl sm:text-4xl text-leaf-dark flex items-center justify-center gap-2">
              <CalendarRange className="w-8 h-8 text-saffron" /> Premium Tiffin Plans
            </h1>
            <p className="text-xs text-charcoal/60 mt-1 max-w-sm mx-auto leading-relaxed">
              Subscribe for daily fresh homemade Maharashtrian meals. Pause or resume anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-5xl mx-auto">
            
            {/* LEFT: SUBSCRIPTION CONFIGURATION & VALUE OFFERS */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* Premium Plan options comparison */}
              <div className="bg-white border border-leaf-light/10 p-5 rounded-3xl shadow-sm">
                <h3 className="font-yatra font-bold text-base text-leaf-dark border-b border-leaf-light/10 pb-3 mb-4">
                  १. जेवणाचा डबा निवडा
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Option A: Veg Satvik Thali Plan */}
                  <button
                    onClick={() => setMealType('Veg Thali')}
                    className={`satvik-card p-4 text-left border flex flex-col justify-between h-48 cursor-pointer relative ${
                      mealType === 'Veg Thali'
                        ? 'border-leaf border-2 bg-leaf-light/5 shadow-inner'
                        : 'border-leaf-light/10 hover:border-leaf-light/35'
                    }`}
                  >
                    <div>
                      <span className="p-0.5 px-1.5 bg-emerald-600/10 text-emerald-600 text-[8px] font-bold rounded-md uppercase tracking-wider block w-fit mb-1.5">
                        100% Pure Satvik
                      </span>
                      <h4 className="font-yatra font-bold text-sm text-leaf-dark">Veg Satvik Plan</h4>
                      <p className="text-[10px] text-charcoal/60 leading-relaxed mt-1">
                        Our daily dabba: 2 bhajis, 3 Polis (or 2 Bhakri), Amti/Varan, Rice, Koshimbir and Tak.
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] text-charcoal/40 font-semibold block leading-none">Starting from</span>
                      <span className="font-outfit font-black text-lg text-charcoal">₹999 <span className="text-xs font-semibold text-charcoal/50">/ week</span></span>
                    </div>
                    {mealType === 'Veg Thali' && (
                      <span className="absolute top-3 right-3 w-5 h-5 bg-leaf text-white rounded-full flex items-center justify-center text-[10px]">✓</span>
                    )}
                  </button>

                  {/* Option B: Premium Special Thali Plan */}
                  <button
                    onClick={() => setMealType('Special Thali')}
                    className={`satvik-card p-4 text-left border flex flex-col justify-between h-48 cursor-pointer relative ${
                      mealType === 'Special Thali'
                        ? 'border-leaf border-2 bg-leaf-light/5 shadow-inner'
                        : 'border-leaf-light/10 hover:border-leaf-light/35'
                    }`}
                  >
                    <div>
                      <span className="p-0.5 px-2 bg-saffron/10 text-saffron text-[8px] font-bold rounded-md uppercase tracking-wider block w-fit mb-1.5 flex items-center gap-0.5">
                        <Sparkles className="w-2.5 h-2.5 text-brass" /> Festival Special
                      </span>
                      <h4 className="font-yatra font-bold text-sm text-leaf-dark">Festival Special Plan</h4>
                      <p className="text-[10px] text-charcoal/60 leading-relaxed mt-1">
                        Special village-style meals: Bharli Vangi, Pithale-Bhakri, Puranpoli in pure ghee, Masale Bhat, Solkadhi and Ukadiche Modak.
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] text-charcoal/40 font-semibold block leading-none">Starting from</span>
                      <span className="font-outfit font-black text-lg text-charcoal">₹1550 <span className="text-xs font-semibold text-charcoal/50">/ week</span></span>
                    </div>
                    {mealType === 'Special Thali' && (
                      <span className="absolute top-3 right-3 w-5 h-5 bg-leaf text-white rounded-full flex items-center justify-center text-[10px]">✓</span>
                    )}
                  </button>
                </div>
              </div>

              {/* Tiffin cycle Duration selection */}
              <div className="bg-white border border-leaf-light/10 p-5 rounded-3xl shadow-sm">
                <h3 className="font-yatra font-bold text-base text-leaf-dark border-b border-leaf-light/10 pb-3 mb-4">
                  2. Select Duration
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setPlanType('Weekly')}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      planType === 'Weekly'
                        ? 'bg-leaf-light/10 text-leaf border-leaf font-bold shadow-inner'
                        : 'bg-cream text-charcoal border-leaf-light/10 hover:border-leaf-light/30'
                    }`}
                  >
                    <p className="text-xs font-bold">Weekly Pack</p>
                    <p className="text-[9px] text-charcoal/50 font-semibold mt-0.5">6 days (excl. Sunday)</p>
                  </button>

                  <button
                    onClick={() => setPlanType('Monthly')}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      planType === 'Monthly'
                        ? 'bg-leaf-light/10 text-leaf border-leaf font-bold shadow-inner'
                        : 'bg-cream text-charcoal border-leaf-light/10 hover:border-leaf-light/30'
                    }`}
                  >
                    <p className="text-xs font-bold flex items-center justify-center gap-0.5">
                      Monthly Pack <TrendingUp className="w-3.5 h-3.5 text-saffron" />
                    </p>
                    <p className="text-[9px] text-charcoal/50 font-semibold mt-0.5">26 days (excl. Sunday)</p>
                  </button>
                </div>

                <div className="p-3 bg-cream border border-leaf-light/10 rounded-2xl text-[10px] text-charcoal/70 leading-relaxed font-semibold mt-4">
                  💡 **Save more**: Choose the Monthly Pack to save up to **18%**! Best value for your health.
                </div>
              </div>

              {/* Tiffin Slot Delivery schedule selection */}
              <div className="bg-white border border-leaf-light/10 p-5 rounded-3xl shadow-sm">
                <h3 className="font-yatra font-bold text-base text-leaf-dark border-b border-leaf-light/10 pb-3 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-saffron" /> Delivery Time Slot
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    'Afternoon (12:00 PM - 2:00 PM)',
                    'Evening (7:30 PM - 9:30 PM)'
                  ].map((slot) => {
                    const isSelected = timeSlot === slot;
                    const slotLabel = slot.includes('Afternoon') 
                      ? 'Afternoon (12:00 PM - 2:00 PM)' 
                      : 'Evening (7:30 PM - 9:30 PM)';
                    return (
                      <button
                        key={slot}
                        onClick={() => setTimeSlot(slot)}
                        className={`p-3 text-[10px] sm:text-xs font-semibold rounded-2xl border text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-leaf-light/10 text-leaf border-leaf font-bold shadow-inner'
                            : 'bg-cream text-charcoal/80 border-leaf-light/30'
                        }`}
                      >
                        {slotLabel}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* RIGHT: DETAILS INPUT & TRANSACTION BOARD */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* Delivery Details Form */}
              <div className="bg-white border border-leaf-light/10 p-5 rounded-3xl shadow-md">
                <h3 className="font-yatra font-bold text-base text-leaf-dark border-b border-leaf-light/10 pb-3 mb-4">
                  3. Delivery Address & Contact
                </h3>

                <form onSubmit={handleSubscribe} className="space-y-4">
                  {/* Subscriber Name */}
                  <div>
                    <label className="text-[10px] text-charcoal/40 uppercase font-semibold block mb-1">Customer Name</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/30" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter customer name"
                        className="w-full pl-10 p-2.5 bg-cream border border-leaf-light/10 focus:border-leaf rounded-xl text-xs font-semibold shadow-inner"
                      />
                    </div>
                  </div>

                  {/* Subscriber Phone */}
                  <div>
                    <label className="text-[10px] text-charcoal/40 uppercase font-semibold block mb-1">Phone / WhatsApp</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/30" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="E.g. 9890990757"
                        className="w-full pl-10 p-2.5 bg-cream border border-leaf-light/10 focus:border-leaf rounded-xl text-xs font-semibold shadow-inner"
                      />
                    </div>
                  </div>

                  {/* Delivery Location Address */}
                  <div>
                    <label className="text-[10px] text-charcoal/40 uppercase font-semibold block mb-1">Delivery Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-charcoal/30" />
                      <textarea
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="House no, Building, Society, Area, Pune"
                        className="w-full pl-10 p-2.5 bg-cream border border-leaf-light/10 focus:border-leaf rounded-xl text-xs font-semibold shadow-inner min-h-[80px]"
                      />
                    </div>
                  </div>

                  {/* Final Pricing breakdown */}
                  <div className="pt-3 border-t border-leaf-light/10 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-charcoal/40 uppercase font-bold block leading-none">Subscription Fee</span>
                      <span className="text-[9px] text-leaf font-semibold leading-none">(incl. delivery & taxes)</span>
                    </div>
                    <span className="font-outfit font-black text-2xl text-saffron">₹{getPlanPrice()}</span>
                  </div>

                  {/* Subscribe CTA */}
                  <button
                    type="submit"
                    className="w-full p-4 bg-gradient-to-r from-saffron to-saffron-light hover:scale-[1.02] active:scale-95 text-white text-sm font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-saffron/20 border border-brass/10 transition-all cursor-pointer"
                  >
                    Subscribe & Pay ₹{getPlanPrice()} <ArrowRight className="w-4.5 h-4.5" />
                  </button>
                </form>
              </div>

            </div>

          </div>

        </div>
      </main>

      {/* MOCK PAYMENTS AND SUCCESS MODALS */}
      {paymentStep !== 'idle' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-cream-light satvik-card border-2 border-brass/30 max-w-md w-full overflow-hidden shadow-2xl relative animate-fade-in p-6 text-center">
            
            {/* 1. UPI SIMULATION SCREEN */}
            {paymentStep === 'processing' && (
              <div className="py-8">
                <div className="w-16 h-16 border-4 border-leaf border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                <h3 className="font-yatra font-black text-xl text-leaf-dark tracking-tight">
                  Processing Razorpay Payment
                </h3>
                <p className="text-xs text-charcoal/50 mt-1.5 font-bold flex items-center justify-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-saffron" /> Opening payment gateway...
                </p>
                <div className="bg-white p-3.5 rounded-2xl border border-leaf-light/10 max-w-xs mx-auto mt-6 text-left shadow-inner">
                  <span className="text-[9px] font-bold text-charcoal/30 uppercase leading-none block">Package</span>
                  <span className="text-xs font-bold text-charcoal">{planType === 'Weekly' ? 'Weekly' : 'Monthly'} ({mealType === 'Veg Thali' ? 'Veg Satvik' : 'Festival Special'}) Subscription</span>
                  <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-leaf-light/5 text-xs">
                    <span className="font-semibold text-charcoal/60">Total Fee:</span>
                    <span className="font-outfit font-extrabold text-saffron">₹{getPlanPrice()}</span>
                  </div>
                </div>
              </div>
            )}

            {/* 2. SUCCESS DETAILS SCREEN */}
            {paymentStep === 'success' && createdSub && (
              <div className="py-2">
                <div className="w-16 h-16 bg-leaf/10 text-leaf rounded-full flex items-center justify-center mx-auto mb-4 border border-leaf shadow-inner">
                  <CheckCircle className="w-8 h-8 text-leaf" />
                </div>
                
                <span className="p-1 px-3 bg-leaf/10 text-leaf text-[9px] font-bold tracking-widest uppercase rounded-full mb-2 inline-block">
                  Subscription Activated!
                </span>
                
                <h3 className="font-yatra font-black text-2xl text-charcoal tracking-tight leading-none mb-1">
                  Congratulations!
                </h3>
                <p className="text-[10px] font-bold text-saffron tracking-wide">
                  Subscription ID: {createdSub.id}
                </p>

                <div className="bg-white border border-leaf-light/15 p-4 rounded-2xl my-5 text-left text-xs space-y-2.5">
                  <div className="flex justify-between text-charcoal/50 font-semibold border-b pb-1.5">
                    <span>Details</span>
                    <span>Status</span>
                  </div>
                  <div className="flex justify-between text-charcoal/80">
                    <span>Customer Name:</span>
                    <span className="font-bold text-charcoal">{createdSub.customerName}</span>
                  </div>
                  <div className="flex justify-between text-charcoal/80">
                    <span>Selected Plan:</span>
                    <span className="font-bold text-charcoal">{createdSub.planType === 'Weekly' ? 'Weekly' : 'Monthly'} ({createdSub.mealType === 'Veg Thali' ? 'Veg Satvik' : 'Festival Special'})</span>
                  </div>
                  <div className="flex justify-between text-charcoal/80">
                    <span>Total Meals:</span>
                    <span className="font-bold text-leaf">{createdSub.daysRemaining + 1} Meals</span>
                  </div>
                  <div className="flex justify-between text-charcoal/80">
                    <span>Delivery Slot:</span>
                    <span className="font-bold text-charcoal">
                      {createdSub.timeSlot.includes('Afternoon') 
                        ? 'Afternoon (12:00 PM - 2:00 PM)' 
                        : 'Evening (7:30 PM - 9:30 PM)'}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-saffron/10 border border-saffron/20 rounded-2xl text-left text-[11px] text-charcoal/80 leading-relaxed mb-6">
                  📢 **Important Step**: Click the green button below to confirm your tiffin subscription on WhatsApp!
                </div>

                {/* WhatsApp Link builder & Restart options */}
                <div className="flex flex-col gap-3">
                  <a
                    href={getSubWhatsAppLink(createdSub)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 text-xs cursor-pointer"
                  >
                    Confirm Subscription on WhatsApp <ArrowRight className="w-4 h-4" />
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

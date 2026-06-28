'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { Sparkles, ArrowRight, ShieldCheck, CreditCard, MapPin, Phone, User, Truck, Clock, Leaf, Star } from 'lucide-react';

export default function Home() {
  const tirthMarathi = "तीर्थ";
  const tagline = "परम् तृप्तिः अस्माकं व्रतम्";

  return (
    <div className="min-h-screen bg-[#F4F7ED] flex flex-col justify-between text-charcoal">
      <Navbar />

      <main className="flex-grow">
        
        {/* HERO SECTION */}
        <section className="relative py-16 md:py-24 bg-gradient-to-b from-[#E6EED5]/50 via-[#F4F7ED] to-[#F4F7ED] overflow-hidden">
          {/* Subtle decorative circles */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-saffron/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-leaf/5 rounded-full blur-3xl"></div>
          
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="flex flex-col items-center text-center">
              
              <div className="flex flex-col items-center text-center space-y-8 max-w-3xl">
                {/* Badge */}
                <div className="inline-flex items-center gap-1.5 p-1.5 px-4 bg-leaf/10 text-leaf rounded-full text-xs font-black tracking-wide uppercase border border-leaf/10">
                  <Sparkles className="w-3.5 h-3.5 text-brass animate-spin-slow" />
                  100% Pure Homemade Maharashtrian Meal Service
                </div>

                {/* Logo Image */}
                <div className="flex flex-col items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src="/logo.png" 
                    alt="तीर्थ – The Food Studio" 
                    className="w-72 sm:w-96 h-auto object-contain mix-blend-multiply"
                    style={{ mixBlendMode: 'multiply' }}
                  />
                </div>

                {/* Tagline */}
                <div className="border-l-4 border-saffron pl-4 text-left max-w-xl mx-auto">
                  <p className="font-noto-dev text-xl sm:text-2xl text-saffron-dark font-bold leading-snug">
                    &ldquo;{tagline}&rdquo;
                  </p>
                </div>

                {/* Description */}
                <p className="text-sm sm:text-base text-charcoal/70 max-w-2xl leading-relaxed font-lora">
                  Welcome to <span className="font-rozha text-leaf-dark text-lg">तीर्थ</span> – The Food Studio. We craft clean, nutrient-dense regional Maharashtrian delicacies cooked in refined oil, using premium homely masalas and hygienic methods. Experience authentic taste delivered to your home.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <Link
                    href="/order"
                    className="p-4 px-10 bg-gradient-to-r from-saffron to-saffron-light hover:scale-105 active:scale-95 text-white text-sm font-extrabold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-saffron/20 border border-brass/20 transition-all cursor-pointer uppercase tracking-wider"
                  >
                    Order Now <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/menu"
                    className="p-4 px-10 bg-white hover:bg-cream-dark text-charcoal border-2 border-leaf/20 text-sm font-extrabold rounded-2xl shadow-sm hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-1.5 uppercase tracking-wider"
                  >
                    View Full Menu
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* TRUST BADGES */}
        <section className="py-10 bg-white border-y border-leaf-light/10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: <Leaf className="w-6 h-6 text-leaf" />, title: '100% Satvik Veg', desc: 'Homely masalas, zero MSG' },
                { icon: <Truck className="w-6 h-6 text-saffron" />, title: 'Fresh Delivery', desc: '₹20 within 7km of Dhayari' },
                { icon: <Clock className="w-6 h-6 text-brass" />, title: 'Daily Fresh', desc: 'Cooked fresh every morning' },
                { icon: <Star className="w-6 h-6 text-amber-500" />, title: 'Trusted by 500+', desc: 'Pune families love us' },
              ].map((badge, i) => (
                <div key={i} className="flex flex-col items-center text-center p-6 rounded-3xl bg-[#F4F7ED]/50 border border-leaf-light/10 hover:shadow-md transition-shadow">
                  <div className="p-3 bg-white rounded-2xl shadow-sm mb-3">
                    {badge.icon}
                  </div>
                  <h4 className="text-sm font-black text-charcoal uppercase tracking-wide">{badge.title}</h4>
                  <p className="text-xs text-charcoal/50 font-semibold mt-1">{badge.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ABOUT US SECTION */}
        <section id="about-us" className="py-16 bg-[#F4F7ED] scroll-mt-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              <div className="lg:col-span-6 flex justify-center">
                <div className="rounded-[32px] overflow-hidden border-2 border-brass/15 shadow-lg w-full max-w-[460px] aspect-[4/5]">
                  <img 
                    src="/maharashtrian_thali.png" 
                    alt="Traditional Maharashtrian Veg Thali" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>

              <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-black text-saffron tracking-[0.2em] block">
                    Our Story / आमचा प्रवास
                  </span>
                  <h2 className="text-3xl sm:text-4xl text-leaf-dark leading-tight">
                    <span className="font-rozha text-4xl sm:text-5xl">तीर्थ</span> <span className="font-cinzel text-xl sm:text-2xl">– The Food Studio</span>
                  </h2>
                  <div className="w-16 h-0.5 bg-brass/30 mx-auto lg:mx-0 rounded-full mt-2"></div>
                </div>

                <div className="space-y-4 text-sm sm:text-base text-charcoal/70 leading-relaxed font-noto-dev">
                  <p>
                    <b>तीर्थ – द फूड स्टुडिओ</b> ची स्थापना एका ध्येयाने झाली आहे: पारंपारिक महाराष्ट्रीयन खाद्यसंस्कृतीची खरी चव आणि उच्च दर्जा राखणे. आम्ही घरगुती स्वयंपाकाचा जिव्हाळा आणि आधुनिक पाककलेची व्यावसायिकता या दोन्हीचा मेळ घालतो.
                  </p>
                  <p>
                    धायरी, पुणे येथील आमच्या स्वयंपाकघरात आम्ही कोणत्याही कृत्रिम किंवा रासायनिक प्रक्रियेचा वापर करत नाही. स्वयंपाकासाठी दर्जेदार रिफाइंड तेल आणि घरगुती दर्जेदार मसाले वापरले जातात.
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-center lg:justify-start gap-4">
                  <div className="p-3 bg-[#E6EED5] text-leaf rounded-2xl">
                    <ShieldCheck className="w-6 h-6 text-leaf-dark" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-xs font-black uppercase text-leaf-dark tracking-wide">100% Satvik Veg</h4>
                    <p className="text-[10px] text-charcoal/50 font-bold">Zero MSG · Safe Containers · Homely Masalas</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* DELIVERY CHARGES INFO */}
        <section className="py-12 bg-white border-y border-leaf-light/10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="text-[10px] uppercase font-black text-saffron tracking-[0.2em] block mb-2">
              Delivery Information
            </span>
            <h3 className="font-yatra text-2xl sm:text-3xl text-leaf-dark mb-6">
              Delivery Charges
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="bg-[#E6EED5]/30 border-2 border-leaf/15 p-6 rounded-3xl text-center">
                <div className="p-3 bg-leaf/10 rounded-2xl w-fit mx-auto mb-3">
                  <Truck className="w-6 h-6 text-leaf" />
                </div>
                <p className="text-3xl font-black text-leaf-dark">₹20</p>
                <p className="text-xs font-bold text-charcoal/60 mt-1">0 to 7 km</p>
                <p className="text-[10px] text-charcoal/40 font-semibold mt-0.5">From Tarangan Residency, Dhayari</p>
              </div>
              <div className="bg-[#FAF8F5] border-2 border-saffron/15 p-6 rounded-3xl text-center">
                <div className="p-3 bg-saffron/10 rounded-2xl w-fit mx-auto mb-3">
                  <Truck className="w-6 h-6 text-saffron" />
                </div>
                <p className="text-3xl font-black text-saffron-dark">₹50</p>
                <p className="text-xs font-bold text-charcoal/60 mt-1">7 to 10 km</p>
                <p className="text-[10px] text-charcoal/40 font-semibold mt-0.5">Mid-radius delivery</p>
              </div>
              <div className="bg-[#FAF8F5] border-2 border-brass/15 p-6 rounded-3xl text-center">
                <div className="p-3 bg-brass/10 rounded-2xl w-fit mx-auto mb-3">
                  <Truck className="w-6 h-6 text-brass" />
                </div>
                <p className="text-3xl font-black text-charcoal">₹100</p>
                <p className="text-xs font-bold text-charcoal/60 mt-1">Beyond 10 km</p>
                <p className="text-[10px] text-charcoal/40 font-semibold mt-0.5">Extended delivery radius</p>
              </div>
            </div>
          </div>
        </section>

        {/* PAYMENT METHODS & CONTACT DETAILS */}
        <section id="contact-us" className="py-16 bg-[#F4F7ED] scroll-mt-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
              
              {/* Payment Methods Info */}
              <div className="bg-white border border-leaf-light/10 p-8 rounded-[40px] shadow-sm flex flex-col justify-between space-y-6">
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-black text-saffron tracking-[0.2em] block">
                    Seamless Payments
                  </span>
                  <h3 className="font-yatra text-2xl sm:text-3xl text-leaf-dark">
                    Payment Methods
                  </h3>
                  <div className="w-12 h-0.5 bg-brass/30 rounded-full mt-2"></div>
                </div>

                <div className="space-y-4 font-lora text-xs">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-[#E6EED5]/60 text-leaf rounded-xl shrink-0">
                      <CreditCard className="w-5 h-5 text-leaf-dark" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-charcoal font-sans">Pay Online via Razorpay</h4>
                      <p className="text-[11px] text-charcoal/60 leading-relaxed mt-0.5">
                        Securely complete your purchase online. We accept UPI (Google Pay, PhonePe, Paytm), Visa/Mastercard/RuPay cards, and all major Netbanking nodes.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#F4F7ED] p-4 rounded-2xl border border-leaf-light/10 text-[10px] text-leaf-dark font-black tracking-wide uppercase text-center">
                  🔒 Encrypted Payment Gateways & Safe Delivery Slot Allocation
                </div>
              </div>

              {/* Contact Details Info */}
              <div className="bg-white border border-leaf-light/10 p-8 rounded-[40px] shadow-sm flex flex-col justify-between space-y-6">
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-black text-saffron tracking-[0.2em] block">
                    Locate The Studio
                  </span>
                  <h3 className="font-yatra text-2xl sm:text-3xl text-leaf-dark">
                    Contact Details
                  </h3>
                  <div className="w-12 h-0.5 bg-brass/30 rounded-full mt-2"></div>
                </div>

                <div className="space-y-5">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-50 text-charcoal/60 rounded-xl shrink-0">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[9px] uppercase font-bold text-charcoal/40 block leading-none">Operations Director</span>
                      <span className="text-xs font-black text-charcoal leading-none block mt-1">Neha Nitin Page</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-slate-50 text-charcoal/60 rounded-xl shrink-0 mt-0.5">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[9px] uppercase font-bold text-charcoal/40 block leading-none">Central Satvik Kitchen</span>
                      <span className="text-xs font-bold text-charcoal leading-relaxed block mt-1">
                        B-202, Tarangan Residency, <br />
                        Raikar Vasti, Dhayari, Pune - 411041
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-50 text-charcoal/60 rounded-xl shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[9px] uppercase font-bold text-charcoal/40 block leading-none">Call / WhatsApp</span>
                      <span className="text-xs font-black text-leaf-dark leading-none block mt-1">8380070757 / 9890990757</span>
                    </div>
                  </div>
                </div>

                <a
                  href="https://web.whatsapp.com/send?phone=918380070757"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full p-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/10 text-xs tracking-wider uppercase cursor-pointer"
                >
                  💬 Connect on WhatsApp
                </a>
              </div>

            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-charcoal text-white/40 border-t border-brass/10 py-12 text-center text-xs">
        <div className="max-w-4xl mx-auto px-4 space-y-4 font-semibold">
          <p className="text-white/80 font-yatra text-2xl tracking-wide">
            {tirthMarathi} – The Food Studio
          </p>
          <p className="text-[11px] leading-relaxed max-w-md mx-auto">
            Operations Director: Neha Nitin Page <br />
            Address: B-202, Tarangan Residency, Raikar Vasti, Dhayari, Pune <br />
            Support Hotline: 8380070757 / 9890990757
          </p>
          <div className="w-12 h-0.5 bg-brass/20 mx-auto rounded-full"></div>
          
          <div className="flex gap-4 justify-center text-[10px] text-white/30 uppercase tracking-wider font-bold">
            <Link href="/admin" className="hover:text-white transition-colors flex items-center gap-1">
              🔐 Owner Panel
            </Link>
            <span>·</span>
            <Link href="/order" className="hover:text-white transition-colors">
              Menu Store
            </Link>
            <span>·</span>
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          </div>

          <p className="text-[10px] text-white/20 font-normal">
            &copy; {new Date().getFullYear()} {tirthMarathi}. Pure Veg Satvik Kitchen. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

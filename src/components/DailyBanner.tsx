'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { dbService } from '@/lib/db';
import { Sparkles, Megaphone, Ticket, Check } from 'lucide-react';

export default function DailyBanner() {
  const { settings, applyCoupon, coupon, removeCoupon } = useCart();
  const [couponStatus, setCouponStatus] = useState<string | null>(null);

  const coupons = dbService.getCoupons();

  const handleApplyCoupon = (code: string) => {
    const result = applyCoupon(code);
    if (result.success) {
      setCouponStatus(`Successfully applied ${code}!`);
      setTimeout(() => setCouponStatus(null), 3000);
    } else {
      setCouponStatus(`Error: ${result.message}`);
      setTimeout(() => setCouponStatus(null), 3000);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 mt-4 select-none">
      {/* ANNOUNCEMENT BOARD */}
      {settings.announcementText && (
        <div className="relative overflow-hidden bg-gradient-to-r from-saffron to-saffron-dark text-white p-3 px-4 rounded-2xl shadow-md flex items-center gap-3.5 border border-brass/20 mb-4">
          <div className="absolute top-0 right-0 w-24 h-24 pointer-events-none opacity-10 bg-white rounded-full translate-x-8 -translate-y-8 animate-pulse"></div>
          <div className="p-2 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
            <Megaphone className="w-4 h-4 text-brass" />
          </div>
          <div className="overflow-hidden relative w-full h-5 flex items-center">
            <div className="absolute flex gap-4 whitespace-nowrap animate-[marquee_20s_linear_infinite] hover:[animation-play-state:paused]">
              <span className="font-outfit font-bold text-xs tracking-wide">
                {settings.announcementText}
              </span>
              {/* Duplicate for infinite marquee effect */}
              <span className="font-outfit font-bold text-xs tracking-wide">
                {settings.announcementText}
              </span>
              <span className="font-outfit font-bold text-xs tracking-wide">
                {settings.announcementText}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* DYNAMIC COUPON BOARD */}
      <div className="bg-cream-dark border-2 border-leaf-light/10 p-5 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-5 relative">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-leaf-light/10 text-leaf rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
            <Ticket className="w-6 h-6 text-saffron" />
          </div>
          <div>
            <span className="p-0.5 px-2 bg-leaf-light/10 text-leaf text-[9px] font-bold tracking-wider uppercase rounded-full inline-block mb-1">
              Big Savings
            </span>
            <h3 className="font-yatra font-bold text-base text-charcoal tracking-tight">
              Apply Satvik Food Coupons!
            </h3>
            <p className="text-xs text-charcoal/60 mt-0.5 max-w-md leading-relaxed">
              Order fresh Poli/Bhakri and Thali. Click any coupon below to instantly unlock your discount.
            </p>
          </div>
        </div>

        {/* Coupon pill stack */}
        <div className="flex flex-wrap items-center justify-center gap-3 w-full md:w-auto z-10">
          {coupons.map((c) => {
            const isApplied = coupon?.code === c.code;
            return (
              <button
                key={c.code}
                onClick={() => isApplied ? removeCoupon() : handleApplyCoupon(c.code)}
                className={`p-2 px-3.5 rounded-2xl text-xs font-semibold font-outfit border tracking-wide transition-all duration-300 flex items-center gap-1.5 active:scale-95 shadow-sm ${
                  isApplied
                    ? 'bg-leaf text-white border-leaf shadow-leaf/10'
                    : 'bg-white text-charcoal border-leaf-light/20 hover:border-leaf-light/40'
                }`}
                title={c.description}
              >
                {isApplied ? (
                  <Check className="w-3.5 h-3.5 text-brass" />
                ) : (
                  <span className="w-1.5 h-1.5 bg-saffron rounded-full"></span>
                )}
                {c.code}
                <span className={`text-[10px] ml-0.5 ${isApplied ? 'text-brass' : 'text-saffron font-bold'}`}>
                  {c.discountPercent === 100 ? '₹40 OFF' : `${c.discountPercent}% OFF`}
                </span>
              </button>
            );
          })}
        </div>

        {/* Announcement text overlay absolute alert */}
        {couponStatus && (
          <div className="absolute top-1.5 right-4 z-20 text-[10px] bg-charcoal text-white p-1 px-3 rounded-full font-bold animate-bounce shadow-md">
            {couponStatus}
          </div>
        )}
      </div>

      {/* CSS custom styles for daily banner marquee */}
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-33.33%); }
        }
      `}</style>
    </div>
  );
}

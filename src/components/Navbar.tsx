'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, Menu, X, ShieldAlert, Sparkles, RotateCcw } from 'lucide-react';

export default function Navbar() {
  const { cart, total } = useCart();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/#about-us', label: 'About Us' },
    { href: '/order', label: 'Order Now', icon: Sparkles },
    { href: '/reorder', label: 'Quick Reorder', icon: RotateCcw },
    { href: '/#contact-us', label: 'Contact' },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 transition-all duration-300 w-full font-sans select-none">
        {/* TOP BAR: Dark Green with details */}
        <div className="bg-[#5A6E3B] text-white text-[10px] sm:text-xs font-bold tracking-wider py-2 px-4 shadow-sm">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-1 sm:gap-4">
            {/* Phone numbers */}
            <div className="flex items-center gap-1">
              <span>📞 +91 8380070757 / +91 9890990757</span>
            </div>
            
            {/* Title / Description */}
            <div className="flex items-center gap-4 text-[9px] sm:text-[10px] opacity-90 uppercase tracking-widest">
              <span>TIRTH – THE FOOD STUDIO</span>
              <span className="hidden md:inline">|</span>
              <span className="hidden md:inline">DAILY FRESH VEG TIFFIN</span>
            </div>
          </div>
        </div>

        {/* MAIN NAVIGATION BAR: Sage Green */}
        <div className="bg-[#C5D3A6] border-b border-[#FAF8F5]/10 shadow-md">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-24 flex items-center justify-between">
            {/* LOGO AREA: Enlarged Logo Image */}
            <Link href="/" className="flex items-center group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/logo.png" 
                alt="तीर्थ – The Food Studio" 
                className="h-20 sm:h-22 w-auto object-contain group-hover:scale-105 transition-transform duration-300 shrink-0 mix-blend-multiply"
                style={{ mixBlendMode: 'multiply' }}
              />
            </Link>

            {/* DESKTOP NAV LINKS: Uppercase bold white text */}
            <nav className="hidden md:flex items-center gap-8 text-white font-black tracking-widest text-xs uppercase">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`transition-colors duration-300 py-2 hover:text-[#5A6E3B] relative ${
                      isActive ? 'text-[#5A6E3B]' : 'text-white'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.75 bg-[#5A6E3B] rounded-full"></span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* RIGHT SIDE BUTTONS (DESKTOP) */}
            <div className="hidden md:flex items-center gap-5">
              <Link
                href="/admin"
                className="p-2 text-white hover:text-[#5A6E3B] transition-colors rounded-full hover:bg-white/10"
                title="Admin Panel"
              >
                <ShieldAlert className="w-5 h-5" />
              </Link>

              <Link
                href="/cart"
                className="relative p-3 bg-white hover:bg-cream text-[#5A6E3B] rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 shadow-sm"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#5A6E3B] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#C5D3A6] animate-bounce">
                    {cartItemsCount}
                  </span>
                )}
              </Link>
            </div>

            {/* MOBILE MENU TRIGGER */}
            <div className="flex md:hidden items-center gap-3">
              <Link
                href="/cart"
                className="relative p-2 text-white hover:text-[#5A6E3B] transition-colors"
              >
                <ShoppingBag className="w-6 h-6" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#5A6E3B] text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </Link>
              
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-white hover:text-[#5A6E3B] transition-colors cursor-pointer"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE MENU CONTAINER */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#C5D3A6] border-b border-[#FAF8F5]/10 py-4 px-4 animate-fade-in absolute w-full left-0 shadow-lg z-50">
            <div className="flex flex-col gap-3 font-bold tracking-wider text-xs uppercase text-white">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`py-2 px-3 rounded-lg transition-colors ${
                    pathname === link.href 
                      ? 'bg-white/20 text-[#5A6E3B]' 
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <hr className="border-white/10 my-1" />
              <div className="flex items-center justify-between px-3 py-2 text-[10px] text-white/80">
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-white flex items-center gap-1.5"
                >
                  <ShieldAlert className="w-4 h-4" /> Owner Login
                </Link>
                {cartItemsCount > 0 && (
                  <span className="font-bold text-white">
                    Cart Total: ₹{total}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* FLOATING BOTTOM MOBILE CART BAR */}
      {cartItemsCount > 0 && pathname !== '/cart' && (
        <div className="fixed bottom-6 left-4 right-4 z-40 md:hidden animate-slide-up">
          <Link
            href="/cart"
            className="flex items-center justify-between bg-gradient-to-r from-leaf to-leaf-dark text-white p-4 rounded-2xl shadow-xl shadow-leaf/30 border border-brass/30 active:scale-95 transition-transform"
          >
            <div className="flex items-center gap-3">
              <div className="relative p-2 bg-white/10 rounded-lg">
                <ShoppingBag className="w-5 h-5 text-white" />
                <span className="absolute -top-1 -right-1 bg-saffron text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartItemsCount}
                </span>
              </div>
              <div>
                <p className="text-[10px] text-white/70 font-semibold tracking-wide">Your fresh order</p>
                <p className="text-sm font-bold">{cartItemsCount} {cartItemsCount === 1 ? 'Item' : 'Items'}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-1.5 font-bold text-sm bg-white/10 p-2 px-3 rounded-xl border border-white/10">
              View Cart · ₹{total} <Sparkles className="w-4 h-4 text-brass" />
            </div>
          </Link>
        </div>
      )}
    </>
  );
}

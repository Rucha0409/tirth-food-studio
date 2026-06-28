'use client';

import React from 'react';
import { MenuItem, OrderItem } from '@/lib/db';
import { useCart } from '@/context/CartContext';
import { Plus, Minus, Star, Clock, Sparkles } from 'lucide-react';

interface DishCardProps {
  item: MenuItem;
}

export default function DishCard({ item }: DishCardProps) {
  const { cart, addToCart, updateQuantity } = useCart();

  // Find if this item is in the cart
  const cartItem = cart.find(i => i.menuItem.id === item.id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  return (
    <div 
      className={`relative satvik-card border-2 border-leaf/20 flex flex-col justify-between overflow-hidden p-4 sm:p-5 select-none hover:border-leaf/40 hover:shadow-lg transition-all duration-300 ${
        !item.isAvailable ? 'opacity-65 grayscale-[30%] pointer-events-none' : ''
      }`}
    >
      {/* Dynamic badging */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 items-start">
        {/* Veg Dot Indicator */}
        {item.isVeg && (
          <span className="bg-white p-1 rounded border border-emerald-600 shadow-sm flex items-center justify-center">
            <span className="w-2.5 h-2.5 bg-emerald-600 rounded-full"></span>
          </span>
        )}

        {/* Special tag */}
        {item.isSpecial && item.isAvailable && (
          <span className="p-1 px-2.5 bg-saffron text-white text-[9px] font-bold tracking-wider uppercase rounded-full shadow-sm flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5 text-brass" /> Today's Special
          </span>
        )}
      </div>

      {/* SOLD OUT OVERLAY */}
      {!item.isAvailable && (
        <div className="absolute inset-0 bg-cream/70 backdrop-blur-[1px] flex items-center justify-center z-10">
          <span className="p-2 px-4 bg-charcoal text-white font-outfit font-bold rounded-2xl tracking-widest border border-brass shadow-lg uppercase text-xs">
            Sold Out
          </span>
        </div>
      )}

      {/* IMAGE CONTAINER */}
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-4 bg-cream-dark">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-black/50 to-transparent"></div>
        
        {/* Rating overlay */}
        <div className="absolute bottom-3 right-3 bg-cream-light/95 backdrop-blur-sm p-1 px-2 rounded-xl text-[10px] font-bold text-charcoal shadow-sm flex items-center gap-0.5 border border-leaf-light/10">
          <Star className="w-3.5 h-3.5 fill-amber-500 stroke-amber-500" />
          {item.rating.toFixed(1)} <span className="text-charcoal/50">({item.reviewsCount})</span>
        </div>

        {/* Prepare time overlay */}
        <div className="absolute bottom-3 left-3 bg-cream-light/95 backdrop-blur-sm p-1 px-2 rounded-xl text-[10px] font-bold text-charcoal shadow-sm flex items-center gap-1 border border-leaf-light/10">
          <Clock className="w-3.5 h-3.5 text-leaf" />
          {item.timeToPrepare} mins
        </div>
      </div>

      {/* DISH BODY */}
      <div>
        <span className="font-noto-dev text-sm sm:text-base font-black text-[#5A6E3B] tracking-wide block mb-0.5">
          {item.nameDevnagari}
        </span>
        <h3 className="font-outfit font-extrabold text-lg text-charcoal tracking-tight leading-snug">
          {item.name}
        </h3>
        <p className="text-xs text-charcoal/60 mt-1 leading-relaxed line-clamp-2">
          {item.description}
        </p>
      </div>

      {/* FOOTER: Price & Checkout controls */}
      <div className="mt-4 pt-3 border-t border-leaf-light/10 flex items-center justify-between">
        {/* Price display */}
        <div>
          <span className="text-[10px] text-charcoal/40 font-semibold uppercase block leading-none">Price</span>
          <span className="font-outfit font-black text-xl text-charcoal">₹{item.price}</span>
        </div>

        {/* Add/Edit buttons */}
        <div className="z-20">
          {quantityInCart === 0 ? (
            <button
              onClick={() => addToCart(item, 1)}
              className="p-2 px-4 bg-leaf hover:bg-leaf-dark text-white rounded-full flex items-center gap-1 transition-all duration-300 shadow-md shadow-leaf/10 active:scale-95 text-xs font-semibold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-cream-dark border border-leaf-light/20 p-1.5 rounded-full shadow-inner">
              <button
                onClick={() => updateQuantity(item.id, quantityInCart - 1)}
                className="p-1 bg-white hover:bg-cream-dark text-charcoal rounded-full transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3 h-3" />
              </button>
              
              <span className="font-outfit font-bold text-xs px-1.5 text-charcoal w-4 text-center">
                {quantityInCart}
              </span>
              
              <button
                onClick={() => updateQuantity(item.id, quantityInCart + 1)}
                className="p-1 bg-leaf text-white hover:bg-leaf-dark rounded-full transition-colors animate-pulse"
                aria-label="Increase quantity"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

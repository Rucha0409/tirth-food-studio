'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useCart } from '@/context/CartContext';
import { dbService, Order } from '@/lib/db';
import { RotateCcw, Clock, ArrowRight, ShoppingBag, Calendar, CheckCircle } from 'lucide-react';

export default function ReorderPage() {
  const router = useRouter();
  const { addToCart, clearCart } = useCart();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // Fetch previous orders from local storage
    const pastOrders = dbService.getOrders();
    setOrders(pastOrders);
  }, []);

  const handleReorder = (order: Order) => {
    // 1. Clear active cart
    clearCart();
    
    // 2. Add all items from the previous order to the cart
    order.items.forEach(item => {
      addToCart(item.menuItem, item.quantity);
    });

    // 3. Redirect user directly to the checkout cart page
    router.push('/cart');
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gradient-to-b from-cream-light via-background to-cream-dark py-10 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 select-none">
          
          {/* HEADER */}
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-leaf-light/10 text-leaf rounded-2xl flex items-center justify-center shadow-inner shrink-0">
              <RotateCcw className="w-6 h-6 text-saffron" />
            </div>
            <div>
              <h1 className="font-yatra font-black text-2xl sm:text-3xl text-leaf-dark tracking-tight">
                Quick Reorder
              </h1>
              <p className="text-xs text-charcoal/60 mt-0.5">
                Reorder your favourite Maharashtrian meal with one click.
              </p>
            </div>
          </div>

          {/* ORDERS HISTORY TIMELINE */}
          {orders.length > 0 ? (
            <div className="space-y-6">
              {orders.map((order) => {
                const totalItemsCount = order.items.reduce((sum, i) => sum + i.quantity, 0);
                const orderDate = new Date(order.createdAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                });

                return (
                  <div 
                    key={order.id} 
                    className="bg-white border border-leaf-light/10 p-5 rounded-3xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col md:flex-row justify-between md:items-center gap-5"
                  >
                    {/* Visual left accent strip */}
                    <div className="absolute left-0 inset-y-0 w-1.5 bg-saffron"></div>

                    {/* Order Details */}
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="font-outfit font-black text-sm text-charcoal tracking-tight">
                          {order.id}
                        </span>
                        <span className="p-0.5 px-2 bg-leaf/10 text-leaf text-[9px] font-bold tracking-wider uppercase rounded-full flex items-center gap-0.5">
                          <CheckCircle className="w-3 h-3 text-leaf" /> Confirmed
                        </span>
                        <span className="text-[10px] text-charcoal/40 font-semibold flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" /> {orderDate}
                        </span>
                      </div>

                      {/* Items billing text list */}
                      <div className="text-xs text-charcoal/70 font-semibold">
                        {order.items.map((i, index) => (
                          <span key={i.menuItem.id}>
                            {i.menuItem.name} (x{i.quantity})
                            {index < order.items.length - 1 ? ', ' : ''}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-4 text-[10px] text-charcoal/40 font-semibold pt-1">
                        <span className="flex items-center gap-0.5"><Clock className="w-3.5 h-3.5" /> Slot: {order.timeSlot.includes('Afternoon') ? 'Afternoon' : order.timeSlot.includes('Evening') ? 'Evening' : order.timeSlot}</span>
                        <span>·</span>
                        <span>Total: ₹{order.total}</span>
                      </div>
                    </div>

                    {/* Reorder Button */}
                    <button
                      onClick={() => handleReorder(order)}
                      className="p-3 px-6 bg-leaf hover:bg-leaf-dark text-white text-xs font-bold rounded-2xl flex items-center justify-center gap-1.5 shadow-md shadow-leaf/15 hover:scale-105 active:scale-95 transition-all shrink-0 cursor-pointer self-start md:self-auto border border-white/5"
                    >
                      <RotateCcw className="w-4 h-4 text-brass" /> Reorder This Meal <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            /* NO HISTORY FALLBACK */
            <div className="satvik-card bg-white p-12 text-center flex flex-col items-center justify-center max-w-md mx-auto border-dashed border-2 border-leaf-light/20 mt-10">
              <ShoppingBag className="w-12 h-12 text-saffron mb-4 animate-bounce" />
              <h3 className="font-yatra font-bold text-lg text-leaf-dark tracking-tight">No Order History Yet</h3>
              <p className="text-xs text-charcoal/60 mt-1 max-w-xs leading-relaxed">
                You haven't placed any orders yet. After your first order, quick reorder will appear here!
              </p>
              <Link
                href="/order"
                className="mt-6 p-3 px-6 bg-leaf hover:bg-leaf-dark text-white text-xs font-bold rounded-full flex items-center gap-2 transition-colors shadow-md shadow-leaf/10 cursor-pointer"
              >
                View Menu <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

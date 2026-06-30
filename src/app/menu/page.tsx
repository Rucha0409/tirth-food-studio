'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import DailyBanner from '@/components/DailyBanner';
import DishCard from '@/components/DishCard';
import { MenuItem, subscribeToMenu } from '@/lib/db';
import { Search, SlidersHorizontal, RefreshCw, Sparkles, AlertCircle } from 'lucide-react';

export default function MenuPage() {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showSpecialsOnly, setShowSpecialsOnly] = useState(false);
  const [showVegOnly, setShowVegOnly] = useState(false);

  // Real-time menu listener — updates instantly when admin adds/edits/removes dishes
  useEffect(() => {
    const unsub = subscribeToMenu((items) => setMenu(items));
    return () => unsub();
  }, []);

  const categories = [
    { value: 'All', label: 'All' },
    { value: 'everyday', label: 'Everyday Tiffin / रोजचा डबा' },
    { value: 'customize', label: 'Customize Menu / इतर पदार्थ' },
    { value: 'special', label: 'Special Order / विशेष ऑर्डर' }
  ];

  // Filter logic
  const filteredMenu = menu.filter((item) => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nameDevnagari.includes(searchQuery) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory = 
      selectedCategory === 'All' || 
      item.category === selectedCategory;
      
    const matchesSpecial = !showSpecialsOnly || item.isSpecial;
    const matchesVeg = !showVegOnly || item.isVeg;

    return matchesSearch && matchesCategory && matchesSpecial && matchesVeg;
  });

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setShowSpecialsOnly(false);
    setShowVegOnly(false);
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gradient-to-b from-cream-light via-background to-cream-dark pb-24">
        {/* Dynamic Promotional Banner */}
        <DailyBanner />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 select-none">
          {/* MENU HEADER */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-[10px] uppercase font-bold text-saffron tracking-widest block mb-1">Fresh & Pure Vegetarian</span>
              <h1 className="font-yatra font-black text-3xl sm:text-4xl text-leaf-dark tracking-tight">
                Our Satvik Menu
              </h1>
              <p className="text-xs text-charcoal/60 mt-1">
                Authentic, fresh, stone-ground spice Maharashtrian meals for health and homely taste.
              </p>
            </div>

            {/* Quick stats indicator */}
            <div className="flex items-center gap-2 p-1.5 px-3.5 bg-leaf-light/10 text-leaf rounded-2xl text-xs font-semibold w-fit border border-leaf-light/10">
              <Sparkles className="w-3.5 h-3.5 text-brass" />
              {filteredMenu.length} Authentic {filteredMenu.length === 1 ? 'Dish' : 'Dishes'}
            </div>
          </div>

          {/* SEARCH & FILTER CONTROLS */}
          <div className="bg-white border border-leaf-light/10 p-4 sm:p-5 rounded-3xl shadow-sm mb-8 flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search Bar */}
              <div className="relative flex-grow">
                <Search className="absolute left-4.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-charcoal/40" />
                <input
                  type="text"
                  placeholder="Search: Puranpoli, Thali, Bhaji, Modak..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 p-3 bg-cream border border-leaf-light/20 focus:border-leaf focus:ring-1 focus:ring-leaf rounded-2xl text-xs text-charcoal font-semibold shadow-inner placeholder:text-charcoal/30"
                />
              </div>
              
              {/* Quick filter checkboxes */}
              <div className="flex items-center gap-4 shrink-0 px-2">
                <label className="flex items-center gap-2 text-xs font-bold text-charcoal cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showSpecialsOnly}
                    onChange={(e) => setShowSpecialsOnly(e.target.checked)}
                    className="accent-saffron w-4.5 h-4.5 rounded-lg border-leaf-light/20"
                  />
                  Specials Only
                </label>
                
                <label className="flex items-center gap-2 text-xs font-bold text-charcoal cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showVegOnly}
                    onChange={(e) => setShowVegOnly(e.target.checked)}
                    className="accent-leaf w-4.5 h-4.5 rounded-lg border-leaf-light/20"
                  />
                  Pure Veg
                </label>
              </div>
            </div>

            {/* CATEGORY TABS */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
              <span className="text-[10px] uppercase font-bold text-charcoal/40 flex items-center gap-1 mr-2 shrink-0">
                <SlidersHorizontal className="w-3.5 h-3.5" /> Category:
              </span>
              
              {categories.map((cat) => {
                const isActive = selectedCategory === cat.value;
                return (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`p-2 px-4 text-xs font-bold font-outfit rounded-2xl border transition-all shrink-0 cursor-pointer ${
                      isActive
                        ? 'bg-leaf text-white border-leaf shadow-sm shadow-leaf/10'
                        : 'bg-cream text-charcoal border-leaf-light/10 hover:border-leaf-light/35'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* MENUS GRID */}
          {filteredMenu.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMenu.map((item) => (
                <DishCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            /* EMPTY FALLBACK */
            <div className="satvik-card bg-white p-12 text-center flex flex-col items-center justify-center max-w-md mx-auto border-dashed border-2 border-leaf-light/20">
              <AlertCircle className="w-12 h-12 text-saffron mb-4 animate-bounce" />
              <h3 className="font-yatra font-bold text-lg text-charcoal tracking-tight">No dishes found</h3>
              <p className="text-xs text-charcoal/60 mt-1 max-w-xs leading-relaxed">
                No items matched your search. Try a different filter or reset.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-5 p-2.5 px-5 bg-leaf hover:bg-leaf-dark text-white text-xs font-bold rounded-full flex items-center gap-1.5 transition-colors shadow-md shadow-leaf/10 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Reset Filters
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

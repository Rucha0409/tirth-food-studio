'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Sparkles, Utensils, Heart } from 'lucide-react';

export default function ThaliGraphic() {
  const { cart } = useCart();
  const [hoveredBowl, setHoveredBowl] = useState<string | null>(null);

  // Check which categories/dishes are in the active cart to highlight them
  const hasVegThali = cart.some(i => i.menuItem.id === 'm1');
  const hasUtsavThali = cart.some(i => i.menuItem.id === 'm2');
  const hasPuranPoli = cart.some(i => i.menuItem.name.toLowerCase().includes('poli') || i.menuItem.id === 'm3');
  const hasBhaji = cart.some(i => i.menuItem.name.toLowerCase().includes('bhaji') || i.menuItem.name.toLowerCase().includes('vangi') || i.menuItem.id === 'm5');
  const hasRice = cart.some(i => i.menuItem.name.toLowerCase().includes('rice') || i.menuItem.name.toLowerCase().includes('biryani') || i.menuItem.name.toLowerCase().includes('khichdi') || i.menuItem.id === 'm7');
  const hasSolkadhi = cart.some(i => i.menuItem.name.toLowerCase().includes('solkadhi') || i.menuItem.id === 'm8');

  // Define components for tooltip or description
  const bowls = [
    { id: 'amti', name: 'वरण / आमटी (Tempered Lentil)', status: hasVegThali || hasUtsavThali, desc: 'Fragrant Katachi Amti / Varan made with Goda Masala', cx: 160, cy: 110, r: 32, color: 'bg-amber-500' },
    { id: 'vangi', name: 'भरली वांगी (Stuffed Brinjal)', status: hasUtsavThali || hasBhaji, desc: 'Slow-cooked brinjals stuffed with peanut coconut paste', cx: 240, cy: 110, r: 32, color: 'bg-yellow-700' },
    { id: 'koshimbir', name: 'कोशिंबीर (Tempered Salad)', status: hasVegThali || hasUtsavThali, desc: 'Fresh cucumber & peanut yogurt salad', cx: 310, cy: 160, r: 28, color: 'bg-emerald-100' },
    { id: 'solkadhi', name: 'सोलकढी (Digestive Elixir)', status: hasSolkadhi || hasUtsavThali, desc: 'Refreshing Konkan pink drink with kokum & coconut milk', cx: 320, cy: 240, r: 28, color: 'bg-rose-300' },
    { id: 'pithla', name: 'झणझणीत पिठलं (Gram Flour Curry)', status: hasUtsavThali, desc: 'Rich and spicy tempered chickpea flour curry', cx: 90, cy: 170, r: 30, color: 'bg-amber-600' },
    { id: 'rice', name: 'सुगंधी भात (Indrayani Rice)', status: hasRice || hasVegThali || hasUtsavThali, desc: 'Steaming heap of aromatic soft Indrayani rice', cx: 200, cy: 240, r: 55, color: 'bg-neutral-50' },
    { id: 'poli', name: 'साजूक तुपातली पुरणपोळी', status: hasPuranPoli || hasUtsavThali, desc: 'Soft sweet jaggery flatbread dripping with pure ghee', cx: 120, cy: 260, r: 40, color: 'bg-amber-100' }
  ];

  return (
    <div className="relative satvik-card p-6 md:p-8 flex flex-col items-center justify-center max-w-md mx-auto w-full overflow-hidden select-none border-2 border-leaf-light/20 bg-gradient-to-br from-cream-light via-cream to-cream-dark">
      {/* Decorative leaf border accents */}
      <div className="absolute top-0 left-0 w-16 h-16 pointer-events-none opacity-20 transform -rotate-12">
        <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" className="text-leaf w-full h-full">
          <path d="M10,90 Q50,50 90,10 M50,50 Q40,30 30,20 M50,50 Q60,30 70,20 M50,50 Q30,40 20,30 M50,50 Q70,40 80,30" strokeWidth="2" />
        </svg>
      </div>
      <div className="absolute bottom-0 right-0 w-16 h-16 pointer-events-none opacity-20 transform rotate-180">
        <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" className="text-leaf w-full h-full">
          <path d="M10,90 Q50,50 90,10 M50,50 Q40,30 30,20 M50,50 Q60,30 70,20 M50,50 Q30,40 20,30 M50,50 Q70,40 80,30" strokeWidth="2" />
        </svg>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <span className="p-1 px-3 bg-leaf-light/10 text-leaf text-xs rounded-full font-medium flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-brass" /> Interactive Thali View
        </span>
      </div>

      {/* THALI SVG CONTAINER */}
      <div className="relative w-full max-w-[340px] aspect-square flex items-center justify-center animate-float">
        <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-2xl">
          {/* BANANA LEAF UNDERLAY */}
          <path 
            d="M 50,200 Q 200,80 350,200 Q 200,320 50,200 Z" 
            fill="#4C9F62" 
            className="transition-all duration-500 opacity-90 hover:fill-[#3E8D52]" 
          />
          {/* Leaf Midrib */}
          <path d="M 50,200 Q 200,200 350,200" stroke="#87D38C" strokeWidth="3" fill="none" opacity="0.6" />
          {/* Leaf Veins */}
          <path d="M 100,165 Q 120,180 130,200 M 150,140 Q 170,165 180,200 M 200,125 Q 220,155 230,200 M 250,120 Q 270,150 280,200" stroke="#87D38C" strokeWidth="1" fill="none" opacity="0.4" />
          <path d="M 100,235 Q 120,220 130,200 M 150,260 Q 170,235 180,200 M 200,275 Q 220,245 230,200 M 250,280 Q 270,250 280,200" stroke="#87D38C" strokeWidth="1" fill="none" opacity="0.4" />

          {/* STEEL / BRASS THALI PLATE */}
          <circle cx="200" cy="200" r="165" fill="#EADCC9" stroke="#CBB28C" strokeWidth="4" className="shadow-inner" />
          <circle cx="200" cy="200" r="158" fill="#F4EDE1" stroke="#DFD0BC" strokeWidth="2" />
          <circle cx="200" cy="200" r="155" fill="none" stroke="#D4AF37" strokeWidth="1" strokeDasharray="3 3" opacity="0.8" />

          {/* KATORIS (BOWLS) */}
          {/* 1. Amti Katori */}
          <g 
            className="cursor-pointer group"
            onMouseEnter={() => setHoveredBowl('amti')}
            onMouseLeave={() => setHoveredBowl(null)}
          >
            <circle cx="160" cy="110" r="32" fill="#8C7355" stroke="#BF9E75" strokeWidth="2" />
            <circle cx="160" cy="110" r="28" fill="#D29221" />
            {/* Ghee Pool */}
            <circle cx="155" cy="105" r="8" fill="#F2C14E" opacity="0.8" />
            {/* Highlight Ring */}
            {hasVegThali || hasUtsavThali ? (
              <circle cx="160" cy="110" r="32" stroke="#E25822" strokeWidth="3" fill="none" className="animate-pulse" />
            ) : null}
            {/* Steam lines */}
            {(hasVegThali || hasUtsavThali) && (
              <path d="M 155,90 Q 160,80 155,72 M 165,90 Q 170,82 165,74" stroke="#FFF" strokeWidth="1.5" fill="none" className="steam-line opacity-60" />
            )}
          </g>

          {/* 2. Bharli Vangi Katori */}
          <g 
            className="cursor-pointer group"
            onMouseEnter={() => setHoveredBowl('vangi')}
            onMouseLeave={() => setHoveredBowl(null)}
          >
            <circle cx="240" cy="110" r="32" fill="#8C7355" stroke="#BF9E75" strokeWidth="2" />
            <circle cx="240" cy="110" r="28" fill="#592015" />
            {/* Small brinjal crown outline inside */}
            <path d="M 230,105 Q 240,120 250,110 M 235,115 L 245,115" stroke="#3A6B41" strokeWidth="2" fill="none" />
            <circle cx="240" cy="110" r="8" fill="#A8321D" opacity="0.3" />
            {hasUtsavThali || hasBhaji ? (
              <circle cx="240" cy="110" r="32" stroke="#E25822" strokeWidth="3" fill="none" className="animate-pulse" />
            ) : null}
            {(hasUtsavThali || hasBhaji) && (
              <path d="M 235,90 Q 240,80 235,72 M 245,90 Q 250,82 245,74" stroke="#FFF" strokeWidth="1.5" fill="none" className="steam-line opacity-60" />
            )}
          </g>

          {/* 3. Pithla Katori */}
          <g 
            className="cursor-pointer group"
            onMouseEnter={() => setHoveredBowl('pithla')}
            onMouseLeave={() => setHoveredBowl(null)}
          >
            <circle cx="95" cy="165" r="30" fill="#8C7355" stroke="#BF9E75" strokeWidth="2" />
            <circle cx="95" cy="165" r="26" fill="#EDB633" />
            {/* Coriander pieces */}
            <circle cx="90" cy="160" r="2" fill="#3E8D52" />
            <circle cx="100" cy="170" r="2.5" fill="#3E8D52" />
            <circle cx="95" cy="155" r="1.5" fill="#3E8D52" />
            {hasUtsavThali ? (
              <circle cx="95" cy="165" r="30" stroke="#E25822" strokeWidth="3" fill="none" className="animate-pulse" />
            ) : null}
            {hasUtsavThali && (
              <path d="M 90,145 Q 95,135 90,127 M 100,145 Q 105,137 100,129" stroke="#FFF" strokeWidth="1.5" fill="none" className="steam-line opacity-60" />
            )}
          </g>

          {/* 4. Koshimbir */}
          <g 
            className="cursor-pointer group"
            onMouseEnter={() => setHoveredBowl('koshimbir')}
            onMouseLeave={() => setHoveredBowl(null)}
          >
            <circle cx="305" cy="155" r="26" fill="#8C7355" stroke="#BF9E75" strokeWidth="2" />
            <circle cx="305" cy="155" r="22" fill="#EAF2EB" />
            {/* Cucumber chunks visual representation */}
            <rect x="298" y="148" width="5" height="5" rx="1" fill="#71A879" />
            <rect x="306" y="154" width="4" height="4" rx="1" fill="#71A879" />
            <circle cx="305" cy="146" r="2" fill="#E25822" /> {/* Tomato */}
            {hasVegThali || hasUtsavThali ? (
              <circle cx="305" cy="155" r="26" stroke="#E25822" strokeWidth="2" fill="none" />
            ) : null}
          </g>

          {/* 5. Solkadhi */}
          <g 
            className="cursor-pointer group"
            onMouseEnter={() => setHoveredBowl('solkadhi')}
            onMouseLeave={() => setHoveredBowl(null)}
          >
            <circle cx="310" cy="230" r="26" fill="#8C7355" stroke="#BF9E75" strokeWidth="2" />
            <circle cx="310" cy="230" r="22" fill="#EDA4B5" />
            {/* Small green chilli ring float */}
            <circle cx="308" cy="226" r="3" stroke="#5EA36A" strokeWidth="1" fill="none" />
            {hasSolkadhi || hasUtsavThali ? (
              <circle cx="310" cy="230" r="26" stroke="#E25822" strokeWidth="2" fill="none" />
            ) : null}
          </g>

          {/* RICE HEAP IN MIDDLE */}
          <g 
            className="cursor-pointer"
            onMouseEnter={() => setHoveredBowl('rice')}
            onMouseLeave={() => setHoveredBowl(null)}
          >
            {/* Outer soft rice shadow */}
            <circle cx="200" cy="230" r="50" fill="#EFEFEF" opacity="0.9" />
            {/* Main Rice Dome */}
            <circle cx="200" cy="225" r="44" fill="#FFFFFF" />
            {/* Textured rice grains (SVG dots & path rings) */}
            <circle cx="185" cy="210" r="3" fill="#F4F4F4" />
            <circle cx="215" cy="215" r="2.5" fill="#EAEAEA" />
            <circle cx="205" cy="245" r="3.5" fill="#EAEAEA" />
            <circle cx="178" cy="232" r="2" fill="#F0F0F0" />
            
            {/* Pure Ghee pool on rice */}
            <ellipse cx="200" cy="222" rx="10" ry="6" fill="#FCDA79" opacity="0.8" />
            <ellipse cx="198" cy="220" rx="6" ry="3.5" fill="#FFF2AD" opacity="0.9" />
            
            {/* Green Tulsi / Coriander Leaf on top */}
            <path d="M 200,215 Q 192,205 200,195 Q 208,205 200,215 Z" fill="#3D8D52" />
            <path d="M 200,215 Q 208,222 205,228" stroke="#3D8D52" strokeWidth="1" fill="none" />

            {hasRice || hasVegThali || hasUtsavThali ? (
              <circle cx="200" cy="225" r="48" stroke="#E25822" strokeWidth="2.5" fill="none" strokeDasharray="5 3" />
            ) : null}
            {(hasRice || hasVegThali || hasUtsavThali) && (
              <g className="steam-line opacity-75">
                <path d="M 195,185 Q 200,172 195,160" stroke="#FFF" strokeWidth="2" fill="none" />
                <path d="M 205,185 Q 210,174 205,162" stroke="#FFF" strokeWidth="2" fill="none" />
              </g>
            )}
          </g>

          {/* PURAN POLI */}
          <g 
            className="cursor-pointer"
            onMouseEnter={() => setHoveredBowl('poli')}
            onMouseLeave={() => setHoveredBowl(null)}
          >
            {/* Triangle folded Poli */}
            <path 
              d="M 100,265 Q 135,225 155,270 Q 125,305 100,265 Z" 
              fill="#EEC584" 
              stroke="#D2A35B" 
              strokeWidth="1.5" 
            />
            {/* Ghee Glaze reflection & Brown speckles */}
            <circle cx="120" cy="255" r="1.5" fill="#75501C" opacity="0.6" />
            <circle cx="135" cy="265" r="1.2" fill="#75501C" opacity="0.6" />
            <circle cx="115" cy="275" r="2" fill="#75501C" opacity="0.4" />
            <path d="M 115,255 Q 130,245 145,260" stroke="#FFF5D1" strokeWidth="2" fill="none" opacity="0.7" />
            
            {hasPuranPoli || hasUtsavThali ? (
              <path 
                d="M 98,263 Q 135,221 157,268 Q 125,307 98,263 Z" 
                stroke="#E25822" 
                strokeWidth="2.5" 
                fill="none" 
              />
            ) : null}
          </g>

          {/* PAPAD (Crispy item) */}
          <g className="cursor-pointer">
            <ellipse cx="265" cy="285" rx="24" ry="16" fill="#F4DEC3" stroke="#D3B792" strokeWidth="1" transform="rotate(-15, 265, 285)" />
            {/* Roasted speckles on papad */}
            <circle cx="260" cy="280" r="1" fill="#7C5D33" />
            <circle cx="270" cy="288" r="1.5" fill="#7C5D33" />
            <circle cx="250" cy="285" r="1.2" fill="#7C5D33" />
            <circle cx="275" cy="278" r="0.8" fill="#7C5D33" />
          </g>

          {/* LEMON WEDGES & THECHA */}
          <g>
            {/* Lemon */}
            <path d="M 285,200 Q 295,190 288,185 Z" fill="#E6D319" />
            {/* Red Pickle pile */}
            <ellipse cx="275" cy="188" rx="8" ry="5" fill="#A81D1D" />
            <circle cx="273" cy="186" r="1" fill="#EAD960" /> {/* Mustard seed */}
          </g>
        </svg>

        {/* Floating steams for aesthetics */}
        <div className="absolute top-[20%] left-[30%] pointer-events-none w-2 h-8 bg-white/20 rounded-full blur-[2px] animate-steam" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-[22%] left-[55%] pointer-events-none w-2 h-8 bg-white/20 rounded-full blur-[2px] animate-steam" style={{ animationDelay: '0.8s' }}></div>
        <div className="absolute top-[18%] left-[45%] pointer-events-none w-2 h-8 bg-white/20 rounded-full blur-[2px] animate-steam" style={{ animationDelay: '1.5s' }}></div>
      </div>

      {/* DYNAMIC INTERACTIVE INFORMATION PANEL */}
      <div className="mt-6 w-full text-center min-h-[64px] flex flex-col items-center justify-center">
        {hoveredBowl ? (
          <div className="animate-fade-in">
            <h4 className="font-outfit font-semibold text-leaf text-base flex items-center justify-center gap-1">
              <Utensils className="w-4 h-4 text-saffron" /> {hoveredBowl === 'rice' || hoveredBowl === 'poli' ? '' : 'कटोरी: '}{bowls.find(b => b.id === hoveredBowl)?.name}
            </h4>
            <p className="text-xs text-charcoal/70 mt-0.5">{bowls.find(b => b.id === hoveredBowl)?.desc}</p>
            {bowls.find(b => b.id === hoveredBowl)?.status ? (
              <span className="text-[10px] text-saffron font-bold mt-1 inline-block animate-pulse">
                ✓ Currently in your Cart / Meal Plan!
              </span>
            ) : (
              <span className="text-[10px] text-charcoal/40 mt-1 inline-block">
                Tap Menu items below to add this authentic flavor
              </span>
            )}
          </div>
        ) : (
          <div className="text-charcoal/60 text-xs px-4">
            <Heart className="w-4 h-4 text-saffron inline-block mr-1 animate-pulse" />
            Hover over the bowls of our iconic copper plate thali to explore the rich, traditional flavors of Maharashtra!
          </div>
        )}
      </div>
    </div>
  );
}

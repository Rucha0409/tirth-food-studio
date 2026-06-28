'use client';

import React from 'react';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
  showText?: boolean;
}

export default function Logo({ className = '', width = 160, height = 160, showText = true }: LogoProps) {
  return (
    <div className={`flex items-center justify-center ${className}`} style={{ width, height }}>
      <svg 
        viewBox="0 0 400 400" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full select-none"
      >
        {/* LEAF OUTLINE (BACK) */}
        <path 
          d="M200,220 C260,180 260,90 200,45 C140,90 140,180 200,220 Z" 
          stroke="#4E6B2C" 
          strokeWidth="6" 
          fill="none"
          strokeLinecap="round"
        />
        
        {/* Leaf Midrib */}
        <line 
          x1="200" 
          y1="45" 
          x2="200" 
          y2="220" 
          stroke="#4E6B2C" 
          strokeWidth="5" 
          strokeLinecap="round"
        />
        
        {/* Leaf Veins */}
        <path 
          d="M200,80 L225,65 M200,110 L235,90 M200,140 L240,115 M200,170 L235,145" 
          stroke="#4E6B2C" 
          strokeWidth="4" 
          strokeLinecap="round"
        />
        <path 
          d="M200,80 L175,65 M200,110 L165,90 M200,140 L160,115 M200,170 L165,145" 
          stroke="#4E6B2C" 
          strokeWidth="4" 
          strokeLinecap="round"
        />

        {/* CROSSED CUTLERY */}
        {/* Spoon (Crossed from Bottom-Left to Top-Right) */}
        <g transform="translate(0, 0)">
          {/* Spoon Handle */}
          <path 
            d="M140,240 L190,190" 
            stroke="#4E6B2C" 
            strokeWidth="8" 
            strokeLinecap="round"
          />
          {/* Spoon Head */}
          <path 
            d="M115,265 C95,245 105,225 125,225 C145,225 155,245 135,265 Z" 
            fill="#4E6B2C"
          />
        </g>

        {/* Fork (Crossed from Bottom-Right to Top-Left) */}
        <g transform="translate(0, 0)">
          {/* Fork Handle */}
          <path 
            d="M260,240 L210,190" 
            stroke="#4E6B2C" 
            strokeWidth="8" 
            strokeLinecap="round"
          />
          {/* Fork Base & Prongs */}
          <path 
            d="M265,245 C280,260 295,245 285,230 L260,220 Z" 
            fill="#4E6B2C"
          />
          {/* Prongs */}
          <path 
            d="M280,230 L295,215 M285,235 L300,220 M290,240 L305,225" 
            stroke="#4E6B2C" 
            strokeWidth="4.5" 
            strokeLinecap="round"
          />
        </g>

        {/* MIDDLE TEXT AREA - "तीर्थ" */}
        {/* Horizontal Top line */}
        <line 
          x1="30" 
          y1="280" 
          x2="370" 
          y2="280" 
          stroke="#4E6B2C" 
          strokeWidth="6" 
          strokeLinecap="round"
        />
        
        {/* Devnagari Text "तीर्थ" */}
        <text 
          x="200" 
          y="318" 
          fill="#4E6B2C" 
          fontSize="56" 
          fontWeight="900" 
          textAnchor="middle"
          style={{ fontFamily: "'Noto Serif Devanagari', 'Rozha One', serif", letterSpacing: '4px' }}
        >
          तीर्थ
        </text>

        {/* Horizontal Mid line */}
        <line 
          x1="30" 
          y1="332" 
          x2="370" 
          y2="332" 
          stroke="#4E6B2C" 
          strokeWidth="6" 
          strokeLinecap="round"
        />

        {/* BOTTOM BANNER - "The Food Studio" */}
        {showText && (
          <g>
            {/* Banner Background */}
            <path 
              d="M 50,345 C 50,345 80,345 100,345 L 300,345 C 320,345 350,345 350,345 C 350,345 350,378 335,378 L 65,378 C 50,378 50,345 50,345 Z" 
              fill="#4E6B2C" 
            />
            {/* White Text */}
            <text 
              x="200" 
              y="368" 
              fill="#FFFFFF" 
              fontSize="20" 
              fontWeight="bold" 
              textAnchor="middle"
              style={{ fontFamily: "'Inter', sans-serif", letterSpacing: '1px' }}
            >
              The Food Studio
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}

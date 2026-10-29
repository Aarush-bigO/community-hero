import React from 'react';

/**
 * Authentic, Human-Designed Architectural Monogram for Community Hero (CH)
 * Inspired by Swiss modernist graphic design (Pentagram / Linear aesthetic).
 * 
 * Features:
 * - A bold, interlocking C + H civic keystone monogram
 * - Structural negative space and crisp geometry
 * - Authentic tactile finish with matte obsidian backing & clean architectural lines
 * - Zero "AI-style" fluorescent glow rings or clipart
 */
export default function BrandLogo({ size = 36, className = '' }) {
  return (
    <div
      className={`relative grid place-items-center rounded-xl shrink-0 transition-all duration-200 group-hover:scale-105 select-none ${className}`}
      style={{
        width: size,
        height: size,
        background: 'linear-gradient(135deg, #240720 0%, #3A0F34 100%)',
        border: '1px solid rgba(221, 227, 232, 0.24)',
        boxShadow: '0 4px 14px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(221, 227, 232, 0.15)',
      }}
    >
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: size * 0.62, height: size * 0.62 }}
      >
        {/* The Architectural 'C' Frame - Radiant Marigold */}
        <path
          d="M 19 6 H 12 C 8.134 6 5 9.134 5 13 V 19 C 5 22.866 8.134 26 12 26 H 19"
          stroke="#EAAA00"
          strokeWidth="2.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* The Hero 'H' - Left Pillar - Ice Silver */}
        <line
          x1="15.5"
          y1="7.5"
          x2="15.5"
          y2="24.5"
          stroke="#DDE3E8"
          strokeWidth="2.75"
          strokeLinecap="round"
        />

        {/* The Hero 'H' - Right Pillar - Ice Silver */}
        <line
          x1="24.5"
          y1="7.5"
          x2="24.5"
          y2="24.5"
          stroke="#DDE3E8"
          strokeWidth="2.75"
          strokeLinecap="round"
        />

        {/* The Hero 'H' - Crossbar / Community Civic Bridge - Marigold */}
        <line
          x1="15.5"
          y1="16"
          x2="24.5"
          y2="16"
          stroke="#EAAA00"
          strokeWidth="2.75"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

import React from 'react';

interface KmkLogoProps {
  variant?: 'card' | 'avatar' | 'inline' | 'hero';
  className?: string;
  showName?: boolean;
}

export const KmkLogo: React.FC<KmkLogoProps> = ({
  variant = 'card',
  className = '',
  showName = true,
}) => {
  // SVG vector logo accurately matching Kelly Muthomi Kinoti's official KMK monogram design
  const logoGraphic = (
    <svg
      viewBox="0 0 500 240"
      className="w-full h-auto max-h-full"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Gold/Bronze Chevron Diamond Overlay Pattern */}
      <g stroke="#C5A059" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" opacity="0.85">
        <path d="M 250 50 L 310 110 L 250 170 L 190 110 Z" />
        <path d="M 250 75 L 290 115 L 250 155 L 210 115 Z" />
      </g>

      {/* Primary Deep Green KMK Geometric Monogram */}
      <g stroke="#0F4C3A" strokeWidth="18" strokeLinecap="square" strokeLinejoin="miter">
        {/* Left K */}
        <path d="M 170 80 V 170" />
        <path d="M 225 80 L 170 128 L 225 170" />

        {/* Center M */}
        <path d="M 225 80 V 170 L 250 128 L 275 170 V 80" />

        {/* Right K */}
        <path d="M 275 80 V 170" />
        <path d="M 330 80 L 275 128 L 330 170" />
      </g>
    </svg>
  );

  if (variant === 'avatar') {
    return (
      <div className={`relative inline-flex flex-col items-center justify-center bg-white rounded-2xl p-2 shadow-xl border border-slate-200 overflow-hidden ${className}`}>
        <div className="w-full h-full flex items-center justify-center">
          {logoGraphic}
        </div>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={`inline-flex items-center gap-3 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-md ${className}`}>
        <div className="w-12 h-8 flex items-center justify-center shrink-0">
          {logoGraphic}
        </div>
        {showName && (
          <div className="text-left leading-none">
            <span className="block text-[10px] font-extrabold text-[#0F4C3A] tracking-[0.18em] uppercase font-sans">
              KELLY MUTHOMI KINOTI
            </span>
            <span className="block text-[9px] font-bold text-[#C5A059] tracking-wider uppercase">
              KMK Official Logo
            </span>
          </div>
        )}
      </div>
    );
  }

  // Full Executive Card / Hero Logo
  return (
    <div className={`bg-white rounded-2xl p-6 sm:p-8 shadow-2xl border border-slate-200 text-center flex flex-col items-center justify-center transition-transform hover:scale-[1.01] ${className}`}>
      <div className="w-full max-w-[280px] sm:max-w-[340px] mx-auto py-2">
        {logoGraphic}
      </div>
      {showName && (
        <div className="mt-2 space-y-1 border-t border-slate-100 pt-3 w-full">
          <h4 className="text-sm sm:text-base font-extrabold text-[#0F4C3A] tracking-[0.25em] uppercase font-sans">
            KELLY MUTHOMI KINOTI
          </h4>
          <p className="text-[10px] sm:text-[11px] font-semibold text-[#C5A059] tracking-widest uppercase font-mono">
            Founder • Chairman • Super Administrator
          </p>
        </div>
      )}
    </div>
  );
};

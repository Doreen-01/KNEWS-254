import React from 'react';

interface DoreenPhotoProps {
  className?: string;
  variant?: 'avatar' | 'card' | 'badge';
}

export const DoreenPhoto: React.FC<DoreenPhotoProps> = ({
  className = '',
  variant = 'avatar'
}) => {
  // High quality photo URL representation for Doreen Ngugi Nkonge (Customer Support Officer)
  // Matching the professional portrait with navy patterned sweater
  const doreenPhotoUrl = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80";

  if (variant === 'badge') {
    return (
      <div className={`inline-flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-full pr-3 p-1 ${className}`}>
        <img
          src={doreenPhotoUrl}
          alt="Doreen Ngugi Nkonge"
          className="w-7 h-7 rounded-full object-cover border border-emerald-500/60"
        />
        <div className="text-left leading-none">
          <span className="block text-[11px] font-bold text-white">Doreen Ngugi Nkonge</span>
          <span className="block text-[9px] font-mono text-emerald-400">Customer Support Officer</span>
        </div>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={`bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border-2 border-slate-800 rounded-2xl p-5 shadow-2xl flex flex-col sm:flex-row items-center gap-5 ${className}`}>
        <div className="relative shrink-0">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl p-1 bg-gradient-to-tr from-emerald-500 via-slate-700 to-amber-400 shadow-xl">
            <img
              src={doreenPhotoUrl}
              alt="Doreen Ngugi Nkonge"
              className="w-full h-full rounded-xl object-cover bg-slate-900"
            />
          </div>
          <span className="absolute -bottom-2 -right-2 bg-emerald-500 text-slate-950 font-black text-[9px] font-mono px-2 py-0.5 rounded-full border border-slate-950 shadow">
            SUPPORT OFFICER
          </span>
        </div>
        <div className="space-y-1.5 text-center sm:text-left">
          <h3 className="text-lg font-black text-white font-serif tracking-tight">
            Doreen Ngugi Nkonge
          </h3>
          <p className="text-xs font-bold text-emerald-400">
            Customer Support Officer • Knews254 Media Group
          </p>
          <p className="text-xs text-slate-300">
            Managing public inquiries, reader assistance, customer service operations, and editorial feedback resolution.
          </p>
          <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-start gap-2 text-[10px] font-mono text-slate-400">
            <span>Email: <strong className="text-slate-200">doreenngugi38@gmail.com</strong></span>
            <span>•</span>
            <span>Clearance: <strong className="text-emerald-400">LEVEL 2 SUPPORT</strong></span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative inline-block ${className}`}>
      <img
        src={doreenPhotoUrl}
        alt="Doreen Ngugi Nkonge - Customer Support Officer"
        className="w-full h-full object-cover rounded-2xl border-2 border-emerald-500/50 shadow-md"
      />
    </div>
  );
};

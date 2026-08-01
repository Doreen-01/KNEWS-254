import React, { useState } from 'react';
import { KENYA_47_COUNTIES } from '../data/newsData';
import { CountyData } from '../types';
import { Building2, MapPin, Users, Briefcase, ChevronRight, Newspaper } from 'lucide-react';

export const CountyNewsExplorer: React.FC = () => {
  const [selectedCounty, setSelectedCounty] = useState<CountyData>(KENYA_47_COUNTIES[9]); // Nairobi default
  const [selectedRegion, setSelectedRegion] = useState<string>('All');

  const regions = ['All', 'Nairobi', 'Coast', 'Central', 'Eastern', 'Rift Valley', 'Nyanza'];

  const filteredCounties = KENYA_47_COUNTIES.filter(
    (c) => selectedRegion === 'All' || c.region === selectedRegion
  );

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-2xl space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-blue-600/20 text-blue-400 border border-blue-500/30 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider mb-1">
            <Building2 className="w-3.5 h-3.5" />
            Devolution & County Reporting Engine
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Kenya 47 Counties Hyper-Local News Hub
          </h2>
          <p className="text-slate-400 text-xs mt-0.5">
            Select any county to view local government projects, governor updates, agricultural market trends, and regional news.
          </p>
        </div>

        {/* Region Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {regions.map((reg) => (
            <button
              key={reg}
              onClick={() => setSelectedRegion(reg)}
              className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                selectedRegion === reg
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {reg}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* County Buttons Grid */}
        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[420px] overflow-y-auto pr-1">
          {filteredCounties.map((county) => {
            const isSelected = selectedCounty.id === county.id;
            return (
              <button
                key={county.id}
                onClick={() => setSelectedCounty(county)}
                className={`p-3 rounded-xl text-left border transition ${
                  isSelected
                    ? 'bg-blue-950/60 border-blue-500 text-white shadow-lg'
                    : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-500">#{county.code.toString().padStart(3, '0')}</span>
                  <span className="text-[10px] bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded">{county.region}</span>
                </div>
                <h4 className="font-bold text-sm text-white mt-1">{county.name}</h4>
                <p className="text-[10px] text-slate-400 truncate mt-0.5">{county.governor}</p>
              </button>
            );
          })}
        </div>

        {/* Active County Card */}
        <div className="lg:col-span-5 bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest block">County #{selectedCounty.code}</span>
                <h3 className="text-2xl font-black text-white">{selectedCounty.name} County</h3>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-red-400" /> Capital: {selectedCounty.capital} • {selectedCounty.region} Region
                </p>
              </div>
              <span className="bg-blue-600/20 text-blue-400 border border-blue-500/30 text-xs font-bold px-2.5 py-1 rounded-lg">
                {selectedCounty.newsCount} Stories
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 text-[10px] uppercase font-mono block">Governor</span>
                <strong className="text-slate-200 text-xs font-bold block mt-0.5">{selectedCounty.governor}</strong>
              </div>
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 text-[10px] uppercase font-mono block">Population</span>
                <strong className="text-slate-200 text-xs font-bold block mt-0.5">{selectedCounty.population}</strong>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Primary Economic Pillars</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedCounty.keySectors.map((sector) => (
                  <span key={sector} className="bg-slate-900 text-slate-300 text-[11px] px-2.5 py-1 rounded-lg border border-slate-800">
                    {sector}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 p-3.5 rounded-xl border border-blue-500/30 space-y-1">
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1">
                <Newspaper className="w-3.5 h-3.5" /> Latest County Headline
              </span>
              <p className="text-xs font-semibold text-white leading-snug">
                "{selectedCounty.headline}"
              </p>
            </div>
          </div>

          <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-1.5">
            View All {selectedCounty.name} County Reports
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

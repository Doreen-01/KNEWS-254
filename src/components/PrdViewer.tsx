import React, { useState } from 'react';
import { 
  ALL_PRD_SECTIONS 
} from '../data/prdSections';
import { PRDSectionData } from '../types';
import { 
  Search, 
  Download, 
  Copy, 
  Check, 
  ChevronRight, 
  FileCode, 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  Database, 
  Zap, 
  BarChart3, 
  BookOpen,
  Filter
} from 'lucide-react';

export const PrdViewer: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeSectionId, setActiveSectionId] = useState<number>(1);
  const [copied, setCopied] = useState(false);
  const [isExecutiveMode, setIsExecutiveMode] = useState(false);

  const categories = [
    'All',
    'Strategic Foundation',
    'Audience & UX',
    'Architecture & Content',
    'CMS & Editorial',
    'Engineering & Infra',
    'Specialized Hubs',
    'AI & Innovation',
    'Monetization & Ops'
  ];

  const filteredSections = ALL_PRD_SECTIONS.filter((sec) => {
    const matchesCategory = selectedCategory === 'All' || sec.category === selectedCategory;
    const matchesSearch = 
      sec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sec.overview.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sec.details.some(d => d.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const activeSection = ALL_PRD_SECTIONS.find((s) => s.id === activeSectionId) || ALL_PRD_SECTIONS[0];

  const handleCopyFullSpec = () => {
    const fullText = ALL_PRD_SECTIONS.map((sec) => `
==================================================
${sec.title}
Category: ${sec.category}
==================================================
OVERVIEW:
${sec.overview}

KEY SPECIFICATIONS:
${sec.details.map(d => `• ${d}`).join('\n')}

DELIVERABLES:
${sec.deliverables.map(d => `[✓] ${d}`).join('\n')}
`).join('\n\n');

    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen pb-16">
      {/* Header Banner for Specification Hub */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-red-950 border-b border-slate-800 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-red-600/20 text-red-400 border border-red-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              FAANG-Grade Product Requirements Document
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Knews254 Master Product Architecture Specification
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Complete 44-Section Technical PRD covering Executive Vision, 47 County Architecture, 2027 Election Center, Gemini AI Integrations, Database Schemas, and Cloud Infrastructure.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleCopyFullSpec}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-4 py-2.5 rounded-lg border border-slate-700 transition"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copied ? "Full Spec Copied!" : "Copy Full 44-Section PRD"}
            </button>

            <button
              onClick={() => setIsExecutiveMode(!isExecutiveMode)}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-lg transition"
            >
              <BookOpen className="w-4 h-4" />
              {isExecutiveMode ? "Standard View" : "Executive Reader Mode"}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8">
        {/* Search & Category Filter Bar */}
        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 mb-8 space-y-4 shadow-xl">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search across all 44 PRD sections (e.g. Election Centre, Database, Gemini AI, Ads)..."
                className="w-full bg-slate-950 text-slate-200 placeholder-slate-500 text-sm rounded-xl pl-10 pr-4 py-2.5 border border-slate-800 focus:outline-none focus:border-red-500 transition"
              />
            </div>

            {/* Total Section Count Badge */}
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 shrink-0">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Showing <strong>{filteredSections.length}</strong> of <strong>44</strong> Sections</span>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pt-2 no-scrollbar border-t border-slate-800/80">
            <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1 shrink-0 mr-1">
              <Filter className="w-3 h-3" /> Filter:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-red-600 text-white'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Master Grid & Detail Explorer */}
        <div className={`grid ${isExecutiveMode ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-12'} gap-8`}>
          {/* Section Directory Sidebar (Sections 1 through 44) */}
          {!isExecutiveMode && (
            <div className="lg:col-span-4 bg-slate-900 rounded-2xl border border-slate-800 p-4 max-h-[800px] overflow-y-auto space-y-2 sticky top-24">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-2 px-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">PRD Table of Contents</span>
                <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded">44 Sections</span>
              </div>

              {filteredSections.map((sec) => {
                const isActive = activeSection.id === sec.id;
                return (
                  <button
                    key={sec.id}
                    onClick={() => setActiveSectionId(sec.id)}
                    className={`w-full text-left p-3 rounded-xl transition border text-xs flex items-start justify-between gap-3 ${
                      isActive
                        ? 'bg-red-950/40 border-red-500/50 text-white font-bold'
                        : 'bg-slate-950/60 hover:bg-slate-800 border-slate-800/60 text-slate-300'
                    }`}
                  >
                    <div>
                      <span className="text-[10px] font-mono text-slate-500 uppercase block mb-0.5">{sec.category}</span>
                      <p className="line-clamp-2 leading-tight">{sec.title}</p>
                    </div>
                    <ChevronRight className={`w-4 h-4 shrink-0 transition ${isActive ? 'text-red-400 translate-x-1' : 'text-slate-600'}`} />
                  </button>
                );
              })}
            </div>
          )}

          {/* Active Section Comprehensive Deep Dive */}
          <div className={`${isExecutiveMode ? 'col-span-1' : 'lg:col-span-8'} space-y-6`}>
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 rounded-full blur-3xl -z-10 pointer-events-none" />

              {/* Section Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-red-600/20 text-red-400 border border-red-500/30 text-xs font-mono font-bold px-2.5 py-0.5 rounded">
                      Section {activeSection.id} of 44
                    </span>
                    <span className="bg-slate-800 text-slate-300 text-xs font-bold px-2.5 py-0.5 rounded">
                      {activeSection.category}
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {activeSection.title}
                  </h2>
                </div>
              </div>

              {/* Overview */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-red-400" />
                  Section Overview
                </h3>
                <p className="text-slate-200 leading-relaxed text-sm bg-slate-950 p-4 rounded-xl border border-slate-800">
                  {activeSection.overview}
                </p>
              </div>

              {/* Technical Specifications */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-400" />
                  Key Technical & Functional Specifications
                </h3>
                <div className="grid grid-cols-1 gap-2.5">
                  {activeSection.details.map((detail, idx) => (
                    <div 
                      key={idx}
                      className="flex items-start gap-3 bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/80 text-xs text-slate-300 leading-relaxed"
                    >
                      <span className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Deliverables Checklist */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  Section Deliverables Checklist
                </h3>
                <div className="flex flex-wrap gap-2">
                  {activeSection.deliverables.map((deliv, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-slate-950 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-lg text-xs font-mono font-medium">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{deliv}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Quick Navigation between PRD Sections */}
              <div className="flex items-center justify-between border-t border-slate-800 pt-6 mt-8">
                <button
                  disabled={activeSection.id === 1}
                  onClick={() => setActiveSectionId(Math.max(1, activeSection.id - 1))}
                  className="px-4 py-2 bg-slate-950 hover:bg-slate-800 disabled:opacity-40 text-xs font-bold rounded-lg border border-slate-800 text-slate-300 transition"
                >
                  ← Previous Section
                </button>

                <span className="text-xs font-mono text-slate-500">
                  {activeSection.id} / 44
                </span>

                <button
                  disabled={activeSection.id === 44}
                  onClick={() => setActiveSectionId(Math.min(44, activeSection.id + 1))}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 disabled:opacity-40 text-xs font-bold rounded-lg text-white shadow-md transition"
                >
                  Next Section →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

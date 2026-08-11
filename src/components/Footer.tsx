import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Shield, 
  Rss, 
  Send, 
  Check, 
  Sparkles, 
  Sliders, 
  Smartphone, 
  Radio, 
  Globe, 
  MapPin, 
  Award, 
  ArrowUp, 
  CheckCircle2,
  TrendingUp,
  DollarSign,
  PhoneCall,
  Lock,
  ExternalLink,
  Building,
  Headphones,
  Newspaper
} from 'lucide-react';
import { NewsCategory } from '../types';
import { supabase } from '../lib/supabase';

interface FooterProps {
  onSelectCategory?: (category: NewsCategory) => void;
  onSelectTab?: (tab: 'platform' | 'prd') => void;
  onOpenCms?: () => void;
  onOpenAi?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onSelectTab,
  onOpenCms,
  onOpenAi,
}) => {
  const [email, setEmail] = useState('');
  const [frequency, setFrequency] = useState<'daily' | 'breaking' | 'weekly'>('daily');
  const [subscribed, setSubscribed] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getCategoryHref = (category: NewsCategory) => {
    return category === 'home' ? '/' : `/category/${encodeURIComponent(category)}`;
  };

  const handleCategoryClick = (e: React.MouseEvent<HTMLAnchorElement>, category: NewsCategory) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) {
      return;
    }
    e.preventDefault();
    scrollToTop();
    if (onSelectCategory) {
      onSelectCategory(category);
    }
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    if (supabase) {
      try {
        await supabase.from('newsletter_subscribers').insert({
          email: email.trim(),
          is_active: true
        });
      } catch (err) {
        console.warn('Supabase newsletter subscribe error:', err);
      }
    }

    try {
      await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), frequency })
      });
    } catch (err) {
      console.warn('Backend subscribe notice:', err);
    }

    setSubscribed(true);
    setTimeout(() => setSubscribed(false), 6000);
    setEmail('');
  };

  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs pt-14 pb-10 relative">
      {/* Floating Scroll To Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 bg-red-600 hover:bg-red-500 text-white p-3.5 rounded-full shadow-2xl border border-red-400/50 transition-all duration-300 hover:scale-110 flex items-center justify-center group"
          title="Back to top"
          aria-label="Back to top"
        >
          <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Live Market & Financial Bar inside Footer */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <span className="bg-emerald-950 text-emerald-400 text-[10px] font-mono font-bold px-2.5 py-1 rounded border border-emerald-800/80 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> NSE 20: 1,742.8 (+0.4%)
            </span>
            <span className="bg-slate-950 text-slate-300 text-[10px] font-mono font-bold px-2.5 py-1 rounded border border-slate-800 flex items-center gap-1">
              <DollarSign className="w-3 h-3 text-amber-400" /> KES/USD: 129.50
            </span>
            <span className="bg-slate-950 text-slate-300 text-[10px] font-mono font-bold px-2.5 py-1 rounded border border-slate-800 hidden sm:flex items-center gap-1">
              KES/EUR: 139.20
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-slate-300">
            <span className="flex items-center gap-1 text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-red-500" /> HQ: Nairobi, Kenya
            </span>
            <span className="hidden md:inline">•</span>
            <a
              href="https://wa.me/254711837011?text=Hello%20Knews254%20Newsroom,%20I%20have%20a%20breaking%20news%20tip/inquiry:"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-emerald-400 hover:underline font-bold"
              title="Chat with Newsroom on WhatsApp"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400" /> WhatsApp Newsroom
            </a>
            <span className="hidden md:inline">•</span>
            <a
              href="mailto:knews254ke@gmail.com"
              className="flex items-center gap-1 text-amber-400 hover:underline font-bold"
              title="Send email to Knews254"
            >
              <Mail className="w-3.5 h-3.5 text-amber-400" /> knews254ke@gmail.com
            </a>
          </div>
        </div>

        {/* Main Grid Navigation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-8">
          {/* Brand Info & Newsletter */}
          <div className="md:col-span-4 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 group">
                {/* Kenya Flag Emblem Badge matching Header */}
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center relative overflow-hidden shadow-lg group-hover:border-red-500 transition shrink-0">
                  <span className="font-black text-2xl text-white tracking-tighter">K</span>
                  <div className="absolute bottom-0 inset-x-0 h-2 flex">
                    <div className="w-1/3 bg-slate-950" />
                    <div className="w-1/3 bg-red-600" />
                    <div className="w-1/3 bg-emerald-600" />
                  </div>
                </div>
                <div>
                  <span className="font-black text-2xl text-white tracking-tight font-serif">KNEWS<span className="text-red-600 font-serif">254</span></span>
                  <span className="block text-[9px] font-mono text-slate-400 tracking-widest uppercase font-bold">Verified Kenya Newsroom</span>
                </div>
              </div>

              {/* Inline Back to Top Button */}
              <button
                onClick={scrollToTop}
                className="bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white px-3 py-1.5 rounded-xl border border-slate-800 text-[10px] font-mono font-bold flex items-center gap-1 transition"
              >
                <ArrowUp className="w-3 h-3 text-red-500" /> TOP
              </button>
            </div>

            <p className="text-slate-400 leading-relaxed text-xs">
              Kenya’s premier enterprise digital news ecosystem delivering verified breaking news, 47-county devolution reporting, 2027 Election Intelligence, and AI-driven journalism to East Africa and the global diaspora.
            </p>

            <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-300">
              <span className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 flex items-center gap-1.5 font-bold text-emerald-400 shadow-sm">
                <Shield className="w-3.5 h-3.5" /> Media Council Compliant (MCK #2026/091)
              </span>
              <span className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 flex items-center gap-1.5 font-bold text-amber-400 shadow-sm">
                <Award className="w-3.5 h-3.5" /> Reuters Partner Network
              </span>
            </div>

            {/* Newsletter Subscription Box */}
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3.5 shadow-xl">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-xs flex items-center gap-2">
                  <Mail className="w-4 h-4 text-red-500" /> Knews254 Morning Dispatch
                </h4>
                <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                  FREE
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Receive top daily headlines, currency rates, and election digests directly in your inbox at 6:00 AM EAT.
              </p>

              {/* Frequency Selector */}
              <div className="flex items-center gap-2 text-[10px] font-mono">
                <button
                  type="button"
                  onClick={() => setFrequency('daily')}
                  className={`px-2.5 py-1 rounded-lg border transition ${frequency === 'daily' ? 'bg-red-600 text-white border-red-500 font-bold' : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'}`}
                >
                  Daily 6AM
                </button>
                <button
                  type="button"
                  onClick={() => setFrequency('breaking')}
                  className={`px-2.5 py-1 rounded-lg border transition ${frequency === 'breaking' ? 'bg-red-600 text-white border-red-500 font-bold' : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'}`}
                >
                  Breaking Alerts
                </button>
                <button
                  type="button"
                  onClick={() => setFrequency('weekly')}
                  className={`px-2.5 py-1 rounded-lg border transition ${frequency === 'weekly' ? 'bg-red-600 text-white border-red-500 font-bold' : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'}`}
                >
                  Sunday Digest
                </button>
              </div>

              <form onSubmit={handleSubscribe} className="flex gap-2 pt-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address..."
                  className="flex-1 bg-slate-950 text-slate-200 placeholder-slate-500 text-xs rounded-xl px-3.5 py-2.5 border border-slate-800 focus:outline-none focus:border-red-500"
                />
                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center justify-center shrink-0 shadow-md"
                >
                  {subscribed ? <Check className="w-4 h-4 text-white" /> : <Send className="w-3.5 h-3.5" />}
                </button>
              </form>
              {subscribed && (
                <div className="bg-emerald-950/80 border border-emerald-800 text-emerald-300 p-2.5 rounded-xl text-[11px] font-mono flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Subscribed successfully! Welcome to the Knews254 Dispatch.</span>
                </div>
              )}
            </div>
          </div>

          {/* Column 1: Editorial Beats */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider border-b border-slate-800 pb-2">
              Editorial Beats
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <a href={getCategoryHref('blog')} onClick={(e) => handleCategoryClick(e, 'blog')} className="hover:text-amber-400 font-bold text-amber-400 transition text-left flex items-center gap-1 cursor-pointer">
                  Knews254 Blog
                </a>
              </li>
              <li>
                <a href={getCategoryHref('breaking')} onClick={(e) => handleCategoryClick(e, 'breaking')} className="hover:text-red-400 transition text-left block cursor-pointer">
                  Breaking News
                </a>
              </li>
              <li>
                <a href={getCategoryHref('politics')} onClick={(e) => handleCategoryClick(e, 'politics')} className="hover:text-red-400 transition text-left block cursor-pointer">
                  Politics & Parliament
                </a>
              </li>
              <li>
                <a href={getCategoryHref('elections')} onClick={(e) => handleCategoryClick(e, 'elections')} className="hover:text-red-400 font-bold text-red-400 transition text-left flex items-center gap-1 cursor-pointer">
                  2027 Election Centre
                </a>
              </li>
              <li>
                <a href={getCategoryHref('business')} onClick={(e) => handleCategoryClick(e, 'business')} className="hover:text-red-400 transition text-left block cursor-pointer">
                  Business & Markets
                </a>
              </li>
              <li>
                <a href={getCategoryHref('technology')} onClick={(e) => handleCategoryClick(e, 'technology')} className="hover:text-red-400 transition text-left block cursor-pointer">
                  Silicon Savannah Tech
                </a>
              </li>
              <li>
                <a href={getCategoryHref('ai')} onClick={(e) => handleCategoryClick(e, 'ai')} className="hover:text-red-400 transition text-left block cursor-pointer">
                  Kenya AI & Innovation
                </a>
              </li>
              <li>
                <a href={getCategoryHref('sports')} onClick={(e) => handleCategoryClick(e, 'sports')} className="hover:text-red-400 transition text-left block cursor-pointer">
                  Sports & Athletics
                </a>
              </li>
              <li>
                <a href={getCategoryHref('county')} onClick={(e) => handleCategoryClick(e, 'county')} className="hover:text-red-400 transition text-left block cursor-pointer">
                  47 Counties Hub
                </a>
              </li>
              <li>
                <a href={getCategoryHref('investigations')} onClick={(e) => handleCategoryClick(e, 'investigations')} className="hover:text-red-400 transition text-left block cursor-pointer">
                  Investigative Desk
                </a>
              </li>
              <li>
                <a href={getCategoryHref('diaspora')} onClick={(e) => handleCategoryClick(e, 'diaspora')} className="hover:text-red-400 transition text-left block cursor-pointer">
                  Global Diaspora
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Media & Interactive */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider border-b border-slate-800 pb-2">
              Media & Features
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <a href={getCategoryHref('live')} onClick={(e) => handleCategoryClick(e, 'live')} className="hover:text-red-400 transition text-left flex items-center gap-1 text-emerald-400 font-bold cursor-pointer">
                  <Radio className="w-3 h-3 animate-pulse" /> Live TV & Radio
                </a>
              </li>
              <li>
                <a href={getCategoryHref('videos')} onClick={(e) => handleCategoryClick(e, 'videos')} className="hover:text-red-400 transition text-left block cursor-pointer">
                  Video Bulletins
                </a>
              </li>
              <li>
                <a href={getCategoryHref('podcasts')} onClick={(e) => handleCategoryClick(e, 'podcasts')} className="hover:text-red-400 transition text-left block cursor-pointer">
                  Audio Podcasts
                </a>
              </li>
              <li>
                <a href={getCategoryHref('gallery')} onClick={(e) => handleCategoryClick(e, 'gallery')} className="hover:text-red-400 transition text-left block cursor-pointer">
                  Photojournalism
                </a>
              </li>
              <li>
                <a href={getCategoryHref('fact-checking')} onClick={(e) => handleCategoryClick(e, 'fact-checking')} className="hover:text-red-400 transition text-left block cursor-pointer">
                  Knews254 Verify
                </a>
              </li>
              <li>
                <a href={getCategoryHref('opinion')} onClick={(e) => handleCategoryClick(e, 'opinion')} className="hover:text-red-400 transition text-left block cursor-pointer">
                  Opinion & Editorials
                </a>
              </li>
              {onOpenAi && (
                <li>
                  <button onClick={() => { scrollToTop(); onOpenAi(); }} className="hover:text-amber-300 text-amber-400 transition text-left flex items-center gap-1 font-bold cursor-pointer">
                    <Sparkles className="w-3 h-3" /> Ask Gemini AI
                  </button>
                </li>
              )}
              {onOpenCms && (
                <li className="pt-2 border-t border-slate-800/80">
                  <a href="/#cms" onClick={(e) => { e.preventDefault(); scrollToTop(); onOpenCms(); }} className="hover:text-red-400 text-slate-400 hover:underline transition text-left flex items-center gap-1.5 font-mono text-[10px] cursor-pointer">
                    <Lock className="w-3 h-3 text-red-500" /> Staff Portal & CMS
                  </a>
                </li>
              )}
              {onSelectTab && (
                <li>
                  <a href="/prd" onClick={(e) => { e.preventDefault(); scrollToTop(); onSelectTab('prd'); }} className="hover:text-slate-300 text-slate-500 transition text-left font-mono text-[10px] flex items-center gap-1 cursor-pointer">
                    <span>Internal PRD Specification</span>
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Column 3: Standards & Code of Ethics */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider border-b border-slate-800 pb-2">
              Editorial Standards
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <a href={getCategoryHref('editorial-policy')} onClick={(e) => handleCategoryClick(e, 'editorial-policy')} className="hover:text-white transition text-left block cursor-pointer">
                  Editorial Policy
                </a>
              </li>
              <li>
                <a href={getCategoryHref('ethics-policy')} onClick={(e) => handleCategoryClick(e, 'ethics-policy')} className="hover:text-white transition text-left block cursor-pointer">
                  Code of Ethics
                </a>
              </li>
              <li>
                <a href={getCategoryHref('factcheck-methodology')} onClick={(e) => handleCategoryClick(e, 'factcheck-methodology')} className="hover:text-white transition text-left block cursor-pointer">
                  Fact-Check Method
                </a>
              </li>
              <li>
                <a href={getCategoryHref('anonymous-sources')} onClick={(e) => handleCategoryClick(e, 'anonymous-sources')} className="hover:text-white transition text-left block cursor-pointer">
                  Anonymous Sources
                </a>
              </li>
              <li>
                <a href={getCategoryHref('ai-policy')} onClick={(e) => handleCategoryClick(e, 'ai-policy')} className="hover:text-white transition text-left block cursor-pointer">
                  AI Usage Policy
                </a>
              </li>
              <li>
                <a href={getCategoryHref('corrections-policy')} onClick={(e) => handleCategoryClick(e, 'corrections-policy')} className="hover:text-white transition text-left block cursor-pointer">
                  Corrections Policy
                </a>
              </li>
              <li>
                <a href={getCategoryHref('transparency-report')} onClick={(e) => handleCategoryClick(e, 'transparency-report')} className="hover:text-white transition text-left block cursor-pointer">
                  Ownership & Funding
                </a>
              </li>
              <li>
                <a href={getCategoryHref('community-guidelines')} onClick={(e) => handleCategoryClick(e, 'community-guidelines')} className="hover:text-white transition text-left block cursor-pointer">
                  Community Rules
                </a>
              </li>
              <li>
                <a href={getCategoryHref('takedown-policy')} onClick={(e) => handleCategoryClick(e, 'takedown-policy')} className="hover:text-white transition text-left block cursor-pointer">
                  Copyright & Takedown
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Company & Regional Desks */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider border-b border-slate-800 pb-2">
              Company & Desks
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <a href={getCategoryHref('about')} onClick={(e) => handleCategoryClick(e, 'about')} className="hover:text-white transition text-left block cursor-pointer">
                  About Knews254
                </a>
              </li>
              <li>
                <a href={getCategoryHref('authors')} onClick={(e) => handleCategoryClick(e, 'authors')} className="hover:text-white transition text-left block cursor-pointer">
                  Editorial Board
                </a>
              </li>
              <li>
                <a href={getCategoryHref('contact')} onClick={(e) => handleCategoryClick(e, 'contact')} className="hover:text-white transition text-left block cursor-pointer">
                  Contact Newsroom
                </a>
              </li>
              <li>
                <a href={getCategoryHref('careers')} onClick={(e) => handleCategoryClick(e, 'careers')} className="hover:text-white transition text-left block cursor-pointer">
                  Careers & Fellowships
                </a>
              </li>
              <li>
                <a href={getCategoryHref('advertise')} onClick={(e) => handleCategoryClick(e, 'advertise')} className="hover:text-white transition text-left block cursor-pointer">
                  Advertise & Sponsor
                </a>
              </li>
              <li>
                <a href={getCategoryHref('reviews')} onClick={(e) => handleCategoryClick(e, 'reviews')} className="hover:text-white transition text-left text-amber-400 font-bold block cursor-pointer">
                  Reader Reviews & Ratings
                </a>
              </li>
              <li>
                <a href={getCategoryHref('how-we-review')} onClick={(e) => handleCategoryClick(e, 'how-we-review')} className="hover:text-white transition text-left block cursor-pointer">
                  How We Review Claims
                </a>
              </li>
              <li>
                <a href={getCategoryHref('faq')} onClick={(e) => handleCategoryClick(e, 'faq')} className="hover:text-white transition text-left block cursor-pointer">
                  FAQ Centre
                </a>
              </li>
              <li>
                <a href={getCategoryHref('help-center')} onClick={(e) => handleCategoryClick(e, 'help-center')} className="hover:text-white transition text-left block cursor-pointer">
                  Help & Support Desk
                </a>
              </li>
              <li className="pt-2 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                Regional Bureaus
              </li>
              <li>
                <a href={getCategoryHref('county')} onClick={(e) => handleCategoryClick(e, 'county')} className="hover:text-slate-200 transition text-left block cursor-pointer">
                  Nairobi HQ Desk
                </a>
              </li>
              <li>
                <a href={getCategoryHref('county')} onClick={(e) => handleCategoryClick(e, 'county')} className="hover:text-slate-200 transition text-left block cursor-pointer">
                  Mombasa Coast Bureau
                </a>
              </li>
              <li>
                <a href={getCategoryHref('county')} onClick={(e) => handleCategoryClick(e, 'county')} className="hover:text-slate-200 transition text-left block cursor-pointer">
                  Kisumu Nyanza Bureau
                </a>
              </li>
              <li>
                <a href={getCategoryHref('county')} onClick={(e) => handleCategoryClick(e, 'county')} className="hover:text-slate-200 transition text-left block cursor-pointer">
                  Eldoret Rift Bureau
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Middle Bar: Mobile Apps & Global Bureaus */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3.5">
            {/* Registered KNEWS254 Favicon / Official App Icon Emblem */}
            <div className="w-12 h-12 rounded-2xl bg-slate-900 border-2 border-slate-700 flex items-center justify-center relative overflow-hidden shadow-xl shrink-0">
              <span className="font-black text-2xl text-white tracking-tighter font-serif">K</span>
              <div className="absolute bottom-0 inset-x-0 h-2 flex">
                <div className="w-1/3 bg-slate-950" />
                <div className="w-1/3 bg-red-600" />
                <div className="w-1/3 bg-emerald-600" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-bold text-white text-xs font-serif">Download Official Knews254 Mobile App</p>
                <span className="text-[9px] bg-red-950 text-red-400 font-mono font-bold px-2 py-0.5 rounded border border-red-800 uppercase">
                  v3.2 Official Icon
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Featuring our official newsroom logo favicon emblem. Offline reading, election alerts &amp; live podcasts.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* Apple App Store Badge using Official Favicon Logo */}
            <button
              onClick={() => alert("✓ Opening Knews254 Official App on Apple App Store (Icon Badge: Kenya Flag K-Shield Emblem v3.2)")}
              className="bg-slate-950 hover:bg-slate-900 border border-slate-700 hover:border-red-500/50 text-slate-200 font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-3 shadow-md transition group cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center relative overflow-hidden shrink-0 group-hover:border-red-500 transition shadow">
                <span className="font-black text-sm text-white font-serif">K</span>
                <div className="absolute bottom-0 inset-x-0 h-1 flex">
                  <div className="w-1/3 bg-slate-950" />
                  <div className="w-1/3 bg-red-600" />
                  <div className="w-1/3 bg-emerald-600" />
                </div>
              </div>
              <div className="text-left font-sans">
                <span className="block text-[8px] text-slate-400 uppercase tracking-widest font-mono">Download on the</span>
                <span className="font-bold text-xs text-white">Apple App Store</span>
              </div>
            </button>

            {/* Google Play Store Badge using Official Favicon Logo */}
            <button
              onClick={() => alert("✓ Opening Knews254 Official App on Google Play Store (Icon Badge: Kenya Flag K-Shield Emblem v3.2)")}
              className="bg-slate-950 hover:bg-slate-900 border border-slate-700 hover:border-red-500/50 text-slate-200 font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-3 shadow-md transition group cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center relative overflow-hidden shrink-0 group-hover:border-red-500 transition shadow">
                <span className="font-black text-sm text-white font-serif">K</span>
                <div className="absolute bottom-0 inset-x-0 h-1 flex">
                  <div className="w-1/3 bg-slate-950" />
                  <div className="w-1/3 bg-red-600" />
                  <div className="w-1/3 bg-emerald-600" />
                </div>
              </div>
              <div className="text-left font-sans">
                <span className="block text-[8px] text-slate-400 uppercase tracking-widest font-mono font-bold">GET IT ON</span>
                <span className="font-bold text-xs text-white">Google Play Store</span>
              </div>
            </button>
          </div>
        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div className="space-y-1 text-center sm:text-left">
            <p>© 2026 Knews254 Media Group Ltd. All rights reserved. ISSN 2958-8422.</p>
            <p className="text-[10px] text-slate-400">Registered and regulated under Kenya Media Council Guidelines & Data Protection Act 2019.</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 font-mono">
            <a href={getCategoryHref('privacy-policy')} onClick={(e) => handleCategoryClick(e, 'privacy-policy')} className="hover:text-slate-300 transition cursor-pointer">
              Privacy Policy
            </a>
            <span>•</span>
            <a 
              href={getCategoryHref('cookie-policy')} 
              onClick={(e) => { 
                if (!e.metaKey && !e.ctrlKey && !e.shiftKey) {
                  e.preventDefault(); 
                  handleCategoryClick(e, 'cookie-policy'); 
                  window.dispatchEvent(new CustomEvent('knews254_open_cookie_modal'));
                }
              }} 
              className="hover:text-slate-300 transition cursor-pointer flex items-center gap-1"
            >
              Cookie Policy
            </a>
            <span>•</span>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('knews254_open_cookie_modal'))}
              className="hover:text-amber-400 text-amber-500/90 font-bold transition cursor-pointer flex items-center gap-1"
              title="Manage Cookie Preferences"
            >
              🍪 Cookie Settings
            </button>
            <span>•</span>
            <a href={getCategoryHref('terms-of-service')} onClick={(e) => handleCategoryClick(e, 'terms-of-service')} className="hover:text-slate-300 transition cursor-pointer">
              Terms of Service
            </a>
            <span>•</span>
            <a href={getCategoryHref('contact')} onClick={(e) => handleCategoryClick(e, 'contact')} className="hover:text-slate-300 transition cursor-pointer">
              Contact Desk
            </a>
            <span>•</span>
            <button onClick={scrollToTop} className="hover:text-red-400 transition font-bold text-slate-400 flex items-center gap-1 cursor-pointer">
              <ArrowUp className="w-3 h-3" /> Back to top
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

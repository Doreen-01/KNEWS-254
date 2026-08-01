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

  const navTo = (category: NewsCategory) => {
    scrollToTop();
    if (onSelectCategory) {
      onSelectCategory(category);
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setTimeout(() => setSubscribed(false), 5000);
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

          <div className="flex items-center gap-4 text-[11px] font-mono text-slate-300">
            <span className="flex items-center gap-1 text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-red-500" /> HQ: Nairobi, Kenya
            </span>
            <span className="hidden md:inline">•</span>
            <span className="hidden md:flex items-center gap-1 text-slate-400">
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400" /> Desk: +254 700 254 254
            </span>
          </div>
        </div>

        {/* Main Grid Navigation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-8">
          {/* Brand Info & Newsletter */}
          <div className="md:col-span-4 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-red-800 border border-red-500 flex items-center justify-center font-black text-white text-xl shadow-lg">
                  K
                </div>
                <div>
                  <span className="font-black text-2xl text-white tracking-tight">KNEWS<span className="text-red-600">254</span></span>
                  <span className="block text-[9px] font-mono text-slate-400 tracking-widest uppercase">Verified Kenya Newsroom</span>
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
                <button onClick={() => navTo('breaking')} className="hover:text-red-400 transition text-left">
                  Breaking News
                </button>
              </li>
              <li>
                <button onClick={() => navTo('politics')} className="hover:text-red-400 transition text-left">
                  Politics & Parliament
                </button>
              </li>
              <li>
                <button onClick={() => navTo('elections')} className="hover:text-red-400 font-bold text-red-400 transition text-left flex items-center gap-1">
                  2027 Election Centre
                </button>
              </li>
              <li>
                <button onClick={() => navTo('business')} className="hover:text-red-400 transition text-left">
                  Business & Markets
                </button>
              </li>
              <li>
                <button onClick={() => navTo('technology')} className="hover:text-red-400 transition text-left">
                  Silicon Savannah Tech
                </button>
              </li>
              <li>
                <button onClick={() => navTo('ai')} className="hover:text-red-400 transition text-left">
                  Kenya AI & Innovation
                </button>
              </li>
              <li>
                <button onClick={() => navTo('sports')} className="hover:text-red-400 transition text-left">
                  Sports & Athletics
                </button>
              </li>
              <li>
                <button onClick={() => navTo('county')} className="hover:text-red-400 transition text-left">
                  47 Counties Hub
                </button>
              </li>
              <li>
                <button onClick={() => navTo('investigations')} className="hover:text-red-400 transition text-left">
                  Investigative Desk
                </button>
              </li>
              <li>
                <button onClick={() => navTo('diaspora')} className="hover:text-red-400 transition text-left">
                  Global Diaspora
                </button>
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
                <button onClick={() => navTo('live')} className="hover:text-red-400 transition text-left flex items-center gap-1 text-emerald-400 font-bold">
                  <Radio className="w-3 h-3 animate-pulse" /> Live TV & Radio
                </button>
              </li>
              <li>
                <button onClick={() => navTo('videos')} className="hover:text-red-400 transition text-left">
                  Video Bulletins
                </button>
              </li>
              <li>
                <button onClick={() => navTo('podcasts')} className="hover:text-red-400 transition text-left">
                  Audio Podcasts
                </button>
              </li>
              <li>
                <button onClick={() => navTo('gallery')} className="hover:text-red-400 transition text-left">
                  Photojournalism
                </button>
              </li>
              <li>
                <button onClick={() => navTo('fact-checking')} className="hover:text-red-400 transition text-left">
                  Knews254 Verify
                </button>
              </li>
              <li>
                <button onClick={() => navTo('opinion')} className="hover:text-red-400 transition text-left">
                  Opinion & Editorials
                </button>
              </li>
              {onOpenAi && (
                <li>
                  <button onClick={() => { scrollToTop(); onOpenAi(); }} className="hover:text-amber-300 text-amber-400 transition text-left flex items-center gap-1 font-bold">
                    <Sparkles className="w-3 h-3" /> Ask Gemini AI
                  </button>
                </li>
              )}
              {onOpenCms && (
                <li>
                  <button onClick={() => { scrollToTop(); onOpenCms(); }} className="hover:text-emerald-300 text-emerald-400 transition text-left flex items-center gap-1 font-bold">
                    <Sliders className="w-3 h-3" /> Newsroom CMS
                  </button>
                </li>
              )}
              {onSelectTab && (
                <li>
                  <button onClick={() => { scrollToTop(); onSelectTab('prd'); }} className="hover:text-cyan-300 text-cyan-400 transition text-left font-bold">
                    System Architecture (PRD)
                  </button>
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
                <button onClick={() => navTo('editorial-policy')} className="hover:text-white transition text-left">
                  Editorial Policy
                </button>
              </li>
              <li>
                <button onClick={() => navTo('ethics-policy')} className="hover:text-white transition text-left">
                  Code of Ethics
                </button>
              </li>
              <li>
                <button onClick={() => navTo('factcheck-methodology')} className="hover:text-white transition text-left">
                  Fact-Check Method
                </button>
              </li>
              <li>
                <button onClick={() => navTo('anonymous-sources')} className="hover:text-white transition text-left">
                  Anonymous Sources
                </button>
              </li>
              <li>
                <button onClick={() => navTo('ai-policy')} className="hover:text-white transition text-left">
                  AI Usage Policy
                </button>
              </li>
              <li>
                <button onClick={() => navTo('corrections-policy')} className="hover:text-white transition text-left">
                  Corrections Policy
                </button>
              </li>
              <li>
                <button onClick={() => navTo('transparency-report')} className="hover:text-white transition text-left">
                  Ownership & Funding
                </button>
              </li>
              <li>
                <button onClick={() => navTo('community-guidelines')} className="hover:text-white transition text-left">
                  Community Rules
                </button>
              </li>
              <li>
                <button onClick={() => navTo('takedown-policy')} className="hover:text-white transition text-left">
                  Copyright & Takedown
                </button>
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
                <button onClick={() => navTo('about')} className="hover:text-white transition text-left">
                  About Knews254
                </button>
              </li>
              <li>
                <button onClick={() => navTo('authors')} className="hover:text-white transition text-left">
                  Editorial Board
                </button>
              </li>
              <li>
                <button onClick={() => navTo('contact')} className="hover:text-white transition text-left">
                  Contact Newsroom
                </button>
              </li>
              <li>
                <button onClick={() => navTo('careers')} className="hover:text-white transition text-left">
                  Careers & Fellowships
                </button>
              </li>
              <li>
                <button onClick={() => navTo('advertise')} className="hover:text-white transition text-left">
                  Advertise & Sponsor
                </button>
              </li>
              <li>
                <button onClick={() => navTo('reviews')} className="hover:text-white transition text-left text-amber-400 font-bold">
                  Reader Reviews & Ratings
                </button>
              </li>
              <li>
                <button onClick={() => navTo('how-we-review')} className="hover:text-white transition text-left">
                  How We Review Claims
                </button>
              </li>
              <li>
                <button onClick={() => navTo('faq')} className="hover:text-white transition text-left">
                  FAQ Centre
                </button>
              </li>
              <li>
                <button onClick={() => navTo('help-center')} className="hover:text-white transition text-left">
                  Help & Support Desk
                </button>
              </li>
              <li className="pt-2 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                Regional Bureaus
              </li>
              <li>
                <button onClick={() => navTo('county')} className="hover:text-slate-200 transition text-left">
                  Nairobi HQ Desk
                </button>
              </li>
              <li>
                <button onClick={() => navTo('county')} className="hover:text-slate-200 transition text-left">
                  Mombasa Coast Bureau
                </button>
              </li>
              <li>
                <button onClick={() => navTo('county')} className="hover:text-slate-200 transition text-left">
                  Kisumu Nyanza Bureau
                </button>
              </li>
              <li>
                <button onClick={() => navTo('county')} className="hover:text-slate-200 transition text-left">
                  Eldoret Rift Bureau
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Middle Bar: Mobile Apps & Global Bureaus */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-red-950/80 border border-red-800/80 flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="font-bold text-white text-xs">Download Knews254 Mobile Apps</p>
              <p className="text-[11px] text-slate-400">Offline reading, election push notifications, and audio reader for iOS & Android.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="bg-slate-950 border border-slate-800 text-slate-300 font-bold text-[10px] px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow">
               App Store
            </span>
            <span className="bg-slate-950 border border-slate-800 text-slate-300 font-bold text-[10px] px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow">
              ▶ Google Play Store
            </span>
          </div>
        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div className="space-y-1 text-center sm:text-left">
            <p>© 2026 Knews254 Media Group Ltd. All rights reserved. ISSN 2958-8422.</p>
            <p className="text-[10px] text-slate-400">Registered and regulated under Kenya Media Council Guidelines & Data Protection Act 2019.</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 font-mono">
            <button onClick={() => navTo('privacy-policy')} className="hover:text-slate-300 transition">
              Privacy Policy
            </button>
            <span>•</span>
            <button onClick={() => navTo('cookie-policy')} className="hover:text-slate-300 transition">
              Cookie Policy
            </button>
            <span>•</span>
            <button onClick={() => navTo('terms-of-service')} className="hover:text-slate-300 transition">
              Terms of Service
            </button>
            <span>•</span>
            <button onClick={() => navTo('contact')} className="hover:text-slate-300 transition">
              Contact Desk
            </button>
            <span>•</span>
            <button onClick={scrollToTop} className="hover:text-red-400 transition font-bold text-slate-400 flex items-center gap-1">
              <ArrowUp className="w-3 h-3" /> Back to top
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

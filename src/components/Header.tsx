import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Search, 
  BookOpen, 
  Radio, 
  Building2, 
  Vote, 
  ShieldCheck, 
  Volume2, 
  VolumeX, 
  Menu, 
  X, 
  Sparkles,
  ChevronDown,
  Newspaper,
  Trophy,
  Briefcase,
  Users,
  Camera,
  Shield,
  FileCheck,
  Globe,
  TrendingUp,
  Clock,
  Sun,
  Bell,
  Command,
  SlidersHorizontal,
  Bookmark,
  Share2,
  PhoneCall,
  PenTool
} from 'lucide-react';
import { NewsCategory } from '../types';

interface HeaderProps {
  activeTab: 'platform' | 'prd';
  setActiveTab: (tab: 'platform' | 'prd') => void;
  selectedCategory: NewsCategory;
  setSelectedCategory: (cat: NewsCategory) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenAiAssistant: () => void;
  onOpenCms: () => void;
  language: 'en' | 'sw' | 'sheng';
  setLanguage: (lang: 'en' | 'sw' | 'sheng') => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  onOpenAiAssistant,
  onOpenCms,
  language,
  setLanguage,
}) => {
  const [tickerMuted, setTickerMuted] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [edition, setEdition] = useState<'ke' | 'ea' | 'global'>('ke');
  const [selectedCityWeather, setSelectedCityWeather] = useState('Nairobi 24°C ☀️');
  const [tickerIndex, setTickerIndex] = useState(0);
  const [hasNotifications, setHasNotifications] = useState(true);
  const [showSavedNotification, setShowSavedNotification] = useState(false);

  const breakingNewsHeadlines = [
    'Infotrak Governance Audit: Edwin Sifuna approval surges to 42.5% as public tracks SHIF & economic policy debates',
    'Parliament Live Desk: Lawmakers demand urgent tax relief & SME protection in 2026 Emergency Finance Bill',
    'Treasury & CBK Report: Kenya Shilling holds steady at 128.40 vs US Dollar amid strong tea & coffee exports',
    'Ministry of Health & SHIF Review Board hold national public participation forums across all 47 counties',
    'IEBC & Media Council announce joint press guidelines & digital reporter accreditation for 2027 General Election',
    'Ministry of Energy commissions 220MW green geothermal grid expansion in Naivasha Olkaria complex',
    'High Court issues temporary conservancy order on regional agricultural tax framework pending bench ruling'
  ];

  // Rotate ticker every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % breakingNewsHeadlines.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Keyboard shortcut listener (Cmd+K / Ctrl+K for search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('global-header-search-input');
        if (searchInput) {
          searchInput.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const currentDateStr = new Date().toLocaleDateString('en-KE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const mainCategoryItems: { id: NewsCategory; label: string; icon?: React.ReactNode; badge?: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'breaking', label: 'Breaking', icon: <Flame className="w-3.5 h-3.5 text-red-500 animate-pulse" />, badge: 'LIVE' },
    { id: 'latest', label: 'Latest News' },
    { id: 'blog', label: 'Blog', icon: <PenTool className="w-3.5 h-3.5 text-amber-400" />, badge: 'POSTS' },
    { id: 'politics', label: 'Politics' },
    { id: 'elections', label: 'Elections 2027', icon: <Vote className="w-3.5 h-3.5 text-emerald-500" />, badge: 'HOT' },
    { id: 'business', label: 'Business' },
    { id: 'economy', label: 'Economy' },
    { id: 'technology', label: 'Tech & AI', icon: <Sparkles className="w-3.5 h-3.5 text-purple-400" /> },
    { id: 'sports', label: 'Sports' },
    { id: 'county', label: 'County News', icon: <Building2 className="w-3.5 h-3.5 text-blue-500" /> },
    { id: 'fact-checking', label: 'Fact Check', icon: <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />, badge: 'VERIFIED' },
    { id: 'podcasts', label: 'Audio & Podcasts' },
  ];

  const megaMenuItems = [
    {
      title: 'News & Politics',
      icon: <Newspaper className="w-4 h-4 text-red-500" />,
      items: [
        { id: 'home' as NewsCategory, label: 'Home Feed' },
        { id: 'breaking' as NewsCategory, label: 'Breaking News Desk' },
        { id: 'latest' as NewsCategory, label: 'Latest Dispatch' },
        { id: 'politics' as NewsCategory, label: 'National Politics' },
        { id: 'elections' as NewsCategory, label: 'Elections 2027 Dashboard' },
        { id: 'county' as NewsCategory, label: '47 County Intelligence' },
        { id: 'international' as NewsCategory, label: 'Global Affairs' },
        { id: 'diaspora' as NewsCategory, label: 'Kenyan Diaspora Voice' },
      ]
    },
    {
      title: 'Finance & Innovation',
      icon: <Briefcase className="w-4 h-4 text-emerald-500" />,
      items: [
        { id: 'business' as NewsCategory, label: 'Markets & Enterprises' },
        { id: 'economy' as NewsCategory, label: 'Macro Economy & Treasury' },
        { id: 'technology' as NewsCategory, label: 'Silicon Savannah Tech' },
        { id: 'ai' as NewsCategory, label: 'Artificial Intelligence Hub' },
        { id: 'agriculture' as NewsCategory, label: 'Agri-Business & Trade' },
      ]
    },
    {
      title: 'Sports & Athletics',
      icon: <Trophy className="w-4 h-4 text-amber-500" />,
      items: [
        { id: 'sports' as NewsCategory, label: 'Sports Central' },
        { id: 'football' as NewsCategory, label: 'FKF Premier League & Football' },
        { id: 'rugby' as NewsCategory, label: 'Kenya Sevens & Rugby' },
        { id: 'athletics' as NewsCategory, label: 'Athletics & Marathons' },
      ]
    },
    {
      title: 'Society & Culture',
      icon: <Users className="w-4 h-4 text-purple-400" />,
      items: [
        { id: 'entertainment' as NewsCategory, label: 'Arts & Entertainment' },
        { id: 'celebrity' as NewsCategory, label: 'Celebrity & Culture' },
        { id: 'lifestyle' as NewsCategory, label: 'Lifestyle & Wellness' },
        { id: 'health' as NewsCategory, label: 'Public Health' },
        { id: 'education' as NewsCategory, label: 'Education & Academics' },
        { id: 'climate' as NewsCategory, label: 'Climate & Sustainability' },
        { id: 'environment' as NewsCategory, label: 'Environment & Wildlife' },
        { id: 'crime' as NewsCategory, label: 'Justice & Security' },
        { id: 'investigations' as NewsCategory, label: 'Exclusives & Investigations' },
      ]
    },
    {
      title: 'Opinion & Integrity',
      icon: <ShieldCheck className="w-4 h-4 text-blue-400" />,
      items: [
        { id: 'blog' as NewsCategory, label: 'Official Knews254 Blog' },
        { id: 'opinion' as NewsCategory, label: 'Columnists & Opinion' },
        { id: 'editorials' as NewsCategory, label: 'Board Editorials' },
        { id: 'fact-checking' as NewsCategory, label: 'Fact-Check Desk' },
        { id: 'live' as NewsCategory, label: 'Live Coverage Feeds' },
      ]
    },
    {
      title: 'Multimodal Media',
      icon: <Camera className="w-4 h-4 text-pink-400" />,
      items: [
        { id: 'podcasts' as NewsCategory, label: 'Knews Podcasts' },
        { id: 'videos' as NewsCategory, label: 'Video Broadcasts' },
        { id: 'gallery' as NewsCategory, label: 'Photo Journalism' },
        { id: 'authors' as NewsCategory, label: 'Editorial Roster' },
      ]
    },
    {
      title: 'Governance & Standards',
      icon: <Shield className="w-4 h-4 text-slate-400" />,
      items: [
        { id: 'about' as NewsCategory, label: 'About Knews254' },
        { id: 'contact' as NewsCategory, label: 'Contact Newsroom' },
        { id: 'advertise' as NewsCategory, label: 'Corporate Advertising' },
        { id: 'careers' as NewsCategory, label: 'Careers & Fellowships' },
        { id: 'reviews' as NewsCategory, label: 'Reader Reviews' },
        { id: 'faq' as NewsCategory, label: 'Help & Knowledge Base' },
        { id: 'editorial-policy' as NewsCategory, label: 'Editorial Standards' },
        { id: 'corrections-policy' as NewsCategory, label: 'Corrections Register' },
        { id: 'privacy-policy' as NewsCategory, label: 'Privacy & Security' },
      ]
    }
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950 border-b border-slate-800 text-slate-100 shadow-2xl transition-all">
      {/* 1. TOP GLOBAL INTELLIGENCE & MARKETS STRIP */}
      <div className="bg-slate-900/90 px-4 py-1.5 text-xs border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Live Breaking News Continuous Flow Ticker */}
          <div className="flex items-center gap-2 overflow-hidden flex-1 max-w-2xl lg:max-w-3xl">
            <span className="bg-red-600 text-white font-black px-2 py-0.5 rounded text-[10px] tracking-widest uppercase flex items-center gap-1 shrink-0 shadow-sm z-10">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              BREAKING
            </span>
            <div className="overflow-hidden whitespace-nowrap relative flex-1 cursor-default">
              <div className="animate-marquee flex items-center gap-8">
                {[...breakingNewsHeadlines, ...breakingNewsHeadlines].map((headline, idx) => (
                  <span key={idx} className="inline-flex items-center gap-3 text-slate-200 text-xs font-medium hover:text-white transition">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block shrink-0" />
                    <span>{headline}</span>
                  </span>
                ))}
              </div>
            </div>
            <button 
              onClick={() => setTickerMuted(!tickerMuted)} 
              className="text-slate-400 hover:text-white transition shrink-0 ml-1 z-10"
              title="Toggle audio alerts"
            >
              {tickerMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-red-400" />}
            </button>
          </div>

          {/* Financial Markets, City Weather & Regional Edition Controls */}
          <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px] shrink-0">
            {/* Markets ticker */}
            <div className="hidden xl:flex items-center gap-3 border-r border-slate-800 pr-3">
              <span>USD/KES: <strong className="text-emerald-400 font-bold">128.40 ▲</strong></span>
              <span>NSE-20: <strong className="text-emerald-400 font-bold">1,745 ▲</strong></span>
              <span>BRENT OIL: <strong className="text-red-400 font-bold">$81.50 ▼</strong></span>
            </div>

            {/* Weather City Selector */}
            <div className="hidden md:flex items-center gap-1.5 border-r border-slate-800 pr-3">
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <select
                value={selectedCityWeather}
                onChange={(e) => setSelectedCityWeather(e.target.value)}
                className="bg-transparent text-slate-200 font-mono text-[11px] cursor-pointer focus:outline-none"
              >
                <option value="Nairobi 24°C ☀️" className="bg-slate-900">Nairobi: 24°C ☀️</option>
                <option value="Mombasa 30°C 🌤️" className="bg-slate-900">Mombasa: 30°C 🌤️</option>
                <option value="Kisumu 28°C ⛅" className="bg-slate-900">Kisumu: 28°C ⛅</option>
                <option value="Eldoret 20°C 🌧️" className="bg-slate-900">Eldoret: 20°C 🌧️</option>
                <option value="Nakuru 22°C ⛅" className="bg-slate-900">Nakuru: 22°C ⛅</option>
              </select>
            </div>

            {/* Edition Switcher */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-[10px] font-bold">
              <Globe className="w-3 h-3 text-red-500" />
              <button 
                onClick={() => setEdition('ke')} 
                className={`hover:text-white ${edition === 'ke' ? 'text-red-400 font-extrabold' : 'text-slate-400'}`}
              >
                Kenya
              </button>
              <span className="text-slate-700">|</span>
              <button 
                onClick={() => setEdition('ea')} 
                className={`hover:text-white ${edition === 'ea' ? 'text-red-400 font-extrabold' : 'text-slate-400'}`}
              >
                East Africa
              </button>
              <span className="text-slate-700">|</span>
              <button 
                onClick={() => setEdition('global')} 
                className={`hover:text-white ${edition === 'global' ? 'text-red-400 font-extrabold' : 'text-slate-400'}`}
              >
                Diaspora
              </button>
            </div>

            {/* Language Switcher with 44px Touch Targets */}
            <div className="flex items-center bg-slate-950 rounded-lg p-1 border border-slate-800 gap-1">
              <button 
                onClick={() => setLanguage('en')} 
                className={`min-w-[36px] min-h-[36px] px-2.5 py-1.5 rounded-md text-xs font-bold transition flex items-center justify-center ${language === 'en' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                aria-label="Switch to English language"
              >
                EN
              </button>
              <button 
                onClick={() => setLanguage('sw')} 
                className={`min-w-[36px] min-h-[36px] px-2.5 py-1.5 rounded-md text-xs font-bold transition flex items-center justify-center ${language === 'sw' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                aria-label="Switch to Swahili language"
              >
                SW
              </button>
              <button 
                onClick={() => setLanguage('sheng')} 
                className={`min-w-[36px] min-h-[36px] px-2.5 py-1.5 rounded-md text-xs font-bold transition flex items-center justify-center ${language === 'sheng' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                aria-label="Switch to Sheng dialect"
              >
                SHENG
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MASTER BRAND MASTHEAD & SEARCH BAR */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-6">
        {/* Newspaper Masthead Brand */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              setActiveTab('platform');
              setSelectedCategory('home');
            }} 
            className="flex items-center gap-3 text-left group focus:outline-none"
          >
            {/* Kenya Flag Emblem Badge */}
            <div className="w-11 h-11 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center relative overflow-hidden shadow-lg group-hover:border-red-500 transition">
              <span className="font-black text-2xl text-white tracking-tighter">K</span>
              <div className="absolute bottom-0 inset-x-0 h-2 flex">
                <div className="w-1/3 bg-slate-950" />
                <div className="w-1/3 bg-red-600" />
                <div className="w-1/3 bg-emerald-600" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-2xl md:text-3xl tracking-tight text-white group-hover:text-red-500 transition font-serif">KNEWS</span>
                <span className="font-black text-2xl md:text-3xl tracking-tight text-red-600 font-serif">254</span>
                <span className="hidden sm:inline-block bg-slate-800 text-slate-300 font-mono text-[9px] px-1.5 py-0.5 rounded border border-slate-700 uppercase font-bold">
                  PRO
                </span>
              </div>
              <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-slate-400 -mt-0.5">
                <span>TRUTH • INDEPENDENCE • INTEGRITY</span>
                <span className="hidden lg:inline text-slate-600">•</span>
                <span className="hidden lg:inline text-slate-500 font-normal">{currentDateStr}</span>
              </div>
            </div>
          </button>
        </div>

        {/* Global Smart Search Bar with Keyboard Command Badge */}
        <div className="hidden md:flex items-center flex-1 max-w-lg relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
          <input
            id="global-header-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search breaking stories, 47 counties, politics, elections..."
            className="w-full bg-slate-900 text-slate-100 placeholder-slate-500 text-xs rounded-xl pl-10 pr-16 py-2.5 border border-slate-800 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition shadow-inner"
          />
          {searchQuery ? (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 text-slate-400 hover:text-white text-[10px] font-bold bg-slate-800 px-1.5 py-0.5 rounded"
            >
              CLEAR
            </button>
          ) : (
            <div className="absolute right-3 flex items-center gap-1 text-[10px] text-slate-500 font-mono pointer-events-none bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
              <Command className="w-2.5 h-2.5" /> K
            </div>
          )}
        </div>

        {/* Action Center: Admin CMS, AI Assistant, Alerts & Workspace Switcher */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Breaking Alerts Bell */}
          <button
            onClick={() => setHasNotifications(!hasNotifications)}
            className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 rounded-xl transition relative"
            title="Toggle Breaking Alerts"
          >
            <Bell className="w-4 h-4" />
            {hasNotifications && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full animate-ping" />
            )}
          </button>

          {/* WhatsApp Newsroom Direct Tip Button */}
          <a
            href="https://wa.me/254711837011?text=Hello%20Knews254%20Newsroom,%20I%20have%20a%20breaking%20news%20tip/inquiry:"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 bg-emerald-950/90 hover:bg-emerald-900 text-emerald-400 border border-emerald-700/80 px-3 py-2 rounded-xl text-xs font-bold transition shadow-md"
            title="Chat or send breaking news tips directly on WhatsApp"
          >
            <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
            <span>WhatsApp Desk</span>
          </a>

          {/* CMS Admin Portal */}
          <button
            onClick={onOpenCms}
            className="bg-slate-900 hover:bg-slate-800 text-red-400 hover:text-red-300 border border-red-500/30 px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            title="Open Editorial CMS & Infrastructure Portal"
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">CMS Admin</span>
          </button>

          {/* AI Desk Assistant */}
          <button
            onClick={onOpenAiAssistant}
            className="hidden lg:flex items-center gap-1.5 bg-gradient-to-r from-red-600 via-amber-600 to-red-600 bg-[length:200%_auto] animate-gradient hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition shadow-lg"
            title="Interact with AI Intelligence Newsroom Desk"
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI News Desk
          </button>

          {/* Workspace View Switcher: Live Media vs Executive PRD */}
          <div className="bg-slate-900 p-1 rounded-xl border border-slate-800 flex items-center shadow-inner">
            <button
              onClick={() => setActiveTab('platform')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'platform'
                  ? 'bg-red-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Live Media</span>
            </button>

            <button
              onClick={() => setActiveTab('prd')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'prd'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Master PRD</span>
            </button>
          </div>

          {/* Mobile Navigation Drawer Trigger */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 bg-slate-900 rounded-xl text-slate-300 hover:text-white border border-slate-800"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* 3. CATEGORY NAVIGATION STRIP & MEGA MENU */}
      {activeTab === 'platform' && (
        <div className="bg-slate-900/90 backdrop-blur border-t border-slate-800/80 px-4 relative">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-1 overflow-x-auto no-scrollbar py-2">
            <div className="flex items-center gap-1">
              {mainCategoryItems.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setActiveDropdown(null);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition relative ${
                    selectedCategory === cat.id
                      ? 'bg-slate-950 text-red-400 border border-red-500/40 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {cat.icon}
                  <span>{cat.label}</span>
                  {cat.badge && (
                    <span className="text-[9px] font-black px-1 py-0.2 rounded bg-red-600 text-white tracking-widest uppercase">
                      {cat.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Mega Menu Full Sections Toggle Button */}
            <button
              onClick={() => setActiveDropdown(activeDropdown === 'all' ? null : 'all')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold shrink-0 transition ${
                activeDropdown === 'all'
                  ? 'bg-red-600 text-white shadow'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>All Sections</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeDropdown === 'all' ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Mega Menu Full Desktop Drawer */}
          {activeDropdown === 'all' && (
            <div className="absolute top-full inset-x-0 bg-slate-950/98 backdrop-blur-md border-b border-slate-800 shadow-2xl p-6 z-50 animate-fadeIn">
              <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
                {megaMenuItems.map((section, idx) => (
                  <div key={idx} className="space-y-3">
                    <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                      {section.icon}
                      <h4 className="text-xs font-black uppercase text-slate-100 tracking-wider font-serif">
                        {section.title}
                      </h4>
                    </div>
                    <ul className="space-y-1.5">
                      {section.items.map((item) => (
                        <li key={item.id}>
                          <button
                            onClick={() => {
                              setSelectedCategory(item.id);
                              setActiveDropdown(null);
                            }}
                            className={`text-xs font-medium block w-full text-left py-1 px-2 rounded transition ${
                              selectedCategory === item.id
                                ? 'text-red-400 bg-slate-900 font-bold border-l-2 border-red-500'
                                : 'text-slate-400 hover:text-white hover:bg-slate-900/80'
                            }`}
                          >
                            {item.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. MOBILE NAVIGATION DRAWER */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-800 px-4 py-4 space-y-5 max-h-[85vh] overflow-y-auto">
          {/* Mobile Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search news, topics, 47 counties..."
              className="w-full bg-slate-900 text-slate-100 placeholder-slate-500 text-xs rounded-xl pl-9 pr-4 py-2.5 border border-slate-800"
            />
          </div>

          {/* Quick AI & CMS buttons for Mobile */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => {
                onOpenAiAssistant();
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-red-600 to-amber-600 text-white font-bold p-2 rounded-xl"
            >
              <Sparkles className="w-3.5 h-3.5" />
              AI News Desk
            </button>
            <button
              onClick={() => {
                onOpenCms();
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-1.5 bg-slate-900 text-red-400 border border-red-500/30 font-bold p-2 rounded-xl"
            >
              <FileCheck className="w-3.5 h-3.5" />
              CMS Admin
            </button>
          </div>

          {/* Mobile Mega Sections */}
          {megaMenuItems.map((section, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex items-center gap-2 border-b border-slate-800/80 pb-1">
                {section.icon}
                <p className="text-xs font-black uppercase text-slate-300 tracking-wider">{section.title}</p>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {section.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedCategory(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`text-xs text-left py-1.5 px-2 rounded-lg border border-slate-800/80 truncate ${
                      selectedCategory === item.id
                        ? 'bg-red-600 text-white font-bold'
                        : 'bg-slate-900 text-slate-300 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </header>
  );
};


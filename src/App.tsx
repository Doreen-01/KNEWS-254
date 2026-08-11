import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ArticleCard } from './components/ArticleCard';
import { PrdViewer } from './components/PrdViewer';
import { ElectionCentre } from './components/ElectionCentre';
import { CountyNewsExplorer } from './components/CountyNewsExplorer';
import { FactCheckHub } from './components/FactCheckHub';
import { LiveBlogViewer } from './components/LiveBlogViewer';
import { MultimediaHub } from './components/MultimediaHub';
import { AdminCmsPortal } from './components/AdminCmsPortal';
import { AiNewsAssistant } from './components/AiNewsAssistant';
import { Footer } from './components/Footer';
import { CategoryPage } from './components/CategoryPage';
import { SpecialtyPages } from './components/SpecialtyPages';
import { ArticleDetailModal } from './components/ArticleDetailModal';
import { Article, NewsCategory } from './types';
import { articleService } from './services/articleService';
import { FEATURED_ARTICLES } from './data/newsData';
import { SeoManager } from './components/SeoManager';
import { getTranslation, AppLanguage } from './utils/i18n';
import { Flame, Sparkles, Sliders, ArrowRight, ShieldCheck, PhoneCall, RefreshCw, AlertCircle, FileText, Home, Building2, Vote, FileCheck, Database, Check } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'platform' | 'prd'>('platform');
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoadingArticles, setIsLoadingArticles] = useState(true);
  const [articlesError, setArticlesError] = useState<string | null>(null);
  const [activeArticleForAi, setActiveArticleForAi] = useState<Article | null>(null);
  const [selectedArticleDetail, setSelectedArticleDetail] = useState<Article | null>(null);
  const [language, setLanguageState] = useState<AppLanguage>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const langParam = params.get('lang');
      if (langParam === 'sw' || langParam === 'sheng' || langParam === 'en') {
        return langParam as AppLanguage;
      }
      const saved = localStorage.getItem('knews254_lang');
      if (saved === 'sw' || saved === 'sheng' || saved === 'en') return saved as AppLanguage;
    }
    return 'en';
  });

  const setLanguage = (lang: AppLanguage) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('knews254_lang', lang);
      const url = new URL(window.location.href);
      url.searchParams.set('lang', lang);
      window.history.replaceState({}, '', url.toString());
    }
  };

  const t = getTranslation(language);
  const [showAdminPortal, setShowAdminPortal] = useState(false);
  const [adminInitialTab, setAdminInitialTab] = useState<string>('overview');
  const [adminInitialOpenDraft, setAdminInitialOpenDraft] = useState<boolean>(false);
  const [isFallbackArticles, setIsFallbackArticles] = useState(false);

  const handleOpenCms = (tab: string = 'overview', openDraft: boolean = false) => {
    setAdminInitialTab(tab);
    setAdminInitialOpenDraft(openDraft);
    setShowAdminPortal(true);
  };
  const [isSeeding, setIsSeeding] = useState(false);

  // Sync Published Articles from Supabase with cache-busting & error re-validation
  const loadArticles = async (forceFresh = false) => {
    setIsLoadingArticles(true);
    setArticlesError(null);
    try {
      const result = await articleService.listPublishedArticles({ forceFresh, bypassCache: forceFresh });
      setArticles(result.data || []);
      setIsFallbackArticles(Boolean(result.isFallback));
    } catch (err: any) {
      setArticlesError(err?.message || 'Failed to load articles from Supabase.');
      setArticles([]);
    } finally {
      setIsLoadingArticles(false);
    }
  };

  const handleSeedDatabase = async () => {
    setIsSeeding(true);
    try {
      const res = await articleService.seedInitialArticles();
      if (res.success) {
        await loadArticles(true);
      } else if (res.error) {
        alert('Seeding error: ' + res.error);
      }
    } catch (err: any) {
      alert('Failed to seed: ' + err?.message);
    } finally {
      setIsSeeding(false);
    }
  };

  useEffect(() => {
    loadArticles();

    // Check pathname and query params for deep linking and redirects
    const parseUrlAndRoute = () => {
      if (typeof window === 'undefined') return;

      const path = window.location.pathname.replace(/^\/+|\/+$/g, '');
      const params = new URLSearchParams(window.location.search);
      const articleParam = params.get('article') || params.get('id');
      const catParam = params.get('cat') || params.get('category');

      // 1. Article path/param routing (/article/slug, /en/news/slug, /sw/habari/slug, or ?article=slug)
      let articleSlugToFetch = '';
      if (path.startsWith('article/')) {
        articleSlugToFetch = path.replace('article/', '');
      } else if (path.startsWith('en/news/')) {
        const parts = path.replace('en/news/', '').split('/');
        articleSlugToFetch = parts[parts.length - 1];
      } else if (path.startsWith('sw/habari/')) {
        const parts = path.replace('sw/habari/', '').split('/');
        articleSlugToFetch = parts[parts.length - 1];
      } else if (path.startsWith('news/')) {
        const parts = path.replace('news/', '').split('/');
        articleSlugToFetch = parts[parts.length - 1];
      } else if (articleParam) {
        articleSlugToFetch = articleParam;
      }

      if (articleSlugToFetch) {
        articleService.getArticleBySlug(articleSlugToFetch).then((art) => {
          if (art) {
            setSelectedArticleDetail(art);
            document.title = `${art.title} — Knews254`;
          }
        });
      }

      // 2. Category path/param routing (/category/cat or /cat or ?cat=cat)
      if (path.startsWith('category/')) {
        const cat = path.replace('category/', '') as NewsCategory;
        if (cat) setSelectedCategory(cat);
      } else if (catParam) {
        setSelectedCategory(catParam as NewsCategory);
      } else if (path && path !== 'index.html' && path !== 'prd') {
        const validCategories: NewsCategory[] = [
          'home', 'breaking', 'politics', 'business', 'county', 'elections',
          'investigations', 'fact-checking', 'opinion', 'international', 'technology', 'sports',
          'lifestyle', 'entertainment', 'gallery', 'authors', 'about', 'contact',
          'advertise', 'careers', 'editorial-policy', 'ethics-policy', 'privacy-policy',
          'cookie-policy', 'terms-of-service', 'corrections-policy', 'ai-policy',
          'factcheck-methodology', 'anonymous-sources', 'transparency-report',
          'funding-policy', 'community-guidelines', 'takedown-policy', 'reviews',
          'how-we-review', 'faq', 'help-center'
        ];
        if (validCategories.includes(path as NewsCategory)) {
          setSelectedCategory(path as NewsCategory);
        }
      } else if (path === 'prd') {
        setActiveTab('prd');
      }
    };

    parseUrlAndRoute();

    const handlePopState = () => parseUrlAndRoute();
    window.addEventListener('popstate', handlePopState);

    // Secondary re-validation check whenever a story is posted or updated via CMS
    let secondaryCheckTimer: ReturnType<typeof setTimeout> | null = null;

    const handleArticlesUpdate = () => {
      // Immediate load with fresh cache-busting request
      loadArticles(true);

      // Secondary check 800ms later to re-validate published status and bypass DB replication latency
      if (secondaryCheckTimer) clearTimeout(secondaryCheckTimer);
      secondaryCheckTimer = setTimeout(() => {
        loadArticles(true);
      }, 800);
    };

    window.addEventListener('knews254_articles_updated', handleArticlesUpdate);

    // Re-validate published articles when document becomes visible (e.g., returning from CMS tab)
    const handleVisibilityChange = () => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        loadArticles(true);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('knews254_articles_updated', handleArticlesUpdate);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (secondaryCheckTimer) clearTimeout(secondaryCheckTimer);
    };
  }, []);

  // Filter Articles by search query
  const searchFilteredArticles = articles.filter((art) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      art.title.toLowerCase().includes(q) ||
      art.summary.toLowerCase().includes(q) ||
      (art.county && art.county.toLowerCase().includes(q)) ||
      art.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  const leadArticle = searchFilteredArticles[0] || articles[0] || null;
  const secondaryArticles = searchFilteredArticles.slice(1, 5);

  const handleSelectCategory = (cat: NewsCategory) => {
    setSelectedCategory(cat);
    if (typeof window !== 'undefined') {
      const newUrl = cat === 'home' ? '/' : `/?cat=${encodeURIComponent(cat)}`;
      window.history.pushState({ category: cat }, '', newUrl);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectArticleDetail = (art: Article | null) => {
    setSelectedArticleDetail(art);
    if (typeof window !== 'undefined') {
      if (art) {
        const articleSlug = art.slug || art.id;
        window.history.pushState({ article: articleSlug }, '', `/article/${encodeURIComponent(articleSlug)}`);
        document.title = `${art.title} — Knews254`;
      } else {
        const catUrl = selectedCategory === 'home' ? '/' : `/?cat=${encodeURIComponent(selectedCategory)}`;
        window.history.pushState({ category: selectedCategory }, '', catUrl);
        document.title = 'Knews254 — Kenya & East Africa Dispatches';
      }
    }
  };

  const isSpecialtyCategory = [
    'gallery',
    'authors',
    'about',
    'contact',
    'advertise',
    'careers',
    'editorial-policy',
    'ethics-policy',
    'privacy-policy',
    'cookie-policy',
    'terms-of-service',
    'corrections-policy',
    'ai-policy',
    'factcheck-methodology',
    'anonymous-sources',
    'transparency-report',
    'funding-policy',
    'community-guidelines',
    'takedown-policy',
    'reviews',
    'how-we-review',
    'faq',
    'help-center',
  ].includes(selectedCategory);

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen font-sans antialiased flex flex-col selection:bg-red-600 selection:text-white">
      {/* SEO Head & JSON-LD Meta Tag Manager */}
      <SeoManager
        category={selectedCategory}
        article={selectedArticleDetail}
        searchQuery={searchQuery}
      />

      {/* Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        selectedCategory={selectedCategory}
        setSelectedCategory={handleSelectCategory}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
        onOpenCms={handleOpenCms}
        language={language}
        setLanguage={setLanguage}
      />

      {/* Admin CMS Portal Overlay Modal */}
      {showAdminPortal && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-5xl w-full p-6 space-y-4 relative shadow-2xl my-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="font-black text-white text-base">Knews254 Editorial Content Management System (CMS)</span>
              <button
                onClick={() => setShowAdminPortal(false)}
                className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg cursor-pointer"
              >
                Close CMS Portal
              </button>
            </div>
            <AdminCmsPortal
              initialTab={adminInitialTab}
              initialShowDraftModal={adminInitialOpenDraft}
              onClose={() => setShowAdminPortal(false)}
              onNavigateCategory={(cat) => {
                handleSelectCategory(cat);
                setShowAdminPortal(false);
              }}
              onNavigateTab={(tab) => {
                setActiveTab(tab);
                setShowAdminPortal(false);
              }}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 pb-16 md:pb-0">
        {activeTab === 'prd' ? (
          <PrdViewer />
        ) : isSpecialtyCategory ? (
          <SpecialtyPages
            category={selectedCategory}
            onSelectCategory={handleSelectCategory}
          />
        ) : selectedCategory !== 'home' ? (
          <CategoryPage
            category={selectedCategory}
            articles={articles}
            onSelectArticle={(art) => handleSelectArticleDetail(art)}
            onSelectCategory={handleSelectCategory}
            language={language}
          />
        ) : (
          /* Home Dashboard Page */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-12">
            {/* Section 1: Hero Lead & Secondary Breaking Stories */}
            <section className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
                  <h2 className="text-sm font-black uppercase tracking-widest text-slate-100 font-serif">
                    {t.breakingNews} • {t.latestNews}
                  </h2>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                  <span className="bg-slate-900 border border-slate-800/80 px-2.5 py-1 rounded-lg text-[11px] text-slate-300 font-bold">
                    NAIROBI (EAT)
                  </span>
                  <span className="hidden sm:inline-block text-[11px] text-slate-500 font-mono">
                    VERIFIED DESK DISPATCHES
                  </span>
                </div>
              </div>

              {/* Layout-Preserving Skeleton Loading State (0 CLS) */}
              {isLoadingArticles && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-pulse">
                  <div className="lg:col-span-8 bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-4">
                    <div className="aspect-[21/9] bg-slate-800/90 rounded-2xl w-full flex items-center justify-center">
                      <span className="text-xs font-mono text-slate-500">Loading High-Res Dispatch Media...</span>
                    </div>
                    <div className="h-4 bg-slate-800/80 rounded w-1/4" />
                    <div className="h-8 bg-slate-800/80 rounded w-3/4" />
                    <div className="h-4 bg-slate-800/80 rounded w-full" />
                    <div className="h-4 bg-slate-800/80 rounded w-2/3" />
                    <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-800" />
                        <div className="space-y-1">
                          <div className="h-3 bg-slate-800 rounded w-24" />
                          <div className="h-2 bg-slate-800 rounded w-32" />
                        </div>
                      </div>
                      <div className="h-8 bg-slate-800 rounded w-28" />
                    </div>
                  </div>
                  <div className="lg:col-span-4 space-y-4">
                    <div className="h-4 bg-slate-800 rounded w-1/2 mb-4" />
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="p-3 bg-slate-900 border border-slate-800 rounded-2xl flex gap-3 items-center">
                        <div className="w-20 h-20 bg-slate-800 rounded-xl shrink-0" />
                        <div className="space-y-2 flex-1">
                          <div className="h-3 bg-slate-800 rounded w-full" />
                          <div className="h-3 bg-slate-800 rounded w-3/4" />
                          <div className="h-2 bg-slate-800 rounded w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Seamless Reader-Facing Hero Master Grid */}
              {!isLoadingArticles && leadArticle && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Main Lead Feature Article - Hero Card (65% / 8-col) */}
                  <div className="lg:col-span-8">
                    <ArticleCard
                      article={leadArticle}
                      variant="hero"
                      onSelect={(art) => handleSelectArticleDetail(art)}
                      onOpenAiBrief={(art) => {
                        setActiveArticleForAi(art);
                        setIsAiAssistantOpen(true);
                      }}
                      onSelectCategory={(cat) => handleSelectCategory(cat)}
                      language={language}
                    />
                  </div>

                  {/* Secondary Breaking News Column - Horizontal Cards (35% / 4-col) */}
                  <div className="lg:col-span-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5 text-red-500" /> {t.breakingNews}
                      </span>
                      <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        VERIFIED FEED
                      </span>
                    </div>

                    {secondaryArticles.length > 0 ? (
                      secondaryArticles.map((art) => (
                        <ArticleCard
                          key={art.id}
                          article={art}
                          variant="horizontal"
                          onSelect={(article) => handleSelectArticleDetail(article)}
                          onOpenAiBrief={(article) => {
                            setActiveArticleForAi(article);
                            setIsAiAssistantOpen(true);
                          }}
                          language={language}
                        />
                      ))
                    ) : (
                      <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-center text-xs text-slate-500">
                        Stay tuned for upcoming breaking news dispatches.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </section>

            {/* Section 2: Latest News & Top Dispatches Stream */}
            {!isLoadingArticles && !articlesError && articles.length > 0 && (
              <section className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-red-500" />
                    <h2 className="text-sm font-black uppercase tracking-widest text-slate-100 font-serif">
                      Latest Dispatches & Top Stories
                    </h2>
                  </div>
                  <button
                    onClick={() => setSelectedCategory('politics')}
                    className="text-xs font-bold text-red-400 hover:text-red-300 flex items-center gap-1 transition cursor-pointer font-sans"
                  >
                    View All Dispatches <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {articles.slice(1, 4).map((art) => (
                    <ArticleCard
                      key={art.id}
                      article={art}
                      variant="standard"
                      onSelect={(article) => handleSelectArticleDetail(article)}
                      onOpenAiBrief={(article) => {
                        setActiveArticleForAi(article);
                        setIsAiAssistantOpen(true);
                      }}
                      language={language}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Section 3: Live Blog Coverage Stream */}
            <section className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <h2 className="text-sm font-black uppercase tracking-widest text-slate-100 font-serif">
                    Live Newsroom Coverage & Parliament Updates
                  </h2>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 font-bold bg-emerald-950/80 border border-emerald-800/80 px-2.5 py-1 rounded-lg">
                  LIVE DESK FEED
                </span>
              </div>
              <LiveBlogViewer />
            </section>

            {/* Section 4: Investigative Exclusives & Special Reports */}
            {!isLoadingArticles && !articlesError && articles.length > 0 && (
              <section className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <h2 className="text-sm font-black uppercase tracking-widest text-slate-100 font-serif">
                      {t.investigations} & Special Reports
                    </h2>
                  </div>
                  <button
                    onClick={() => setSelectedCategory('investigations')}
                    className="text-xs font-bold text-red-400 hover:text-red-300 flex items-center gap-1 transition cursor-pointer font-sans"
                  >
                    View All Investigations <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {articles.slice(0, 3).map((art) => (
                    <ArticleCard
                      key={art.id}
                      article={art}
                      variant="standard"
                      onSelect={(article) => handleSelectArticleDetail(article)}
                      onOpenAiBrief={(article) => {
                        setActiveArticleForAi(article);
                        setIsAiAssistantOpen(true);
                      }}
                      language={language}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Section 5: Multimedia Desk (Video & Audio Dispatches) */}
            <section className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-400" />
                  <h2 className="text-sm font-black uppercase tracking-widest text-slate-100 font-serif">
                    Video Desk, Audio Briefings & Podcasts
                  </h2>
                </div>
              </div>
              <MultimediaHub />
            </section>
          </div>
        )}
      </main>

      {/* Article Full Modal Viewer */}
      <ArticleDetailModal
        article={selectedArticleDetail}
        onClose={() => handleSelectArticleDetail(null)}
        onSelectCategory={handleSelectCategory}
        allArticles={articles}
        onSelectArticle={(art) => handleSelectArticleDetail(art)}
        language={language}
      />

      {/* AI Assistant Modal */}
      <AiNewsAssistant
        isOpen={isAiAssistantOpen}
        onClose={() => setIsAiAssistantOpen(false)}
        articleTitle={activeArticleForAi?.title || leadArticle?.title || 'Knews254 Assistant'}
        articleContent={activeArticleForAi?.content || leadArticle?.content || ''}
      />

      {/* Footer */}
      <Footer
        onSelectCategory={(cat) => {
          setActiveTab('platform');
          setSelectedCategory(cat);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenCms={() => handleOpenCms('overview', false)}
        onOpenAi={() => setIsAiAssistantOpen(true)}
      />

      {/* Floating WhatsApp Live Newsroom Button */}
      <a
        href="https://wa.me/254711837011?text=Hello%20Knews254%20Newsroom,%20I%20have%20a%20breaking%20news%20tip/inquiry:"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-20 left-4 z-40 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-2.5 rounded-full shadow-2xl border border-emerald-400/60 transition duration-300 hover:scale-105 flex items-center gap-2 group"
        title="Chat or send breaking news tips directly on WhatsApp"
      >
        <PhoneCall className="w-4 h-4 text-white group-hover:rotate-12 transition-transform" />
        <span className="font-bold">WhatsApp Desk</span>
      </a>

      {/* Modern Mobile Bottom Navigation Bar */}
      <nav 
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/90 px-2 py-1.5 flex items-center justify-around shadow-2xl"
        aria-label="Mobile Bottom Navigation"
      >
        <button
          onClick={() => handleSelectCategory('home')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] px-2 py-1 rounded-xl transition ${
            selectedCategory === 'home' && activeTab === 'platform' ? 'text-red-500 font-bold bg-slate-900' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Home className="w-4 h-4" />
          <span className="text-[10px] tracking-tight mt-0.5">Home</span>
        </button>

        <button
          onClick={() => handleSelectCategory('breaking')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] px-2 py-1 rounded-xl transition ${
            selectedCategory === 'breaking' ? 'text-red-500 font-bold bg-slate-900' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Flame className="w-4 h-4 text-red-500 animate-pulse" />
          <span className="text-[10px] tracking-tight mt-0.5">Breaking</span>
        </button>

        <button
          onClick={() => handleSelectCategory('county')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] px-2 py-1 rounded-xl transition ${
            selectedCategory === 'county' ? 'text-blue-400 font-bold bg-slate-900' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span className="text-[10px] tracking-tight mt-0.5">Counties</span>
        </button>

        <button
          onClick={() => handleSelectCategory('elections')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] px-2 py-1 rounded-xl transition ${
            selectedCategory === 'elections' ? 'text-emerald-400 font-bold bg-slate-900' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Vote className="w-4 h-4" />
          <span className="text-[10px] tracking-tight mt-0.5">2027 Polls</span>
        </button>

        <button
          onClick={() => setIsAiAssistantOpen(true)}
          className="flex flex-col items-center justify-center min-w-[56px] min-h-[44px] px-2 py-1 rounded-xl text-amber-400 hover:text-amber-300 transition"
        >
          <Sparkles className="w-4 h-4 text-amber-400 animate-spin-slow" />
          <span className="text-[10px] font-bold tracking-tight mt-0.5">AI Desk</span>
        </button>

        <button
          onClick={() => setShowAdminPortal(true)}
          className="flex flex-col items-center justify-center min-w-[56px] min-h-[44px] px-2 py-1 rounded-xl text-slate-400 hover:text-white transition"
        >
          <FileCheck className="w-4 h-4 text-slate-300" />
          <span className="text-[10px] tracking-tight mt-0.5">CMS</span>
        </button>
      </nav>
    </div>
  );
}

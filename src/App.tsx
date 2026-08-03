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
import { SeoManager } from './components/SeoManager';
import { Flame, Sparkles, Sliders, ArrowRight, ShieldCheck, PhoneCall, RefreshCw, AlertCircle, FileText, Home, Building2, Vote, FileCheck } from 'lucide-react';

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
  const [language, setLanguage] = useState<'en' | 'sw' | 'sheng'>('en');
  const [showAdminPortal, setShowAdminPortal] = useState(false);

  // Sync Published Articles from Supabase exclusively
  const loadArticles = async () => {
    setIsLoadingArticles(true);
    setArticlesError(null);
    try {
      const result = await articleService.listPublishedArticles();
      if (result.error) {
        setArticlesError(result.error);
        setArticles([]);
      } else {
        setArticles(result.data || []);
      }
    } catch (err: any) {
      setArticlesError(err?.message || 'Failed to load articles from Supabase.');
      setArticles([]);
    } finally {
      setIsLoadingArticles(false);
    }
  };

  useEffect(() => {
    loadArticles();

    // Check query params for deep linking
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const articleParam = params.get('article') || params.get('id');
      const catParam = params.get('cat') || params.get('category');
      
      if (catParam) {
        setSelectedCategory(catParam as NewsCategory);
      }

      if (articleParam) {
        articleService.getArticleBySlug(articleParam).then(art => {
          if (art) setSelectedArticleDetail(art);
        });
      }
    }

    const handleArticlesUpdate = () => loadArticles();
    window.addEventListener('knews254_articles_updated', handleArticlesUpdate);
    return () => window.removeEventListener('knews254_articles_updated', handleArticlesUpdate);
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
        onOpenCms={() => setShowAdminPortal(true)}
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
            <AdminCmsPortal />
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
            onSelectArticle={(art) => setSelectedArticleDetail(art)}
            onSelectCategory={handleSelectCategory}
          />
        ) : (
          /* Home Dashboard Page */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-12">
            {/* Lead Headlines Section */}
            <section className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
                  <h2 className="text-sm font-black uppercase tracking-widest text-slate-100 font-serif">
                    Top Lead Headlines & Breaking Bulletins
                  </h2>
                </div>

                <button
                  onClick={() => setShowAdminPortal(!showAdminPortal)}
                  className="text-xs font-bold text-slate-400 hover:text-white bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition shadow-sm cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5 text-red-500" />
                  Editorial CMS Portal
                </button>
              </div>

              {/* Loading State */}
              {isLoadingArticles && (
                <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center space-y-3 my-6">
                  <RefreshCw className="w-8 h-8 text-red-500 animate-spin mx-auto" />
                  <p className="text-sm font-semibold text-slate-300">Fetching live verified dispatches from Supabase database...</p>
                </div>
              )}

              {/* Error State */}
              {!isLoadingArticles && articlesError && (
                <div className="bg-red-950/60 border border-red-800/80 rounded-3xl p-8 text-center space-y-4 my-6 max-w-2xl mx-auto">
                  <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
                  <div>
                    <h3 className="text-base font-bold text-white">Database Query Error</h3>
                    <p className="text-xs text-red-200 mt-1 font-mono">{articlesError}</p>
                  </div>
                  <button
                    onClick={loadArticles}
                    className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Retry Supabase Query
                  </button>
                </div>
              )}

              {/* Empty State */}
              {!isLoadingArticles && !articlesError && articles.length === 0 && (
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-4 my-6 max-w-2xl mx-auto">
                  <FileText className="w-12 h-12 text-slate-600 mx-auto" />
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-white">No Published Stories Found</h3>
                    <p className="text-xs text-slate-400">
                      The Supabase articles database has no stories with status <code className="text-amber-400 bg-slate-950 px-1 py-0.5 rounded">published</code> yet.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAdminPortal(true)}
                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-lg cursor-pointer"
                  >
                    Open CMS Portal to Publish Stories
                  </button>
                </div>
              )}

              {/* Hero Master Grid */}
              {!isLoadingArticles && !articlesError && leadArticle && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Main Lead Feature Article - Hero Card */}
                  <div className="lg:col-span-8">
                    <ArticleCard
                      article={leadArticle}
                      variant="hero"
                      onSelect={(art) => setSelectedArticleDetail(art)}
                      onOpenAiBrief={(art) => {
                        setActiveArticleForAi(art);
                        setIsAiAssistantOpen(true);
                      }}
                    />
                  </div>

                  {/* Secondary Breaking News Column - Horizontal Cards */}
                  <div className="lg:col-span-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5 text-red-500" /> Secondary Breaking
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">SUPABASE LIVE</span>
                    </div>

                    {secondaryArticles.length > 0 ? (
                      secondaryArticles.map((art) => (
                        <ArticleCard
                          key={art.id}
                          article={art}
                          variant="horizontal"
                          onSelect={(article) => setSelectedArticleDetail(article)}
                          onOpenAiBrief={(article) => {
                            setActiveArticleForAi(article);
                            setIsAiAssistantOpen(true);
                          }}
                        />
                      ))
                    ) : (
                      <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-center text-xs text-slate-500">
                        Publish more stories in CMS to populate secondary dispatches.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </section>

            {/* Editor's Choice & Investigative Exclusives Section */}
            {!isLoadingArticles && !articlesError && articles.length > 0 && (
              <section className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <h2 className="text-sm font-black uppercase tracking-widest text-slate-100 font-serif">
                      Editor's Choice & Investigative Exclusives
                    </h2>
                  </div>
                  <button
                    onClick={() => setSelectedCategory('investigations')}
                    className="text-xs font-bold text-red-400 hover:text-red-300 flex items-center gap-1 transition cursor-pointer"
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
                      onSelect={(article) => setSelectedArticleDetail(article)}
                      onOpenAiBrief={(article) => {
                        setActiveArticleForAi(article);
                        setIsAiAssistantOpen(true);
                      }}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Kenya 2027 Election Center Hub */}
            <section>
              <ElectionCentre />
            </section>

            {/* 47 Kenya Counties Hyper-Local News Hub */}
            <section>
              <CountyNewsExplorer />
            </section>

            {/* Knews254 Verify Fact Check Center */}
            <section>
              <FactCheckHub />
            </section>

            {/* Live Blog Stream & Parliament Coverage */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7">
                <LiveBlogViewer />
              </div>
              <div className="lg:col-span-5">
                <MultimediaHub />
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Article Full Modal Viewer */}
      <ArticleDetailModal
        article={selectedArticleDetail}
        onClose={() => setSelectedArticleDetail(null)}
        onSelectCategory={handleSelectCategory}
        allArticles={articles}
        onSelectArticle={(art) => setSelectedArticleDetail(art)}
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
        onOpenCms={() => setShowAdminPortal(true)}
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

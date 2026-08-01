import React, { useState } from 'react';
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
import { FEATURED_ARTICLES } from './data/newsData';
import { Article, NewsCategory } from './types';
import { Flame, Sparkles, Clock, Eye, Sliders, ArrowRight, TrendingUp, ShieldCheck, Newspaper, Compass } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'platform' | 'prd'>('platform');
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [activeArticleForAi, setActiveArticleForAi] = useState<Article>(FEATURED_ARTICLES[0]);
  const [selectedArticleDetail, setSelectedArticleDetail] = useState<Article | null>(null);
  const [language, setLanguage] = useState<'en' | 'sw' | 'sheng'>('en');
  const [showAdminPortal, setShowAdminPortal] = useState(false);

  // Filter Articles by search query
  const searchFilteredArticles = FEATURED_ARTICLES.filter((art) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      art.title.toLowerCase().includes(q) ||
      art.summary.toLowerCase().includes(q) ||
      art.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  const leadArticle = searchFilteredArticles[0] || FEATURED_ARTICLES[0];
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
                className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg"
              >
                Close CMS Portal
              </button>
            </div>
            <AdminCmsPortal />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1">
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
            articles={FEATURED_ARTICLES}
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
                  className="text-xs font-bold text-slate-400 hover:text-white bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition shadow-sm"
                >
                  <Sliders className="w-3.5 h-3.5 text-red-500" />
                  Editorial CMS Portal
                </button>
              </div>

              {/* Hero Master Grid */}
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
                    <span className="text-[10px] text-slate-500 font-mono">UPDATED LIVE</span>
                  </div>

                  {secondaryArticles.map((art) => (
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
                  ))}
                </div>
              </div>
            </section>

            {/* Editor's Choice & Investigative Exclusives Section */}
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
                  className="text-xs font-bold text-red-400 hover:text-red-300 flex items-center gap-1 transition"
                >
                  View All Investigations <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {FEATURED_ARTICLES.slice(1, 4).map((art) => (
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
        allArticles={FEATURED_ARTICLES}
        onSelectArticle={(art) => setSelectedArticleDetail(art)}
      />

      {/* AI Assistant Modal */}
      <AiNewsAssistant
        isOpen={isAiAssistantOpen}
        onClose={() => setIsAiAssistantOpen(false)}
        articleTitle={activeArticleForAi.title}
        articleContent={activeArticleForAi.content}
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
    </div>
  );
}

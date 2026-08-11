import React, { useState } from 'react';
import { 
  Flame, 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Eye, 
  Share2, 
  Tag as TagIcon,
  Sparkles,
  Layers,
  Check,
  TrendingUp,
  MapPin,
  Calendar
} from 'lucide-react';
import { Article, NewsCategory } from '../types';
import { Breadcrumbs } from './Breadcrumbs';
import { SeoHead } from './SeoHead';
import { Sidebar } from './Sidebar';
import { ArticleCard } from './ArticleCard';
import { AppLanguage } from '../utils/i18n';

interface CategoryPageProps {
  category: NewsCategory;
  articles: Article[];
  onSelectArticle: (article: Article) => void;
  onSelectCategory: (cat: NewsCategory) => void;
  language?: AppLanguage;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({
  category,
  articles,
  onSelectArticle,
  onSelectCategory,
  language = 'en',
}) => {
  const [activeSubcategory, setActiveSubcategory] = useState<string | 'all'>('all');
  const [localSearch, setLocalSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ARTICLES_PER_PAGE = 6;

  // Format category title & header description
  const getCategoryMeta = (cat: NewsCategory) => {
    switch (cat) {
      case 'home':
        return {
          title: 'Kenya National & Global Media Hub',
          desc: 'Verified breaking stories, elections 2027, 47 counties, financial markets, tech & sports from Nairobi.',
        };
      case 'breaking':
        return {
          title: 'Breaking News & Emergency Bulletins',
          desc: 'Real-time verified urgent national and international alerts as they unfold.',
        };
      case 'latest':
        return {
          title: 'Latest News Stream',
          desc: 'Continuous live coverage updated every hour across all desks.',
        };
      case 'blog':
        return {
          title: 'Official Knews254 Editorial Blog & Columns',
          desc: 'Independent commentaries, analytical blog posts, guest columns, and opinion dispatches from our journalists and community writers.',
        };
      case 'politics':
        return {
          title: 'Politics & Statehouse Desk',
          desc: 'National Assembly, Senate legislation, Cabinet decisions, and political coalition dynamics.',
        };
      case 'elections':
        return {
          title: '2027 General Election Watch',
          desc: 'IEBC register audits, candidate manifestos, polling metrics, and ward updates.',
        };
      case 'business':
        return {
          title: 'Business & Markets Desk',
          desc: 'Central Bank of Kenya rates, Nairobi Securities Exchange, trade, and corporate growth.',
        };
      case 'economy':
        return {
          title: 'Economic Intelligence Unit',
          desc: 'Inflation metrics, public debt analytics, fiscal policy, and East African Community trade.',
        };
      case 'technology':
        return {
          title: 'Silicon Savannah & Technology',
          desc: 'Konza Technopolis, fintech startups, digital infrastructure, and fiber expansion.',
        };
      case 'ai':
        return {
          title: 'Artificial Intelligence & Supercomputing',
          desc: 'Pan-African LLMs, AI governance, machine learning, and automation across Africa.',
        };
      case 'sports':
        return {
          title: 'Sports Headquarters',
          desc: 'Harambee Stars, World Athletics Diamond League, Kenya Sevens, and FKF Premier League.',
        };
      case 'football':
        return {
          title: 'Football & Premier League Desk',
          desc: ' Harambee Stars, Harambee Starlets, FKF Premier League, and CAF tournaments.',
        };
      case 'rugby':
        return {
          title: 'Rugby & Kenya Sevens (Shujaa)',
          desc: 'HSBC World Sevens Series, Kenya Cup, Safari Sevens, and Elgon Cup action.',
        };
      case 'athletics':
        return {
          title: 'Athletics & Marathon Capital',
          desc: 'Eldoret, Iten, and global track & field distance running world record holders.',
        };
      case 'entertainment':
        return {
          title: 'Arts & Entertainment Desk',
          desc: 'Music concerts, film festivals, culture, and East African creative industries.',
        };
      case 'celebrity':
        return {
          title: 'Celebrity News & Pop Culture',
          desc: 'Influencer highlights, music stars, behind-the-scenes interviews, and lifestyle.',
        };
      case 'lifestyle':
        return {
          title: 'Lifestyle, Travel & Dining',
          desc: 'Safari destinations, coastal resorts, fashion, wellness, and culinary arts.',
        };
      case 'health':
        return {
          title: 'Health & Medical Science',
          desc: 'Universal Health Coverage (SHIF), public health drives, medical innovation, and research.',
        };
      case 'education':
        return {
          title: 'Education & CBC Curriculum',
          desc: 'Competency-Based Curriculum, University funding models, STEM, and TVET expansion.',
        };
      case 'agriculture':
        return {
          title: 'Agriculture & Cash Crops',
          desc: 'Tea, coffee, horticulture, maize farming, and smart irrigation across 47 counties.',
        };
      case 'climate':
        return {
          title: 'Climate Action & Green Energy',
          desc: 'Geothermal energy, carbon credits, drought mitigation, and COP climate policies.',
        };
      case 'environment':
        return {
          title: 'Ecology & Wildlife Conservation',
          desc: 'Reforestation, national park conservation, marine reserves, and biodiversity.',
        };
      case 'crime':
        return {
          title: 'Crime & Public Safety',
          desc: 'DCI forensic operations, court proceedings, security briefings, and law enforcement.',
        };
      case 'investigations':
        return {
          title: 'Investigative Journalism Unit',
          desc: 'In-depth forensic exposes, public expenditure audits, and investigative reports.',
        };
      case 'opinion':
        return {
          title: 'Opinion & Guest Columns',
          desc: 'Perspectives from economists, political scientists, legal scholars, and thought leaders.',
        };
      case 'editorials':
        return {
          title: 'Editorial Board Viewpoints',
          desc: 'Official position papers from the Knews254 Editorial Board on national matters.',
        };
      case 'fact-checking':
        return {
          title: 'Knews254 Verify & Fact Check Unit',
          desc: 'Rigorous forensic verification of viral social media claims, speeches, and public data.',
        };
      case 'county':
        return {
          title: '47 Counties Devolution News',
          desc: 'Governor projects, ward development funds, and regional news across Kenya.',
        };
      case 'international':
        return {
          title: 'Global & EAC Regional Affairs',
          desc: 'East African Community, African Union, UN, and international diplomacy.',
        };
      case 'diaspora':
        return {
          title: 'Kenyan Diaspora Desk',
          desc: 'Inflows, diaspora investments, consular services, and global Kenyan achievements.',
        };
      default:
        return {
          title: `${cat.charAt(0).toUpperCase() + cat.slice(1)} News Hub`,
          desc: 'Verified coverage from Knews254 newsroom.',
        };
    }
  };

  const meta = getCategoryMeta(category);

  // Filter articles based on category or subcategory or search
  const filteredArticles = articles.filter((art) => {
    // Category match
    const categoryMatches =
      category === 'home' ||
      category === 'latest' ||
      art.category === category ||
      (art.additionalCategories && art.additionalCategories.includes(category)) ||
      (category === 'breaking' && art.isBreaking) ||
      (category === 'opinion' && art.isOpinion);

    if (!categoryMatches) return false;

    // Subcategory match
    if (activeSubcategory !== 'all' && art.subcategory !== activeSubcategory) {
      return false;
    }

    // Search query match
    if (localSearch.trim()) {
      const q = localSearch.toLowerCase();
      const titleMatch = art.title.toLowerCase().includes(q);
      const summaryMatch = art.summary.toLowerCase().includes(q);
      const tagMatch = art.tags.some((t) => t.toLowerCase().includes(q));
      return titleMatch || summaryMatch || tagMatch;
    }

    return true;
  });

  // Extract all available subcategories for filtering
  const availableSubcategories = Array.from(
    new Set(
      articles
        .filter((a) => category === 'home' || a.category === category)
        .map((a) => a.subcategory)
        .filter(Boolean) as string[]
    )
  );

  // Hero Featured Article for this category
  const featuredHeroArticle = filteredArticles.find((a) => a.isFeatured) || filteredArticles[0];
  const regularArticles = filteredArticles.filter((a) => a.id !== featuredHeroArticle?.id);

  // Pagination logic
  const totalPages = Math.ceil(regularArticles.length / ARTICLES_PER_PAGE) || 1;
  const paginatedArticles = regularArticles.slice(
    (currentPage - 1) * ARTICLES_PER_PAGE,
    currentPage * ARTICLES_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* SEO Metadata & Canonical Tag Generator */}
      <SeoHead category={category} subCategory={activeSubcategory !== 'all' ? activeSubcategory : undefined} />

      {/* Breadcrumb Navigation */}
      <Breadcrumbs
        category={category}
        subcategory={activeSubcategory !== 'all' ? activeSubcategory : undefined}
        onSelectCategory={onSelectCategory}
      />

      {/* Category Hero Banner */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800 py-8 px-4">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-[10px] bg-red-600 text-white font-black px-2.5 py-1 rounded uppercase tracking-widest inline-block mb-2">
                VERIFIED BEAT
              </span>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                {meta.title}
              </h1>
              <p className="text-slate-400 text-sm max-w-2xl mt-1 leading-relaxed">
                {meta.desc}
              </p>
            </div>

            {/* Filter Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={localSearch}
                onChange={(e) => {
                  setLocalSearch(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder={`Search in ${category}...`}
                className="w-full bg-slate-900 text-slate-200 placeholder-slate-500 text-xs rounded-lg pl-9 pr-4 py-2.5 border border-slate-800 focus:outline-none focus:border-red-500 transition"
              />
            </div>
          </div>

          {/* Subcategory Pills */}
          {availableSubcategories.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-2 border-t border-slate-800/80">
              <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1 shrink-0">
                <Filter className="w-3.5 h-3.5" /> Sub-Topics:
              </span>
              <button
                onClick={() => {
                  setActiveSubcategory('all');
                  setCurrentPage(1);
                }}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
                  activeSubcategory === 'all'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                All Topics
              </button>

              {availableSubcategories.map((sub) => (
                <button
                  key={sub}
                  onClick={() => {
                    setActiveSubcategory(sub);
                    setCurrentPage(1);
                  }}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
                    activeSubcategory === sub
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Feed Column (2 cols) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Featured Hero Story for this Category */}
            {featuredHeroArticle && currentPage === 1 && !localSearch && (
              <ArticleCard
                article={featuredHeroArticle}
                variant="hero"
                onSelect={(art) => onSelectArticle(art)}
                language={language}
              />
            )}

            {/* Regular Article Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-black text-sm uppercase tracking-wider text-slate-200 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-red-500" />
                  Stories & Analysis ({filteredArticles.length})
                </h3>
                <span className="text-xs text-slate-500 font-mono">
                  Page {currentPage} of {totalPages}
                </span>
              </div>

              {paginatedArticles.length === 0 && !featuredHeroArticle ? (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
                  <p className="text-slate-400 font-semibold text-sm">
                    No articles found matching your criteria in this section.
                  </p>
                  <button
                    onClick={() => {
                      setActiveSubcategory('all');
                      setLocalSearch('');
                    }}
                    className="bg-red-600 text-white font-bold text-xs px-4 py-2 rounded-lg"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {paginatedArticles.map((art) => (
                    <ArticleCard
                      key={art.id}
                      article={art}
                      variant="standard"
                      onSelect={(article) => onSelectArticle(article)}
                      language={language}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="flex items-center gap-1 bg-slate-800 disabled:opacity-40 text-slate-200 font-bold px-3 py-2 rounded-lg hover:bg-slate-700 transition"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>

                <div className="flex items-center gap-1.5 font-bold">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-8 h-8 rounded-lg text-xs transition ${
                        currentPage === i + 1
                          ? 'bg-red-600 text-white'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="flex items-center gap-1 bg-slate-800 disabled:opacity-40 text-slate-200 font-bold px-3 py-2 rounded-lg hover:bg-slate-700 transition"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Sidebar Column (1 col) */}
          <Sidebar
            articles={articles}
            onSelectArticle={onSelectArticle}
            onSelectCategory={onSelectCategory}
            onSelectTag={(tag) => setLocalSearch(tag)}
          />

        </div>
      </main>
    </div>
  );
};

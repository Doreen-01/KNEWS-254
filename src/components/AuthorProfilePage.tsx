import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, Mail, Globe, MapPin, Award, 
  FileText, ShieldCheck, CheckCircle2,
  Search, ExternalLink, Share2, Layers, Sparkles
} from 'lucide-react';
import { Author, Article, NewsCategory } from '../types';
import { ArticleCard } from './ArticleCard';

interface AuthorProfilePageProps {
  author: Author;
  articles: Article[];
  onSelectArticle: (article: Article) => void;
  onBack: () => void;
  onOpenAiBrief?: (article: Article) => void;
  onSelectCategory?: (cat: NewsCategory) => void;
  language?: string;
}

export const AuthorProfilePage: React.FC<AuthorProfilePageProps> = ({
  author,
  articles,
  onSelectArticle,
  onBack,
  onOpenAiBrief,
  onSelectCategory,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBeat, setSelectedBeat] = useState<string>('all');
  const [copiedToast, setCopiedToast] = useState(false);

  // Filter articles written by this author
  const authorArticles = useMemo(() => {
    return articles.filter((art) => {
      const matchName = art.author?.name?.toLowerCase().trim() === author.name.toLowerCase().trim();
      const matchId = art.author?.id && art.author.id === author.id;
      return matchName || matchId;
    });
  }, [articles, author]);

  // Secondary filter by beat/search
  const filteredArticles = useMemo(() => {
    return authorArticles.filter((art) => {
      const matchesSearch = searchQuery.trim() === '' || 
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.summary.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesBeat = selectedBeat === 'all' || 
        art.category.toLowerCase() === selectedBeat.toLowerCase() ||
        (art.subcategory && art.subcategory.toLowerCase().includes(selectedBeat.toLowerCase()));

      return matchesSearch && matchesBeat;
    });
  }, [authorArticles, searchQuery, selectedBeat]);

  // Extract unique categories available among author's articles
  const availableCategories = useMemo(() => {
    const cats = new Set<string>();
    authorArticles.forEach((art) => {
      if (art.category) cats.add(art.category);
    });
    return Array.from(cats);
  }, [authorArticles]);

  const handleShareProfile = () => {
    const profileUrl = typeof window !== 'undefined'
      ? `${window.location.origin}/author/${encodeURIComponent(author.id || author.name.toLowerCase().replace(/\s+/g, '-'))}`
      : '';
    
    if (navigator.share) {
      navigator.share({
        title: `${author.name} — Author Profile | Knews254`,
        text: `${author.name}, ${author.role} at Knews254 Media Group.`,
        url: profileUrl,
      }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(profileUrl);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-6 sm:py-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Navigation Breadcrumb Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white px-3.5 py-2 rounded-xl border border-slate-800 transition text-xs font-bold cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-red-500" />
              <span>Back to Newsroom</span>
            </button>
            <nav className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400">
              <button 
                onClick={() => onSelectCategory && onSelectCategory('home')}
                className="hover:text-slate-200 transition"
              >
                Home
              </button>
              <span>/</span>
              <button 
                onClick={() => onSelectCategory && onSelectCategory('authors')}
                className="hover:text-slate-200 transition"
              >
                Authors & Staff
              </button>
              <span>/</span>
              <span className="text-red-400 font-bold">{author.name}</span>
            </nav>
          </div>

          <button
            onClick={handleShareProfile}
            className="relative inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white px-3.5 py-2 rounded-xl border border-slate-800 transition text-xs font-mono font-bold cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-sky-400" />
            <span>Share Profile</span>
            {copiedToast && (
              <span className="absolute -bottom-8 right-0 bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1 rounded shadow-lg whitespace-nowrap">
                Link Copied!
              </span>
            )}
          </button>
        </div>

        {/* Hero Author Card */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 rounded-3xl border border-slate-800 p-6 sm:p-8 md:p-10 shadow-2xl space-y-8 relative overflow-hidden">
          {/* Subtle Ambient Red Glow */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
            {/* Author Avatar with Ring */}
            <div className="relative shrink-0 mx-auto md:mx-0">
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border-2 border-red-500/60 p-1 bg-slate-950 shadow-2xl">
                <img
                  src={author.avatar}
                  alt={author.name}
                  className="w-full h-full object-cover rounded-xl"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80";
                  }}
                />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-red-600 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border border-slate-900 shadow flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> VERIFIED
              </div>
            </div>

            {/* Author Details Header */}
            <div className="flex-1 space-y-4 text-center md:text-left">
              <div>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
                  <span className="bg-red-950/80 text-red-400 border border-red-800/80 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1">
                    <Award className="w-3 h-3 text-amber-400" /> Accredited Correspondent
                  </span>
                  <span className="bg-slate-800 text-slate-300 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" /> {author.location || 'Nairobi HQ'}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white font-serif tracking-tight">
                  {author.name}
                </h1>
                <p className="text-sm md:text-base font-bold text-red-400 font-mono mt-1">
                  {author.role}
                </p>
              </div>

              {/* Bio */}
              <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-3xl font-sans">
                {author.bio}
              </p>

              {/* Coverage Areas / Beats */}
              {author.featuredBeats && author.featuredBeats.length > 0 && (
                <div className="space-y-2 pt-1">
                  <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-widest block">
                    Beat & Focus Areas:
                  </span>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                    {author.featuredBeats.map((beat) => (
                      <span
                        key={beat}
                        className="bg-slate-950 text-slate-200 border border-slate-800 hover:border-red-500/50 text-xs font-mono px-3 py-1 rounded-lg capitalize transition"
                      >
                        #{beat}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact & Professional Profiles */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-3 border-t border-slate-800/80">
                {author.email && (
                  <a
                    href={`mailto:${author.email}`}
                    className="inline-flex items-center gap-2 bg-slate-950 hover:bg-slate-800 text-slate-200 text-xs font-mono font-bold px-3.5 py-2 rounded-xl border border-slate-800 transition"
                  >
                    <Mail className="w-3.5 h-3.5 text-red-400" />
                    <span>{author.email}</span>
                  </a>
                )}

                {author.twitter && (
                  <a
                    href={`https://x.com/${author.twitter.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-slate-950 hover:bg-slate-800 text-slate-200 text-xs font-mono font-bold px-3.5 py-2 rounded-xl border border-slate-800 transition"
                  >
                    <svg className="w-3.5 h-3.5 fill-sky-400" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    <span>{author.twitter}</span>
                  </a>
                )}

                {author.website && (
                  <a
                    href={author.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-sky-950/60 hover:bg-sky-900/80 text-sky-300 text-xs font-mono font-bold px-3.5 py-2 rounded-xl border border-sky-800/80 transition"
                  >
                    <Globe className="w-3.5 h-3.5 text-sky-400" />
                    <span>Official Portfolio</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Metrics & Accreditation Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-800/80 text-center sm:text-left">
            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                Published Dispatches
              </span>
              <span className="text-xl sm:text-2xl font-black text-white font-mono mt-1 block">
                {Math.max(author.articlesCount || 0, authorArticles.length)}
              </span>
            </div>

            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                Primary Desk
              </span>
              <span className="text-xs sm:text-sm font-bold text-red-400 mt-1 block capitalize truncate">
                {author.featuredBeats?.[0] || 'National Desk'}
              </span>
            </div>

            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                Verification Score
              </span>
              <span className="text-xs sm:text-sm font-bold text-emerald-400 mt-1 flex items-center gap-1 justify-center sm:justify-start">
                <CheckCircle2 className="w-3.5 h-3.5" /> 100% Audit Passed
              </span>
            </div>

            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                Press Clearance
              </span>
              <span className="text-xs sm:text-sm font-bold text-amber-400 mt-1 flex items-center gap-1 justify-center sm:justify-start">
                <ShieldCheck className="w-3.5 h-3.5" /> Media Council Reg.
              </span>
            </div>
          </div>
        </div>

        {/* Publication History Header & Filters */}
        <div className="space-y-6 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white font-serif flex items-center gap-2">
                <FileText className="w-5 h-5 text-red-500" />
                Publication History & Dispatches
              </h2>
              <p className="text-xs text-slate-400 font-mono mt-1">
                Showing {filteredArticles.length} of {authorArticles.length} dispatches reported by {author.name}
              </p>
            </div>

            {/* Search within Author's Articles */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search author's dispatches..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition font-mono"
              />
            </div>
          </div>

          {/* Category Filter Chips for Author's Articles */}
          {availableCategories.length > 1 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-slate-500" /> Category:
              </span>
              <button
                onClick={() => setSelectedBeat('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                  selectedBeat === 'all'
                    ? 'bg-red-600 text-white'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                All ({authorArticles.length})
              </button>
              {availableCategories.map((cat) => {
                const count = authorArticles.filter(a => a.category === cat).length;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedBeat(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold capitalize transition cursor-pointer ${
                      selectedBeat === cat
                        ? 'bg-red-600 text-white'
                        : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                    }`}
                  >
                    {cat} ({count})
                  </button>
                );
              })}
            </div>
          )}

          {/* Articles Grid */}
          {filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  variant="standard"
                  onSelect={(art) => onSelectArticle(art)}
                  onOpenAiBrief={onOpenAiBrief}
                />
              ))}
            </div>
          ) : (
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-12 text-center space-y-4 max-w-xl mx-auto my-8">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-200">No matching dispatches found</h3>
              <p className="text-xs text-slate-400 font-mono">
                {searchQuery || selectedBeat !== 'all' 
                  ? "Try clearing your search query or selecting a different category filter."
                  : `${author.name} currently has no public articles assigned in this view.`}
              </p>
              {(searchQuery || selectedBeat !== 'all') && (
                <button
                  onClick={() => { setSearchQuery(''); setSelectedBeat('all'); }}
                  className="bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

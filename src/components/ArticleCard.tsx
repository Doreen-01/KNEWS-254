import React, { useState } from 'react';
import { 
  Flame, 
  Sparkles, 
  Clock, 
  Eye, 
  Share2, 
  Bookmark, 
  BookmarkCheck, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  Check, 
  ArrowUpRight, 
  ArrowRight,
  Play, 
  MessageSquare,
  ThumbsUp,
  Award,
  FileText
} from 'lucide-react';
import { Article } from '../types';
import { getTranslation, AppLanguage } from '../utils/i18n';

const DEFAULT_NEWS_IMAGE = 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80';
const DEFAULT_AVATAR_IMAGE = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';

interface ArticleCardProps {
  article: Article;
  variant?: 'hero' | 'standard' | 'horizontal' | 'minimal' | 'compact';
  onSelect: (article: Article) => void;
  onOpenAiBrief?: (article: Article) => void;
  onSelectCategory?: (category: any) => void;
  onSelectAuthor?: (authorIdOrName: string) => void;
  language?: AppLanguage;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  variant = 'standard',
  onSelect,
  onOpenAiBrief,
  onSelectCategory,
  onSelectAuthor,
  language = 'en',
}) => {
  const t = getTranslation((language || 'en') as AppLanguage);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [likesCount, setLikesCount] = useState(Math.floor(article.viewCount / 12));
  const [hasLiked, setHasLiked] = useState(false);
  const [showCopiedToast, setShowCopiedToast] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleBookmarkToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
  };

  const handleLikeToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasLiked) {
      setLikesCount(likesCount - 1);
      setHasLiked(false);
    } else {
      setLikesCount(likesCount + 1);
      setHasLiked(true);
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = typeof window !== 'undefined'
      ? `${window.location.origin}/article/${encodeURIComponent(article.slug || article.id)}`
      : '';
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.summary,
        url: shareUrl,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl);
      setShowCopiedToast(true);
      setTimeout(() => setShowCopiedToast(false), 2000);
    }
  };

  const handleAudioToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlayingAudio(!isPlayingAudio);
  };

  /* -------------------------------------------------------------------------- */
  /* VARIANT 1: HERO LEAD ARTICLE CARD                                         */
  /* -------------------------------------------------------------------------- */
  if (variant === 'hero') {
    const articleLink = `/article/${encodeURIComponent(article.slug || article.id)}`;
    
    // Single editorial status badge determination
    const getEditorialStatus = () => {
      if (article.isBreaking) return { label: 'BREAKING NEWS', bg: 'bg-red-600 text-white font-black animate-pulse' };
      if (article.category === 'investigations') return { label: 'INVESTIGATION', bg: 'bg-purple-950 text-purple-300 border border-purple-800' };
      if (article.category === 'opinion') return { label: 'OPINION', bg: 'bg-amber-950 text-amber-300 border border-amber-800' };
      if (article.category === 'analysis') return { label: 'ANALYSIS', bg: 'bg-blue-950 text-blue-300 border border-blue-800' };
      return { label: 'LATEST NEWS', bg: 'bg-slate-900 text-slate-200 border border-slate-700' };
    };

    const statusBadge = getEditorialStatus();

    return (
      <article className="bg-slate-900 rounded-3xl border border-slate-800/90 overflow-hidden shadow-2xl transition-all duration-500 flex flex-col justify-between">
        {/* Top Reliable Image Stage with Fixed Aspect Ratio (0 CLS) */}
        <div className="relative aspect-[16/9] md:aspect-[21/9] bg-slate-950 overflow-hidden group">
          {/* Skeleton placeholder while image loads */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-slate-800 animate-pulse flex items-center justify-center">
              <span className="text-xs font-mono text-slate-500">Loading High-Res Dispatch Media...</span>
            </div>
          )}

          <a
            href={articleLink}
            onClick={(e) => { e.preventDefault(); onSelect(article); }}
            className="block w-full h-full cursor-pointer"
          >
            <img 
              src={article.imageUrl || DEFAULT_NEWS_IMAGE} 
              alt={article.title}
              onLoad={() => setImageLoaded(true)}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = DEFAULT_NEWS_IMAGE;
                setImageLoaded(true);
              }}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-700 ease-out filter brightness-[0.92]" 
              loading="eager"
            />
          </a>

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent pointer-events-none" />

          {/* Badges Overlay */}
          <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2 z-10">
            <span className={`text-[10px] font-mono px-3 py-1 rounded-full uppercase tracking-wider shadow-md flex items-center gap-1.5 ${statusBadge.bg}`}>
              {article.isBreaking && <Flame className="w-3.5 h-3.5" />}
              {statusBadge.label}
            </span>

            <span className="bg-slate-950/90 backdrop-blur text-slate-200 text-[10px] font-mono font-bold px-3 py-1 rounded-full border border-slate-700/80 uppercase shadow-md">
              {article.category}
            </span>

            <a
              href="/?cat=factcheck-methodology"
              onClick={(e) => {
                e.preventDefault();
                if (onSelectCategory) onSelectCategory('factcheck-methodology');
              }}
              className="bg-emerald-950/90 hover:bg-emerald-900 text-emerald-300 text-[10px] font-mono font-bold px-3 py-1 rounded-full border border-emerald-800/80 flex items-center gap-1 shadow-md transition"
              title="Click to view Knews254 verification standard"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>VERIFIED DISPATCH</span>
            </a>
          </div>

          {/* Image Credit & Caption Overlay */}
          <div className="absolute bottom-3 left-4 right-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-slate-300/90 font-mono bg-slate-950/80 backdrop-blur px-3 py-1.5 rounded-xl border border-slate-800/80 z-10 pointer-events-none">
            <p className="truncate max-w-xl text-slate-200 font-sans">
              <strong className="font-bold text-slate-100">Caption:</strong> {article.imageCaption || 'Senator Edwin Sifuna addressing supporters during Kakamega mobilisation tour.'}
            </p>
            <span className="text-[10px] text-slate-400 shrink-0 font-mono">
              Photo: Knews254 Bureau • On-Ground Dispatch
            </span>
          </div>

          {/* Audio Player Strip inside Hero image if active */}
          {isPlayingAudio && (
            <div className="absolute top-16 left-4 right-4 bg-slate-900/95 border border-emerald-500/60 backdrop-blur rounded-2xl p-3 flex items-center justify-between text-xs font-mono text-emerald-400 animate-fadeIn z-20 shadow-2xl">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="font-bold text-white">Audio Dispatch Reader Active</span>
                <span className="text-slate-400 text-[11px]">({article.readTime || '4 min'})</span>
              </div>
              <button 
                onClick={handleAudioToggle} 
                className="bg-emerald-950 border border-emerald-800 text-emerald-300 hover:text-white px-3 py-1 rounded-lg font-bold text-xs cursor-pointer"
              >
                PAUSE AUDIO
              </button>
            </div>
          )}
        </div>

        {/* Hero Content Body */}
        <div className="p-6 md:p-8 space-y-5">
          {/* Main Headline */}
          <div>
            <a 
              href={articleLink}
              onClick={(e) => { e.preventDefault(); onSelect(article); }}
              className="block group"
            >
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight tracking-tight font-serif group-hover:text-red-400 transition-colors">
                {article.title}
              </h1>
            </a>
          </div>

          {/* One-Sentence Factual Summary */}
          <p className="text-slate-300 text-sm md:text-base leading-relaxed font-sans font-normal">
            {article.summary}
          </p>

          {/* Author, Desk & Credibility Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-800/80">
            <a
              href={`/author/${encodeURIComponent(article.author.id || article.author.name.toLowerCase().replace(/\s+/g, '-'))}`}
              onClick={(e) => { 
                e.preventDefault(); 
                if (onSelectAuthor) {
                  onSelectAuthor(article.author.id || article.author.name);
                } else if (onSelectCategory) {
                  onSelectCategory('authors');
                }
              }}
              className="flex items-center gap-3 group/author cursor-pointer"
            >
              <img 
                src={article.author.avatar || DEFAULT_AVATAR_IMAGE} 
                alt={article.author.name} 
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = DEFAULT_AVATAR_IMAGE;
                }}
                className="w-10 h-10 rounded-full object-cover border-2 border-red-500/40 shadow group-hover/author:border-red-400 transition"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <strong className="text-slate-100 font-bold text-xs group-hover/author:text-red-400 transition">{article.author.name}</strong>
                  <Award className="w-3.5 h-3.5 text-blue-400" title="Senior Accredited Journalist" />
                </div>
                <span className="text-[11px] text-slate-400 font-mono">{article.author.role || 'Chairman & Super Administrator'} • Politics & National Desk</span>
              </div>
            </a>

            {/* Timestamps & Timezone */}
            <div className="text-right text-slate-400 font-mono text-[11px] space-y-0.5">
              <div className="flex items-center justify-end gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>Published <time dateTime="2026-08-11T10:30:00+03:00">11 Aug 2026, 10:30 EAT</time></span>
              </div>
              <div className="text-[10px] text-slate-500">
                Updated <time dateTime="2026-08-11T11:05:00+03:00">11 Aug 2026, 11:05 EAT</time>
              </div>
            </div>
          </div>

          {/* Source & Verification Explanatory Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-400 font-mono pt-2 border-t border-slate-800/50 bg-slate-950/60 p-3 rounded-2xl">
            <div className="flex items-center gap-2">
              <span className="text-slate-300 font-bold">Sources:</span>
              <span className="text-slate-400">On-Ground Newsroom Correspondents & Verified Statements</span>
            </div>

            <a
              href="/?cat=factcheck-methodology"
              onClick={(e) => {
                e.preventDefault();
                if (onSelectCategory) onSelectCategory('factcheck-methodology');
              }}
              className="text-emerald-400 hover:text-emerald-300 hover:underline flex items-center gap-1 font-bold cursor-pointer transition"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>How we verify this story</span>
            </a>
          </div>

          {/* Proper Article Actions Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Primary Action: Read Article */}
              <a
                href={articleLink}
                onClick={(e) => { e.preventDefault(); onSelect(article); }}
                className="bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-lg transition hover:scale-105 cursor-pointer font-sans uppercase tracking-wider"
              >
                <span>Read Full Story</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              {/* Listen Button */}
              <button
                onClick={handleAudioToggle}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 transition cursor-pointer border border-slate-700/80 font-mono"
                aria-label="Listen to audio version"
              >
                <Volume2 className="w-4 h-4 text-red-400" />
                <span>{isPlayingAudio ? 'Pause' : 'Listen'}</span>
              </button>

              {/* Subordinate 30-Sec AI Brief */}
              {onOpenAiBrief && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenAiBrief(article);
                  }}
                  className="bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold px-3.5 py-2.5 rounded-xl border border-slate-700/80 transition flex items-center gap-1.5 cursor-pointer font-mono"
                  aria-label="Generate 30 second AI summary"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>30-Sec AI Brief</span>
                </button>
              )}
            </div>

            {/* Utility Actions: Save & Share */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleBookmarkToggle}
                className="p-2.5 bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl border border-slate-700/80 transition cursor-pointer"
                aria-label={isBookmarked ? "Story saved" : "Save story"}
                title={isBookmarked ? "Saved" : "Save story"}
              >
                {isBookmarked ? <BookmarkCheck className="w-4 h-4 text-emerald-400" /> : <Bookmark className="w-4 h-4" />}
              </button>

              <button
                onClick={handleShare}
                className="p-2.5 bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl border border-slate-700/80 transition cursor-pointer relative"
                aria-label="Share story URL"
                title="Share story"
              >
                <Share2 className="w-4 h-4" />
                {showCopiedToast && (
                  <span className="absolute -top-8 right-0 bg-emerald-600 text-white font-sans text-[9px] font-bold px-2 py-1 rounded shadow-lg whitespace-nowrap">
                    Link Copied!
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </article>
    );
  }

  /* -------------------------------------------------------------------------- */
  /* VARIANT 2: HORIZONTAL ROW CARD (Ideal for Sidebars / Secondary Streams)    */
  /* -------------------------------------------------------------------------- */
  if (variant === 'horizontal') {
    return (
      <div 
        onClick={() => onSelect(article)}
        className="p-3.5 bg-slate-900 hover:bg-slate-850 rounded-2xl border border-slate-800/80 transition-all duration-300 cursor-pointer group flex gap-3.5 items-center hover:border-red-500/40 hover:shadow-lg relative"
      >
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-slate-950 overflow-hidden shrink-0 relative">
          <img 
            src={article.imageUrl || DEFAULT_NEWS_IMAGE} 
            alt={article.title} 
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = DEFAULT_NEWS_IMAGE;
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            loading="lazy"
          />
          {article.isBreaking && (
            <span className="absolute top-1 left-1 bg-red-600 text-white font-black text-[8px] px-1.5 py-0.5 rounded uppercase tracking-wider">
              LIVE
            </span>
          )}
        </div>

        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[9px] font-mono font-bold uppercase text-red-400 tracking-wider">
              {article.category}
            </span>
            <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
              <Clock className="w-3 h-3" /> {article.readTime}
            </span>
          </div>

          <h3 className="text-xs sm:text-sm font-bold text-slate-100 group-hover:text-red-400 transition line-clamp-2 leading-snug font-serif">
            {article.title}
          </h3>

          <p className="text-[11px] text-slate-400 line-clamp-1 leading-normal">
            {article.summary}
          </p>

          <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500 font-mono">
            <a
              href={`/author/${encodeURIComponent(article.author.id || article.author.name.toLowerCase().replace(/\s+/g, '-'))}`}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                if (onSelectAuthor) {
                  onSelectAuthor(article.author.id || article.author.name);
                } else if (onSelectCategory) {
                  onSelectCategory('authors');
                }
              }}
              className="hover:text-red-400 transition cursor-pointer font-bold"
            >
              By {article.author.name}
            </a>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleBookmarkToggle} 
                className="hover:text-white transition"
              >
                {isBookmarked ? <BookmarkCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Bookmark className="w-3.5 h-3.5" />}
              </button>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition text-slate-400 group-hover:text-red-400" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------------------- */
  /* VARIANT 3: MINIMAL TEXT-ONLY CARD (Ideal for High-Density Trending Lists)  */
  /* -------------------------------------------------------------------------- */
  if (variant === 'minimal') {
    return (
      <div 
        onClick={() => onSelect(article)}
        className="py-3 border-b border-slate-800/80 hover:border-red-500/40 transition cursor-pointer group space-y-1"
      >
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
          <span className="text-red-400 uppercase font-bold">{article.category}</span>
          <span>{article.readTime}</span>
        </div>
        <h4 className="text-xs font-bold text-slate-200 group-hover:text-red-400 transition leading-snug">
          {article.title}
        </h4>
      </div>
    );
  }

  /* -------------------------------------------------------------------------- */
  /* VARIANT 4: STANDARD CARD (Default Grid Layout Card)                        */
  /* -------------------------------------------------------------------------- */
  return (
    <div 
      onClick={() => onSelect(article)}
      className="group bg-slate-900 rounded-2xl border border-slate-800/80 overflow-hidden shadow-xl hover:border-red-500/40 hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Aspect Ratio Image Container */}
        <div className="relative aspect-[16/10] bg-slate-950 overflow-hidden">
          <img 
            src={article.imageUrl || DEFAULT_NEWS_IMAGE} 
            alt={article.title} 
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = DEFAULT_NEWS_IMAGE;
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500 filter brightness-95"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

          <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
            {article.isBreaking && (
              <span className="bg-red-600 text-white font-black text-[9px] px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1 shadow">
                <Flame className="w-2.5 h-2.5" /> LIVE
              </span>
            )}
            <span className="bg-slate-950/80 backdrop-blur text-slate-200 text-[9px] font-mono font-bold px-2 py-0.5 rounded border border-slate-800 uppercase">
              {article.category}
            </span>
          </div>

          <div className="absolute top-3 right-3 flex items-center gap-1 z-10">
            {onOpenAiBrief && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenAiBrief(article);
                }}
                className="bg-slate-950/80 hover:bg-red-600 text-slate-200 hover:text-white p-1.5 rounded-full border border-slate-700/80 backdrop-blur transition shadow"
                title="Generate 30-Sec AI Brief"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              </button>
            )}
            <button
              onClick={handleBookmarkToggle}
              className="bg-slate-950/80 hover:bg-slate-900 text-slate-300 hover:text-white p-1.5 rounded-full border border-slate-700/80 backdrop-blur transition shadow"
              title={isBookmarked ? "Saved" : "Save article"}
            >
              {isBookmarked ? <BookmarkCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Bookmark className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Card Content Body */}
        <div className="p-4 space-y-2">
          <h3 className="text-sm md:text-base font-bold text-slate-100 group-hover:text-red-400 transition line-clamp-2 leading-snug font-serif">
            {article.title}
          </h3>
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {article.summary}
          </p>
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-4 pb-4 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <a
          href={`/author/${encodeURIComponent(article.author.id || article.author.name.toLowerCase().replace(/\s+/g, '-'))}`}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            if (onSelectAuthor) {
              onSelectAuthor(article.author.id || article.author.name);
            } else if (onSelectCategory) {
              onSelectCategory('authors');
            }
          }}
          className="flex items-center gap-2 group/author cursor-pointer hover:opacity-80 transition"
        >
          <img 
            src={article.author.avatar || DEFAULT_AVATAR_IMAGE} 
            alt={article.author.name} 
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = DEFAULT_AVATAR_IMAGE;
            }}
            className="w-5 h-5 rounded-full object-cover border border-slate-700 group-hover/author:border-red-500 transition"
          />
          <span className="truncate max-w-[110px] text-slate-300 font-bold group-hover/author:text-red-400 transition">{article.author.name}</span>
        </a>

        <div className="flex items-center gap-2 text-slate-500">
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {article.readTime}</span>
          <button onClick={handleShare} className="hover:text-slate-200 transition" title="Share">
            <Share2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

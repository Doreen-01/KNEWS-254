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
  Play, 
  MessageSquare,
  ThumbsUp,
  Award
} from 'lucide-react';
import { Article } from '../types';

interface ArticleCardProps {
  article: Article;
  variant?: 'hero' | 'standard' | 'horizontal' | 'minimal' | 'compact';
  onSelect: (article: Article) => void;
  onOpenAiBrief?: (article: Article) => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  variant = 'standard',
  onSelect,
  onOpenAiBrief,
}) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [likesCount, setLikesCount] = useState(Math.floor(article.viewCount / 12));
  const [hasLiked, setHasLiked] = useState(false);
  const [showCopiedToast, setShowCopiedToast] = useState(false);

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
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.summary,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
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
    return (
      <div 
        onClick={() => onSelect(article)}
        className="group relative bg-slate-900 rounded-3xl border border-slate-800/90 overflow-hidden shadow-2xl hover:border-red-500/50 transition-all duration-500 cursor-pointer flex flex-col justify-between"
      >
        {/* Top Image Stage with 0-CLS Aspect Ratio */}
        <div className="relative aspect-[16/9] md:aspect-[21/9] bg-slate-950 overflow-hidden">
          <img 
            src={article.imageUrl} 
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-700 ease-out filter brightness-[0.92]" 
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* Badges Overlay */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
            {article.isBreaking && (
              <span className="bg-red-600 text-white font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1.5 shadow-lg animate-pulse">
                <Flame className="w-3.5 h-3.5" /> BREAKING NEWS
              </span>
            )}
            <span className="bg-slate-950/90 backdrop-blur text-slate-200 text-[10px] font-mono font-bold px-3 py-1 rounded-full border border-slate-700/80 uppercase shadow-md">
              {article.category}
            </span>
            <span className="bg-emerald-950/90 text-emerald-300 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border border-emerald-800/80 flex items-center gap-1 shadow-md">
              <ShieldCheck className="w-3 h-3 text-emerald-400" /> VERIFIED
            </span>
          </div>

          {/* Top Right Quick Actions */}
          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
            {onOpenAiBrief && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenAiBrief(article);
                }}
                className="bg-slate-950/80 hover:bg-red-600 text-slate-200 hover:text-white text-xs font-bold px-3.5 py-1.5 rounded-full border border-slate-700/80 backdrop-blur transition flex items-center gap-1.5 shadow-lg"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                30-Sec AI Brief
              </button>
            )}
            <button
              onClick={handleBookmarkToggle}
              className="p-2 bg-slate-950/80 hover:bg-slate-900 text-slate-300 hover:text-white rounded-full border border-slate-700/80 backdrop-blur transition shadow-lg"
              title={isBookmarked ? "Saved" : "Save for later"}
            >
              {isBookmarked ? <BookmarkCheck className="w-4 h-4 text-emerald-400" /> : <Bookmark className="w-4 h-4" />}
            </button>
          </div>

          {/* Audio Player Strip inside Hero image if active */}
          {isPlayingAudio && (
            <div className="absolute bottom-3 left-4 right-4 bg-slate-900/90 border border-slate-700 backdrop-blur rounded-xl p-2.5 flex items-center justify-between text-xs font-mono text-emerald-400 animate-fadeIn z-10">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>Audio News AI Reader Active...</span>
              </div>
              <button onClick={handleAudioToggle} className="text-slate-400 hover:text-white font-bold">PAUSE</button>
            </div>
          )}
        </div>

        {/* Hero Content Body */}
        <div className="p-6 md:p-8 space-y-4">
          <h1 className="text-2xl md:text-4xl font-black text-white leading-tight tracking-tight group-hover:text-red-400 transition font-serif">
            {article.title}
          </h1>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed line-clamp-3">
            {article.summary}
          </p>

          {/* Author Credibility Bar & Interactive Micro-Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800 text-xs text-slate-400">
            <div className="flex items-center gap-3">
              <img 
                src={article.author.avatar} 
                alt={article.author.name} 
                className="w-9 h-9 rounded-full object-cover border-2 border-red-500/40 shadow"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <strong className="text-slate-100 font-bold text-xs">{article.author.name}</strong>
                  <Award className="w-3.5 h-3.5 text-blue-400" title="Senior Verified Journalist" />
                </div>
                <span className="text-[10px] text-slate-400 font-mono">{article.author.role} • Nairobi Newsroom</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-500" /> {article.readTime}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5 text-slate-500" /> {(article.viewCount / 1000).toFixed(1)}k</span>
              <span>•</span>

              <button 
                onClick={handleAudioToggle} 
                className="hover:text-white transition flex items-center gap-1 text-red-400 font-bold"
                title="Listen to audio briefing"
              >
                <Volume2 className="w-3.5 h-3.5" /> Listen
              </button>

              <button 
                onClick={handleLikeToggle} 
                className={`hover:text-white transition flex items-center gap-1 ${hasLiked ? 'text-emerald-400 font-bold' : ''}`}
              >
                <ThumbsUp className="w-3.5 h-3.5" /> {likesCount}
              </button>

              <button 
                onClick={handleShare} 
                className="hover:text-white transition flex items-center gap-1 relative"
                title="Share article"
              >
                <Share2 className="w-3.5 h-3.5" />
                {showCopiedToast && (
                  <span className="absolute -top-7 right-0 bg-emerald-600 text-white font-sans text-[9px] font-bold px-2 py-0.5 rounded shadow">
                    Link Copied!
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
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
            src={article.imageUrl} 
            alt={article.title} 
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
            <span>By {article.author.name}</span>
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
            src={article.imageUrl} 
            alt={article.title} 
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
        <div className="flex items-center gap-2">
          <img 
            src={article.author.avatar} 
            alt={article.author.name} 
            className="w-5 h-5 rounded-full object-cover border border-slate-700"
          />
          <span className="truncate max-w-[110px] text-slate-300 font-bold">{article.author.name}</span>
        </div>

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

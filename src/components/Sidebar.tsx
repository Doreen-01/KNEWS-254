import React, { useState } from 'react';
import { 
  TrendingUp, 
  Mail, 
  ShieldCheck, 
  Building2, 
  Tag, 
  ExternalLink, 
  Flame, 
  CheckCircle,
  Eye
} from 'lucide-react';
import { Article, NewsCategory } from '../types';

interface SidebarProps {
  articles: Article[];
  onSelectArticle: (article: Article) => void;
  onSelectCategory: (cat: NewsCategory) => void;
  onSelectTag?: (tag: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  articles,
  onSelectArticle,
  onSelectCategory,
  onSelectTag,
}) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const trendingArticles = articles
    .filter((a) => a.isTrending || a.viewCount > 20000)
    .slice(0, 5);

  const popularTags = Array.from(
    new Set(articles.flatMap((a) => a.tags || []))
  ).slice(0, 10);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSubscribed(true);
      setTimeout(() => {
        setNewsletterEmail('');
        setNewsletterSubscribed(false);
      }, 5000);
    }
  };

  return (
    <aside className="space-y-6">
      {/* Trending Stories Ranking Widget */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-red-500" />
            <h3 className="font-black text-slate-100 uppercase tracking-wider text-sm">
              Trending Headlines
            </h3>
          </div>
          <span className="text-[10px] bg-red-950 text-red-400 font-bold px-2 py-0.5 rounded border border-red-800">
            LIVE 24H
          </span>
        </div>

        <div className="space-y-4">
          {trendingArticles.map((art, idx) => (
            <div
              key={art.id}
              onClick={() => onSelectArticle(art)}
              className="group flex items-start gap-3 cursor-pointer p-2 rounded-lg hover:bg-slate-800/60 transition"
            >
              <span className="font-black text-2xl text-slate-700 group-hover:text-red-500 transition w-6 text-right shrink-0">
                0{idx + 1}
              </span>
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase text-red-400 tracking-wider">
                  {art.category}
                </span>
                <h4 className="font-bold text-xs text-slate-200 group-hover:text-white line-clamp-2 leading-snug">
                  {art.title}
                </h4>
                <div className="flex items-center gap-3 text-[10px] text-slate-500 font-mono">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {(art.viewCount / 1000).toFixed(1)}k
                  </span>
                  <span>{art.readTime}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Standard Display Advertisement Placement (300x250 Ad Box) */}
      <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 text-center space-y-3 relative overflow-hidden group">
        <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono uppercase tracking-widest border-b border-slate-800/80 pb-2">
          <span>SPONSORED ADVERTISEMENT</span>
          <span className="bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">AD 300x250</span>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-6 rounded-lg border border-slate-800 flex flex-col items-center justify-center space-y-3 relative z-10">
          <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase text-emerald-400 tracking-widest">
              Nairobi International Financial Centre
            </span>
            <h4 className="font-extrabold text-sm text-slate-100 mt-1">
              Invest in Kenya's Green Treasury Bonds
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Guaranteed 14.5% Annual Returns with Tax Exemption Benefits.
            </p>
          </div>
          <button 
            onClick={() => onSelectCategory('advertise')}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 rounded-lg transition shadow-md flex items-center justify-center gap-1.5"
          >
            <span>Learn More & Apply</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Daily Newsletter Subscription Card */}
      <div className="bg-gradient-to-br from-red-950/40 via-slate-900 to-slate-950 border border-red-900/30 rounded-xl p-5 space-y-4 shadow-xl">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center">
            <Mail className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-100">
              The Knews254 Executive Briefing
            </h3>
            <p className="text-[11px] text-slate-400">
              Delivered daily at 6:00 AM EAT. Verified news, markets, politics & 47 county alerts.
            </p>
          </div>
        </div>

        {newsletterSubscribed ? (
          <div className="bg-emerald-950/80 border border-emerald-800 text-emerald-300 p-3 rounded-lg text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Subscribed! Check your inbox to confirm daily alerts.</span>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="space-y-2">
            <input
              type="email"
              required
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Enter your email address..."
              className="w-full bg-slate-950 text-slate-200 placeholder-slate-500 text-xs rounded-lg px-3 py-2.5 border border-slate-800 focus:outline-none focus:border-red-500 transition"
            />
            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-500 text-white font-bold text-xs py-2.5 rounded-lg transition shadow-md"
            >
              Subscribe Free
            </button>
          </form>
        )}
      </div>

      {/* Fact Check Unit Verification Badge */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-amber-500" />
            <h4 className="font-black text-xs text-slate-200 uppercase tracking-wider">
              Knews254 Verify Desk
            </h4>
          </div>
          <span className="text-[10px] text-amber-400 font-bold bg-amber-950 px-1.5 py-0.5 rounded border border-amber-800">
            IFCN CODE COMPLIANT
          </span>
        </div>
        <p className="text-xs text-slate-400">
          Encountered viral claims or fake announcements on WhatsApp or TikTok? Submit claims directly to our investigative fact checkers.
        </p>
        <button
          onClick={() => onSelectCategory('fact-checking')}
          className="w-full bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs py-2 rounded-lg border border-amber-500/20 transition"
        >
          Verify A Claim Now
        </button>
      </div>

      {/* Popular News Tags Cloud */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-1.5 border-b border-slate-800 pb-2">
          <Tag className="w-4 h-4 text-slate-400" />
          <h4 className="font-black text-xs text-slate-200 uppercase tracking-wider">
            Popular Topics
          </h4>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {popularTags.map((tag) => (
            <button
              key={tag}
              onClick={() => onSelectTag && onSelectTag(tag)}
              className="text-[11px] font-medium bg-slate-950 hover:bg-red-950/60 text-slate-300 hover:text-red-400 px-2.5 py-1 rounded-md border border-slate-800 hover:border-red-800 transition"
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};

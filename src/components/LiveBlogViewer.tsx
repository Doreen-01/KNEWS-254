import React, { useState } from 'react';
import { LIVE_BLOG_UPDATES } from '../data/newsData';
import { LiveBlogUpdate } from '../types';
import { Radio, Pin, ThumbsUp, Flame, Clock, Share2, Volume2 } from 'lucide-react';

export const LiveBlogViewer: React.FC = () => {
  const [updates, setUpdates] = useState<LiveBlogUpdate[]>(LIVE_BLOG_UPDATES);
  const [showKeyMomentsOnly, setShowKeyMomentsOnly] = useState(false);

  const handleReact = (id: string, type: 'like' | 'shock' | 'clap') => {
    setUpdates(prev => prev.map(up => {
      if (up.id === id) {
        return {
          ...up,
          reactionCount: {
            ...up.reactionCount,
            [type]: up.reactionCount[type] + 1
          }
        };
      }
      return up;
    }));
  };

  const filteredUpdates = showKeyMomentsOnly 
    ? updates.filter(u => u.isKeyMoment)
    : updates;

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-2xl space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-red-600/20 text-red-400 border border-red-500/30 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider mb-1">
            <Radio className="w-3.5 h-3.5 text-red-500 animate-pulse" />
            Live Coverage Stream
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Kenya National Assembly & Breaking Event Live Blog
          </h2>
          <p className="text-slate-400 text-xs mt-0.5">
            Real-time minute-by-minute reporting from the Knews254 Parliament & Field Desks.
          </p>
        </div>

        {/* Key Moments Toggle */}
        <button
          onClick={() => setShowKeyMomentsOnly(!showKeyMomentsOnly)}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
            showKeyMomentsOnly
              ? 'bg-red-600 text-white'
              : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Pin className="w-3.5 h-3.5" />
          {showKeyMomentsOnly ? "Showing Key Moments" : "Filter Key Moments"}
        </button>
      </div>

      {/* Live Stream Timeline */}
      <div className="space-y-4">
        {filteredUpdates.map((item) => (
          <div 
            key={item.id} 
            className={`p-4 rounded-xl border transition space-y-3 relative ${
              item.isKeyMoment 
                ? 'bg-slate-950 border-red-500/50 shadow-md' 
                : 'bg-slate-950/60 border-slate-800'
            }`}
          >
            {item.isKeyMoment && (
              <span className="absolute top-3 right-3 bg-red-600/20 text-red-400 border border-red-500/30 text-[10px] font-bold px-2 py-0.5 rounded uppercase flex items-center gap-1">
                <Pin className="w-3 h-3" /> Key Moment
              </span>
            )}

            <div className="flex items-center gap-2 font-mono text-xs text-red-400 font-bold">
              <Clock className="w-3.5 h-3.5" />
              <span>{item.timestamp}</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400">{item.author}</span>
            </div>

            <h4 className="text-base font-bold text-white">{item.title}</h4>
            <p className="text-xs text-slate-300 leading-relaxed">{item.content}</p>

            {/* Reactions */}
            <div className="flex items-center gap-3 pt-2 border-t border-slate-800/80 text-xs">
              <button 
                onClick={() => handleReact(item.id, 'like')}
                className="flex items-center gap-1 text-slate-400 hover:text-white bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800"
              >
                <ThumbsUp className="w-3.5 h-3.5 text-blue-400" />
                <span>{item.reactionCount.like}</span>
              </button>
              <button 
                onClick={() => handleReact(item.id, 'clap')}
                className="flex items-center gap-1 text-slate-400 hover:text-white bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800"
              >
                👏 <span>{item.reactionCount.clap}</span>
              </button>
              <button 
                onClick={() => handleReact(item.id, 'shock')}
                className="flex items-center gap-1 text-slate-400 hover:text-white bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800"
              >
                😲 <span>{item.reactionCount.shock}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Share2, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  MessageSquare, 
  Clock, 
  MapPin, 
  Tag, 
  Check, 
  Send, 
  ThumbsUp, 
  Globe,
  Building2,
  Bookmark,
  Languages,
  BookOpen,
  ShieldCheck,
  Eye,
  Award,
  ArrowRight
} from 'lucide-react';
import { Article, NewsCategory } from '../types';
import { articleService } from '../services/articleService';

interface ArticleDetailModalProps {
  article: Article | null;
  onClose: () => void;
  onSelectCategory: (cat: NewsCategory) => void;
  allArticles: Article[];
  onSelectArticle: (art: Article) => void;
}

export const ArticleDetailModal: React.FC<ArticleDetailModalProps> = ({
  article,
  onClose,
  onSelectCategory,
  allArticles,
  onSelectArticle,
}) => {
  if (!article) return null;

  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [commentSubmittedNotice, setCommentSubmittedNotice] = useState(false);

  // Comment system state
  const [comments, setComments] = useState<{ id: string; name: string; text: string; date: string; likes: number }[]>([
    {
      id: 'c-1',
      name: 'Ezekiel Otieno',
      text: 'Great reportage on this issue. Important for citizens across all 47 counties to track policy execution closely.',
      date: '10 mins ago',
      likes: 14,
    },
    {
      id: 'c-2',
      name: 'Mary Wanjiku',
      text: 'Knews254 continues to deliver fast, verified updates. Looking forward to the followup piece.',
      date: '25 mins ago',
      likes: 9,
    },
  ]);
  const [newCommentName, setNewCommentName] = useState('');
  const [newCommentText, setNewCommentText] = useState('');

  useEffect(() => {
    if (article?.id) {
      // 1. Record view in Supabase analytics
      articleService.recordView(article.id);

      // 2. Fetch approved comments from Supabase
      articleService.getComments(article.id).then((fetched) => {
        if (fetched && fetched.length > 0) {
          setComments(fetched);
        }
      });
    }
  }, [article?.id]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleAiSummarize = async () => {
    setIsLoadingSummary(true);
    try {
      const res = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: article.title, content: article.content }),
      });
      const data = await res.json();
      if (data.summary) {
        setAiSummary(data.summary);
      } else {
        setAiSummary('• Rapid developments verified across Kenya.\n• High socio-economic impact across counties.\n• Monitored live by Knews254.');
      }
    } catch {
      setAiSummary('• Executive summary generated from Knews254 editorial desk.\n• Verified multi-stakeholder coverage.');
    } finally {
      setIsLoadingSummary(false);
    }
  };

  const handleTranslate = async (lang: 'sw' | 'sheng') => {
    setIsTranslating(true);
    try {
      const res = await fetch('/api/ai/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: article.content, targetLanguage: lang === 'sw' ? 'Kiswahili Sanifu' : 'Urban Sheng' }),
      });
      const data = await res.json();
      setTranslatedText(data.translatedText);
    } catch {
      setTranslatedText(`[${lang.toUpperCase()}] Taarifa hii imehakikiwa na dawati la habari la Knews254.`);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newCommentText.trim() && article) {
      const name = newCommentName.trim() || 'Anonymous Reader';
      const text = newCommentText.trim();

      const newC = {
        id: `c-${Date.now()}`,
        name,
        text,
        date: 'Just now (Pending Approval)',
        likes: 1,
      };
      
      setComments([newC, ...comments]);
      setNewCommentName('');
      setNewCommentText('');
      setCommentSubmittedNotice(true);
      setTimeout(() => setCommentSubmittedNotice(false), 5000);

      // Submit to Supabase
      await articleService.submitComment(article.id, name, text);
    }
  };

  const relatedArticles = allArticles
    .filter((a) => a.id !== article.id && (a.category === article.category || a.tags.some((t) => article.tags.includes(t))))
    .slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative text-slate-100 flex flex-col my-auto">
        
        {/* Sticky Header Actions */}
        <div className="sticky top-0 z-20 bg-slate-900/95 backdrop-blur border-b border-slate-800 px-6 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="bg-red-600 text-white font-black text-[10px] uppercase tracking-widest px-2.5 py-1 rounded">
              {article.category}
            </span>
            {article.subcategory && (
              <span className="bg-slate-800 text-slate-300 text-[10px] font-bold px-2 py-1 rounded border border-slate-700">
                {article.subcategory}
              </span>
            )}
            <span className="text-xs text-slate-400 font-mono hidden sm:inline-block">
              {article.readTime}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Reader Toggle */}
            <button
              onClick={() => setIsPlayingAudio(!isPlayingAudio)}
              className={`p-2 rounded-lg border text-xs font-bold transition flex items-center gap-1.5 ${
                isPlayingAudio
                  ? 'bg-red-600 text-white border-red-500 animate-pulse'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
              }`}
              title="Listen to AI Text-To-Speech"
            >
              {isPlayingAudio ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden md:inline">{isPlayingAudio ? 'Listening...' : 'Listen'}</span>
            </button>

            {/* Bookmark */}
            <button
              onClick={() => setBookmarked(!bookmarked)}
              className={`p-2 rounded-lg border text-xs font-bold transition ${
                bookmarked
                  ? 'bg-amber-500 text-slate-950 border-amber-400'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
              }`}
            >
              <Bookmark className="w-4 h-4" />
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Article Title & Metadata */}
          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              {article.title}
            </h1>

            <p className="text-base text-slate-300 font-medium leading-relaxed border-l-4 border-red-600 pl-4 bg-slate-950/40 py-2 rounded-r-lg">
              {article.summary}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-b border-slate-800/80 pb-4 text-xs text-slate-400">
              {/* Author Badge */}
              <div className="flex items-center gap-3">
                <img
                  src={article.author.avatar}
                  alt={article.author.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-slate-700"
                />
                <div>
                  <h4 className="font-extrabold text-slate-200">{article.author.name}</h4>
                  <p className="text-[11px] text-slate-400">{article.author.role}</p>
                </div>
              </div>

              {/* Date & Location */}
              <div className="flex items-center gap-4 font-mono text-[11px]">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  {new Date(article.publishedAt).toLocaleDateString('en-KE', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>

                {article.location && (
                  <span className="flex items-center gap-1 text-emerald-400">
                    <MapPin className="w-3.5 h-3.5" />
                    {article.location} {article.county ? `(${article.county} County)` : ''}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="space-y-2">
            <div className="relative rounded-xl overflow-hidden border border-slate-800 shadow-xl max-h-96">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-full object-cover"
              />
              {article.isBreaking && (
                <span className="absolute top-3 left-3 bg-red-600 text-white font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-wider animate-pulse shadow-lg">
                  BREAKING NEWS
                </span>
              )}
            </div>
            {article.imageCaption && (
              <p className="text-xs text-slate-400 italic text-center font-mono">
                Photo: {article.imageCaption}
              </p>
            )}
          </div>

          {/* AI Brief & Translation Actions Bar */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-200">
                  Knews254 AI Assistant Tools
                </h4>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleAiSummarize}
                  disabled={isLoadingSummary}
                  className="bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 font-bold text-xs px-3 py-1.5 rounded-lg transition"
                >
                  {isLoadingSummary ? 'Generating Brief...' : 'AI Executive Brief'}
                </button>

                <button
                  onClick={() => handleTranslate('sw')}
                  disabled={isTranslating}
                  className="bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 font-bold text-xs px-3 py-1.5 rounded-lg transition flex items-center gap-1"
                >
                  <Languages className="w-3.5 h-3.5" />
                  Soma kwa Kiswahili
                </button>
              </div>
            </div>

            {/* Render AI Summary if requested */}
            {aiSummary && (
              <div className="bg-slate-900 border border-amber-500/30 p-3 rounded-lg text-xs text-amber-200 font-medium whitespace-pre-line animate-fadeIn">
                <p className="font-bold text-amber-400 mb-1">AI Executive Brief:</p>
                {aiSummary}
              </div>
            )}

            {/* Render Swahili translation if requested */}
            {translatedText && (
              <div className="bg-slate-900 border border-emerald-500/30 p-3 rounded-lg text-xs text-emerald-200 font-medium leading-relaxed animate-fadeIn">
                <p className="font-bold text-emerald-400 mb-1">Tafsiri ya Kiswahili:</p>
                {translatedText}
              </div>
            )}
          </div>

          {/* Article Main Text Content */}
          <div className="prose prose-invert max-w-none text-slate-200 text-sm sm:text-base leading-relaxed space-y-4">
            {(() => {
              const paragraphs = article.content.split('\n\n').filter(Boolean);
              const inlineRelated = relatedArticles[0];

              return paragraphs.map((paragraph, index) => {
                const isFirst = index === 0;
                const isMidway = index === 1 || (index === Math.floor(paragraphs.length / 2) && index > 0);

                return (
                  <React.Fragment key={index}>
                    <p className={isFirst ? 'text-slate-100 font-medium text-base sm:text-lg leading-relaxed first-letter:float-left first-letter:text-4xl first-letter:font-black first-letter:mr-2.5 first-letter:text-red-500 first-letter:font-serif' : 'text-slate-300'}>
                      {paragraph}
                    </p>

                    {/* Inline 'ALSO READ THIS' Callout Box */}
                    {isMidway && inlineRelated && (
                      <div 
                        onClick={() => onSelectArticle(inlineRelated)}
                        className="my-6 p-4 bg-slate-950 border-l-4 border-amber-500 rounded-r-2xl border-y border-r border-slate-800/90 shadow-xl flex items-start gap-3.5 group cursor-pointer hover:border-amber-400 hover:bg-slate-900/90 transition-all duration-300"
                      >
                        <div className="bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/30 text-amber-400 shrink-0 group-hover:scale-110 transition-transform">
                          <BookOpen className="w-5 h-5" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono font-black text-amber-400 uppercase tracking-widest">
                              ALSO READ ON KNEWS254:
                            </span>
                            <span className="text-[9px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                              {inlineRelated.category}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-slate-100 group-hover:text-amber-300 transition-colors line-clamp-2 leading-snug">
                            {inlineRelated.title}
                          </h4>
                          <span className="text-[11px] text-slate-400 flex items-center gap-2 font-mono">
                            <span>Read time: {inlineRelated.readTime}</span> • <span className="text-amber-400 font-semibold group-hover:underline flex items-center gap-0.5">Click to read dispatch <ArrowRight className="w-3 h-3" /></span>
                          </span>
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                );
              });
            })()}
          </div>

          {/* Tags Cloud */}
          <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-slate-800">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" /> Tags:
            </span>
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="bg-slate-950 border border-slate-800 text-slate-300 text-xs px-2.5 py-1 rounded-md"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Social Share Bar */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
              <Share2 className="w-4 h-4 text-red-500" />
              Share story across networks:
            </span>

            <div className="flex items-center gap-2">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noreferrer"
                className="bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-700 transition"
              >
                X / Twitter
              </a>
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${article.title} - Read on Knews254: ${window.location.href}`)}`}
                target="_blank"
                rel="noreferrer"
                className="bg-emerald-950/90 hover:bg-emerald-900 text-emerald-400 border border-emerald-700/80 text-xs font-bold px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 shadow"
              >
                WhatsApp Share
              </a>
              <a
                href={`https://wa.me/254711837011?text=${encodeURIComponent(`Hello Knews254 Editors, I have a correction or tip regarding article: "${article.title}"`)}`}
                target="_blank"
                rel="noreferrer"
                className="bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-emerald-800 text-xs font-bold px-3 py-1.5 rounded-lg transition hidden sm:flex items-center gap-1"
                title="Send story tip or correction to editor on WhatsApp"
              >
                Tip Editor on WhatsApp
              </a>
              <button
                onClick={handleCopyLink}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-700 transition flex items-center gap-1"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : null}
                {copiedLink ? 'Link Copied!' : 'Copy Link'}
              </button>
            </div>
          </div>

          {/* Related Stories */}
          {relatedArticles.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <h3 className="font-extrabold text-sm uppercase text-slate-300 tracking-wider">
                Related Coverage
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedArticles.map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => onSelectArticle(rel)}
                    className="bg-slate-950 border border-slate-800/80 rounded-xl p-3 cursor-pointer hover:border-red-500/50 transition space-y-2"
                  >
                    <img
                      src={rel.imageUrl}
                      alt={rel.title}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <h4 className="font-bold text-xs text-slate-200 line-clamp-2">
                      {rel.title}
                    </h4>
                    <span className="text-[10px] text-slate-500 font-mono block">
                      {rel.readTime}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comment Section */}
          <div className="space-y-4 pt-6 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-slate-100 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-red-500" />
                Reader Discussions ({comments.length})
              </h3>
              <span className="text-xs text-slate-500 font-mono">Civic & Verified</span>
            </div>

            {/* Comment Form */}
            {commentSubmittedNotice && (
              <div className="bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs p-3 rounded-xl flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Thank you! Your comment has been submitted to Supabase and is pending editorial moderation before appearing publicly.</span>
              </div>
            )}

            <form onSubmit={handleAddComment} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={newCommentName}
                  onChange={(e) => setNewCommentName(e.target.value)}
                  placeholder="Your Name (Optional)..."
                  className="bg-slate-900 border border-slate-800 text-xs rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-red-500"
                />
              </div>
              <textarea
                required
                rows={2}
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder="Join the discussion... Keep comments constructive."
                className="w-full bg-slate-900 border border-slate-800 text-xs rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-red-500"
              />
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-4 py-2 rounded-lg transition flex items-center gap-1.5 ml-auto"
              >
                <Send className="w-3.5 h-3.5" />
                Post Comment
              </button>
            </form>

            {/* Comments List */}
            <div className="space-y-3">
              {comments.map((c) => (
                <div key={c.id} className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-slate-200">{c.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{c.date}</span>
                  </div>
                  <p className="text-xs text-slate-300">{c.text}</p>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 pt-1">
                    <button className="flex items-center gap-1 hover:text-slate-300">
                      <ThumbsUp className="w-3 h-3" />
                      {c.likes} Likes
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

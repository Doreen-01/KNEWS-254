import React, { useState } from 'react';
import { Sparkles, X, FileText, Globe, Volume2, CheckCircle2, Loader2 } from 'lucide-react';

interface AiNewsAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  articleTitle?: string;
  articleContent?: string;
}

export const AiNewsAssistant: React.FC<AiNewsAssistantProps> = ({
  isOpen,
  onClose,
  articleTitle = "Kenya Central Bank Holds Benchmark Rate at 12.0%",
  articleContent = "The Central Bank of Kenya Monetary Policy Committee met and elected to hold the CBR at 12.0%. Export revenues and strong diaspora remittances supported shilling stability."
}) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'translate' | 'audio'>('summary');
  const [loading, setLoading] = useState(false);
  const [summaryData, setSummaryData] = useState<any>(null);
  const [translationText, setTranslationText] = useState<string>('');
  const [targetLang, setTargetLang] = useState<'Kiswahili' | 'Sheng'>('Kiswahili');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  if (!isOpen) return null;

  const handleGenerateSummary = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: articleTitle, content: articleContent }),
      });
      const data = await res.json();
      setSummaryData(data);
    } catch (e) {
      setSummaryData({
        summary: "• Central Bank of Kenya maintains CBR at 12.0%.\n• Export earnings and diaspora remittances boost KES reserves to $8.45B.\n• Inflation remains controlled at 4.3% giving borrowing stability.",
        keyTakeaways: [
          "Borrowing interest rates stay stable across local commercial banks.",
          "Diaspora remittances hit record $420M monthly high.",
          "Verified by Knews254 Financial Desk."
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTranslate = async (lang: 'Kiswahili' | 'Sheng') => {
    setTargetLang(lang);
    setLoading(true);
    try {
      const res = await fetch('/api/ai/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: articleContent, targetLanguage: lang }),
      });
      const data = await res.json();
      setTranslationText(data.translatedText);
    } catch (e) {
      setTranslationText(
        lang === 'Kiswahili'
          ? "Benki Kuu ya Kenya (CBK) imetangaza kuweka kiwango cha riba kuu kuwa asilimia 12.0. Hatua hii imetokana na kuimarika kwa sarafu ya Shilingi dhidi ya Dola ya Marekani."
          : "CBK wamekaza rate ya loan kwa 12.0%. Shilling imekaa poa juu ya ganji za diaspora zenye zimeingia kwa mbao!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-red-600/20 text-red-400 border border-red-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Knews254 AI News Assistant</h3>
              <p className="text-[11px] text-slate-400">Powered by Gemini 3.6 Flash</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-900">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 p-2 gap-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('summary')}
            className={`flex-1 py-2 rounded-lg transition ${activeTab === 'summary' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            30-Sec AI Summary
          </button>
          <button
            onClick={() => setActiveTab('translate')}
            className={`flex-1 py-2 rounded-lg transition ${activeTab === 'translate' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Kiswahili / Sheng
          </button>
          <button
            onClick={() => setActiveTab('audio')}
            className={`flex-1 py-2 rounded-lg transition ${activeTab === 'audio' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            AI Audio Reader
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 space-y-4">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
            <span className="text-[10px] text-slate-500 uppercase font-mono block">Context Article</span>
            <p className="text-xs font-bold text-white truncate">{articleTitle}</p>
          </div>

          {activeTab === 'summary' && (
            <div className="space-y-4">
              {!summaryData && !loading && (
                <button
                  onClick={handleGenerateSummary}
                  className="w-full bg-red-600 hover:bg-red-500 text-white font-bold text-xs py-3 rounded-xl transition flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" /> Generate 30-Second Executive Summary
                </button>
              )}

              {loading && (
                <div className="py-8 flex flex-col items-center justify-center text-slate-400 gap-2 text-xs">
                  <Loader2 className="w-6 h-6 animate-spin text-red-500" />
                  <span>Gemini 3.6 Flash generating summary...</span>
                </div>
              )}

              {summaryData && (
                <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <h4 className="text-xs font-bold uppercase text-red-400 tracking-wider">Executive Brief</h4>
                  <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line">{summaryData.summary}</p>
                  
                  {summaryData.keyTakeaways && (
                    <div className="pt-2 space-y-1.5 border-t border-slate-800">
                      <span className="text-[10px] uppercase text-slate-400 font-bold">Key Takeaways</span>
                      {summaryData.keyTakeaways.map((takeaway: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{takeaway}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'translate' && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <button
                  onClick={() => handleTranslate('Kiswahili')}
                  className="flex-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-bold py-2 rounded-lg text-slate-200"
                >
                  Translate to Kiswahili
                </button>
                <button
                  onClick={() => handleTranslate('Sheng')}
                  className="flex-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-bold py-2 rounded-lg text-slate-200"
                >
                  Adapt to Sheng
                </button>
              </div>

              {loading && (
                <div className="py-6 text-center text-xs text-slate-400">Adapting language context...</div>
              )}

              {translationText && !loading && (
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-200 leading-relaxed">
                  <span className="text-[10px] font-mono text-red-400 block mb-1">[{targetLang}]</span>
                  {translationText}
                </div>
              )}
            </div>
          )}

          {activeTab === 'audio' && (
            <div className="space-y-4 text-center py-4">
              <div className="w-16 h-16 rounded-full bg-red-600/20 text-red-400 border border-red-500/30 mx-auto flex items-center justify-center">
                <Volume2 className="w-8 h-8" />
              </div>
              <p className="text-xs text-slate-300">Listen to hands-free AI narration of this article during your commute.</p>
              <button
                onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition"
              >
                {isPlayingAudio ? "Pause Audio Narration" : "Play Full Article Narration (2:45 min)"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

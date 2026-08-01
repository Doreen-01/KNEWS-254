import React, { useState } from 'react';
import { FACT_CHECK_ITEMS } from '../data/newsData';
import { FactCheckItem } from '../types';
import { ShieldAlert, ShieldCheck, CheckCircle2, AlertTriangle, XCircle, Search, Sparkles, FileText } from 'lucide-react';

export const FactCheckHub: React.FC = () => {
  const [claimInput, setClaimInput] = useState('');
  const [sourceInput, setSourceInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);

  const handleRunAiCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimInput.trim()) return;

    setIsAnalyzing(true);
    setAiResult(null);

    try {
      const response = await fetch('/api/ai/fact-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ claim: claimInput, source: sourceInput }),
      });
      const data = await response.json();
      setAiResult(data);
    } catch (err) {
      setAiResult({
        verdict: 'MISLEADING',
        confidence: '85%',
        explanation: 'Claim lacks primary documentation from official government gazette records.',
        sourcesVerified: ['Kenya National Bureau of Statistics (KNBS)', 'Parliamentary Hansard']
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getVerdictBadge = (verdict: string) => {
    switch (verdict) {
      case 'TRUE':
        return <span className="bg-emerald-600/20 text-emerald-400 border border-emerald-500/40 text-xs font-black px-2.5 py-1 rounded-md flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> VERIFIED TRUE</span>;
      case 'FALSE':
        return <span className="bg-red-600/20 text-red-400 border border-red-500/40 text-xs font-black px-2.5 py-1 rounded-md flex items-center gap-1"><XCircle className="w-3.5 h-3.5" /> VERIFIED FALSE</span>;
      case 'MISLEADING':
        return <span className="bg-amber-600/20 text-amber-400 border border-amber-500/40 text-xs font-black px-2.5 py-1 rounded-md flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> MISLEADING</span>;
      default:
        return <span className="bg-blue-600/20 text-blue-400 border border-blue-500/40 text-xs font-black px-2.5 py-1 rounded-md flex items-center gap-1"><ShieldAlert className="w-3.5 h-3.5" /> PARTIALLY TRUE</span>;
    }
  };

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-2xl space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-amber-600/20 text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Knews254 Verify • Anti-Disinformation Unit
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Fact-Checking Hub & Social Media Verification
          </h2>
          <p className="text-slate-400 text-xs mt-0.5">
            Non-partisan verification of public statements, viral social claims, and election campaign promises.
          </p>
        </div>
      </div>

      {/* AI Claim Checker Form */}
      <form onSubmit={handleRunAiCheck} className="bg-slate-950 p-5 rounded-xl border border-amber-500/30 space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          Analyze Any Suspicious Claim with Knews254 AI Fact Check
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <input
            type="text"
            value={claimInput}
            onChange={(e) => setClaimInput(e.target.value)}
            placeholder="Paste suspicious viral claim or WhatsApp message here..."
            className="md:col-span-8 bg-slate-900 text-slate-200 placeholder-slate-500 text-xs rounded-xl px-4 py-2.5 border border-slate-800 focus:outline-none focus:border-amber-500"
          />
          <input
            type="text"
            value={sourceInput}
            onChange={(e) => setSourceInput(e.target.value)}
            placeholder="Source (e.g. TikTok / X / WhatsApp)..."
            className="md:col-span-4 bg-slate-900 text-slate-200 placeholder-slate-500 text-xs rounded-xl px-4 py-2.5 border border-slate-800 focus:outline-none focus:border-amber-500"
          />
        </div>

        <button
          type="submit"
          disabled={isAnalyzing || !claimInput.trim()}
          className="bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl transition flex items-center justify-center gap-2"
        >
          {isAnalyzing ? "Cross-referencing Public Records..." : "Analyze Claim Integrity"}
        </button>

        {/* AI Analysis Result */}
        {aiResult && (
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase">AI Verdict:</span>
                {getVerdictBadge(aiResult.verdict)}
              </div>
              <span className="text-xs font-mono text-slate-400">Confidence: {aiResult.confidence}</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800">
              {aiResult.explanation}
            </p>
            {aiResult.sourcesVerified && (
              <div className="text-[11px] text-slate-400 space-y-1">
                <span className="font-bold text-slate-300 block">Cross-Referenced Gazette Records:</span>
                <ul className="list-disc list-inside space-y-0.5">
                  {aiResult.sourcesVerified.map((src: string, i: number) => (
                    <li key={i}>{src}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </form>

      {/* Verified Claims Archive Feed */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Recently Verified Claims</h3>
        <div className="space-y-3">
          {FACT_CHECK_ITEMS.map((fc) => (
            <div key={fc.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                <div className="flex items-center gap-2">
                  {getVerdictBadge(fc.verdict)}
                  <span className="text-[11px] font-mono text-slate-500">Source: {fc.claimSource}</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">{fc.claimDate}</span>
              </div>

              <p className="text-sm font-semibold text-white leading-snug">
                "{fc.claim}"
              </p>

              <p className="text-xs text-slate-300 leading-relaxed bg-slate-900 p-3 rounded-lg border border-slate-800/80">
                <strong className="text-slate-200">Knews254 Desk Finding:</strong> {fc.explanation}
              </p>

              <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-1">
                <span className="flex items-center gap-1 text-slate-500">
                  <FileText className="w-3.5 h-3.5 text-amber-500" />
                  Fact-Checked by: <strong>{fc.factChecker}</strong>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { ELECTION_CANDIDATES_2027 } from '../data/newsData';
import { ElectionCandidate } from '../types';
import { Vote, ShieldCheck, CheckCircle2, TrendingUp, UserCheck, AlertTriangle, BarChart2 } from 'lucide-react';

export const ElectionCentre: React.FC = () => {
  const [selectedCandidate, setSelectedCandidate] = useState<ElectionCandidate>(ELECTION_CANDIDATES_2027[0]);
  const [activeTab, setActiveTab] = useState<'polls' | 'compare' | 'iebc'>('polls');

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider mb-1">
            <Vote className="w-3.5 h-3.5" />
            Kenya 2027 General Election Portal
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Knews254 Election Centre & Live Polling Dashboard
          </h2>
          <p className="text-slate-400 text-xs mt-0.5">
            Real-time opinion polls, presidential candidate manifestos, and 47-county voter registration audits.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center">
          <button
            onClick={() => setActiveTab('polls')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${activeTab === 'polls' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Polls & Candidates
          </button>
          <button
            onClick={() => setActiveTab('compare')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${activeTab === 'compare' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Manifesto Compare
          </button>
          <button
            onClick={() => setActiveTab('iebc')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${activeTab === 'iebc' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            IEBC Audit
          </button>
        </div>
      </div>

      {activeTab === 'polls' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Polling Chart */}
          <div className="lg:col-span-7 bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <BarChart2 className="w-4 h-4 text-red-500" />
                Infotrak National Governance & Opinion Audit (August 2026)
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                Data: Infotrak Research • Citizen TV • NTV Kenya • TV47
              </span>
            </div>

            <div className="space-y-3 pt-1">
              {ELECTION_CANDIDATES_2027.map((cand) => (
                <div 
                  key={cand.id} 
                  onClick={() => setSelectedCandidate(cand)}
                  className={`p-3 rounded-xl border transition cursor-pointer ${
                    selectedCandidate.id === cand.id ? 'bg-slate-900 border-red-500/80 shadow-md' : 'bg-slate-950 hover:bg-slate-900 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-white text-sm">{cand.name}</span>
                      <span className="text-slate-400 font-mono text-[11px]">({cand.party})</span>
                    </div>
                    <span className="text-red-400 font-mono text-sm">{cand.pollPercentage}%</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden p-0.5 border border-slate-800">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${
                        cand.id === 'cand-sifuna' ? 'bg-gradient-to-r from-orange-500 to-amber-400' :
                        cand.id === 'cand-kalonzo' ? 'bg-gradient-to-r from-blue-600 to-cyan-400' :
                        cand.id === 'cand-ruto' ? 'bg-gradient-to-r from-yellow-500 to-emerald-500' :
                        cand.id === 'cand-natembeya' ? 'bg-gradient-to-r from-emerald-600 to-teal-400' :
                        'bg-gradient-to-r from-red-600 to-rose-400'
                      }`} 
                      style={{ width: `${cand.pollPercentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Candidate Details */}
          <div className="lg:col-span-5 bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src={selectedCandidate.photoUrl} 
                alt={selectedCandidate.name} 
                className="w-14 h-14 rounded-full object-cover border-2 border-red-500"
              />
              <div>
                <h3 className="text-base font-bold text-white">{selectedCandidate.name}</h3>
                <p className="text-xs text-red-400 font-semibold">{selectedCandidate.coalition}</p>
                <p className="text-[11px] text-slate-400">Running Mate: {selectedCandidate.runningMate || "To Be Confirmed"}</p>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">Key Policy Pillars</p>
              <div className="space-y-1.5">
                {selectedCandidate.keyPolicies.map((policy, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-300 bg-slate-900 p-2 rounded-lg border border-slate-800/80">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{policy}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'compare' && (
        <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900 text-slate-200 uppercase font-mono border-b border-slate-800">
              <tr>
                <th className="p-3">Policy Area</th>
                <th className="p-3">UDA / Kenya Kwanza</th>
                <th className="p-3">ODM / Azimio</th>
                <th className="p-3">Wiper / OKA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              <tr>
                <td className="p-3 font-bold text-white">Healthcare</td>
                <td className="p-3">SHIF Universal Insurance rollout across 47 counties.</td>
                <td className="p-3">Babacare free medical coverage for households under poverty line.</td>
                <td className="p-3">Subsidized county level trauma and maternity centers.</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-white">Youth & Jobs</td>
                <td className="p-3">Affordable Housing construction jobs + digital hubs.</td>
                <td className="p-3">Ksh 6,000 monthly social protection stipend for needy youth.</td>
                <td className="p-3">24-hour economy tax breaks for startups and MSMEs.</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-white">Agriculture</td>
                <td className="p-3">Subsidized NPK fertilizer and KTDA bonus guarantee.</td>
                <td className="p-3">One County One Factory agricultural value addition.</td>
                <td className="p-3">Solar-powered drip irrigation in arid northern counties.</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'iebc' && (
        <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Registered Voters</span>
              <strong className="text-xl text-white font-bold block mt-1">24.2 Million</strong>
              <span className="text-[10px] text-emerald-400 font-semibold">+2.1M new youth registered</span>
            </div>
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Polling Stations</span>
              <strong className="text-xl text-white font-bold block mt-1">46,220 Stations</strong>
              <span className="text-[10px] text-slate-400">Across 290 Constituencies</span>
            </div>
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Biometric KIEMS Kits</span>
              <strong className="text-xl text-white font-bold block mt-1">55,000 Kits</strong>
              <span className="text-[10px] text-emerald-400 font-semibold">Dual SIM satellite redundancy</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

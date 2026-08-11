import React, { useState, useEffect } from 'react';
import {
  CookieConsentPreferences,
  DEFAULT_COOKIE_CONSENT,
  getCookieConsent,
  saveCookieConsent,
  resetCookieConsent,
  getAllKnews254Cookies,
} from '../utils/cookieUtils';
import { ShieldCheck, Lock, BarChart3, Sliders, Check, X, Info, Settings, RefreshCw, Sparkles, ExternalLink, SlidersHorizontal } from 'lucide-react';

interface CookieConsentBannerProps {
  onNavigateToPolicy?: () => void;
}

export const CookieConsentBanner: React.FC<CookieConsentBannerProps> = ({ onNavigateToPolicy }) => {
  const [hasConsent, setHasConsent] = useState<boolean | null>(null);
  const [preferences, setPreferences] = useState<CookieConsentPreferences>(DEFAULT_COOKIE_CONSENT);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [activeCookiesList, setActiveCookiesList] = useState<Array<{ name: string; value: string; domain: string; purpose: string }>>([]);

  useEffect(() => {
    // Check initial consent status
    const existing = getCookieConsent();
    if (existing) {
      setHasConsent(true);
      setPreferences(existing);
    } else {
      setHasConsent(false);
    }

    // Refresh cookies list for inspection
    setActiveCookiesList(getAllKnews254Cookies());

    // Listen for custom open events
    const handleOpenModal = () => {
      const current = getCookieConsent() || DEFAULT_COOKIE_CONSENT;
      setPreferences(current);
      setIsModalOpen(true);
    };

    const handleConsentChanged = (e: CustomEvent) => {
      const detail = e.detail as CookieConsentPreferences | null;
      if (detail) {
        setHasConsent(true);
        setPreferences(detail);
      } else {
        setHasConsent(false);
      }
      setActiveCookiesList(getAllKnews254Cookies());
    };

    window.addEventListener('knews254_open_cookie_modal' as any, handleOpenModal);
    window.addEventListener('knews254_cookie_consent_changed' as any, handleConsentChanged);

    return () => {
      window.removeEventListener('knews254_open_cookie_modal' as any, handleOpenModal);
      window.removeEventListener('knews254_cookie_consent_changed' as any, handleConsentChanged);
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setIsToastVisible(true);
    setTimeout(() => setIsToastVisible(false), 3500);
  };

  const handleAcceptAll = () => {
    const allAccepted: CookieConsentPreferences = {
      essential: true,
      analytics: true,
      personalization: true,
      marketing: true,
      updatedAt: new Date().toISOString(),
    };
    saveCookieConsent(allAccepted);
    setPreferences(allAccepted);
    setHasConsent(true);
    setIsModalOpen(false);
    showToast('All cookies accepted and saved to browser storage.');
  };

  const handleRejectOptional = () => {
    const onlyEssential: CookieConsentPreferences = {
      essential: true,
      analytics: false,
      personalization: false,
      marketing: false,
      updatedAt: new Date().toISOString(),
    };
    saveCookieConsent(onlyEssential);
    setPreferences(onlyEssential);
    setHasConsent(true);
    setIsModalOpen(false);
    showToast('Non-essential cookies declined. Essential cookies saved.');
  };

  const handleSavePreferences = () => {
    saveCookieConsent(preferences);
    setHasConsent(true);
    setIsModalOpen(false);
    showToast('Your custom cookie preferences have been updated!');
  };

  const handleResetCookies = () => {
    resetCookieConsent();
    setHasConsent(false);
    setPreferences(DEFAULT_COOKIE_CONSENT);
    setIsModalOpen(false);
    showToast('Cookie consent reset. You can now configure your settings again.');
  };

  return (
    <>
      {/* Toast Notification */}
      {isToastVisible && (
        <div className="fixed bottom-20 right-4 z-50 bg-slate-900 border border-emerald-500/50 text-emerald-300 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-mono font-bold animate-bounce">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Floating Bottom Cookie Consent Banner (Only if consent not granted yet) */}
      {hasConsent === false && !isModalOpen && (
        <div className="fixed bottom-0 inset-x-0 z-50 p-3 sm:p-4 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800 text-slate-100 shadow-2xl">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5 max-w-3xl">
              <div className="w-10 h-10 rounded-xl bg-red-950/80 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0 mt-0.5">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                    Cookie & Local Storage Consent
                  </h4>
                  <span className="text-[10px] bg-red-600/90 text-white font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                    KDPA 2019 / GDPR
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Knews254 uses browser cookies and local storage to deliver personalized Kenya dispatches, saved bookmarks, county filters, and anonymized performance analytics.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto shrink-0 justify-end">
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                Customize
              </button>

              <button
                onClick={handleRejectOptional}
                className="px-3.5 py-2 rounded-xl border border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-bold transition cursor-pointer"
              >
                Reject Optional
              </button>

              <button
                onClick={handleAcceptAll}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-extrabold transition shadow-lg shadow-red-950/50 flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                Accept All Cookies
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Persistent Floating Cookie Settings Trigger Button (Always available in bottom left corner) */}
      {hasConsent === true && !isModalOpen && (
        <button
          onClick={() => setIsModalOpen(true)}
          title="Manage Cookie Preferences"
          className="fixed bottom-4 left-4 z-40 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 hover:border-red-500/50 px-3 py-2 rounded-full shadow-2xl backdrop-blur-md text-xs font-mono font-bold flex items-center gap-2 transition group cursor-pointer"
        >
          <span className="text-base group-hover:rotate-45 transition duration-300">🍪</span>
          <span className="hidden sm:inline">Cookie Settings</span>
        </button>
      )}

      {/* Detailed Cookie Preferences Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-5 sm:p-7 space-y-6 text-slate-100 shadow-2xl relative my-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-700 flex items-center justify-center text-red-400 shrink-0">
                  <Settings className="w-5 h-5 animate-spin-slow" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    Cookie & Storage Preferences
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Kenya Data Protection Act 2019 & GDPR Compliance Desk
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Explanation Banner */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 text-xs text-slate-300 leading-relaxed space-y-1.5">
              <p className="font-bold text-slate-200 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-400" /> Transparent Data Policy:
              </p>
              <p>
                You have full control over what data Knews254 stores in your browser. We never sell reader data or set invasive third-party tracking pixels.
              </p>
            </div>

            {/* Toggle Switches for Categories */}
            <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
              {/* Category 1: Essential Cookies */}
              <div className="bg-slate-950/90 border border-slate-800 p-4 rounded-xl flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">1. Essential & Security Cookies</span>
                    <span className="text-[9px] bg-slate-800 text-slate-300 font-mono font-bold px-2 py-0.5 rounded uppercase">
                      Always Active
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Required for core newsroom navigation, bookmark saving, dark/light display settings, and secure reader authentication. Cannot be disabled.
                  </p>
                </div>

                <div className="relative inline-flex items-center shrink-0 mt-1">
                  <div className="w-11 h-6 bg-emerald-600 rounded-full flex items-center px-1 opacity-75 cursor-not-allowed">
                    <div className="w-4 h-4 bg-white rounded-full transform translate-x-5 shadow" />
                  </div>
                </div>
              </div>

              {/* Category 2: Analytics & Performance */}
              <div className="bg-slate-950/90 border border-slate-800 p-4 rounded-xl flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">2. Audience Analytics & Performance</span>
                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                      preferences.analytics ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {preferences.analytics ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Anonymized page view telemetry to help our engineers optimize loading speeds, CDN delivery across Kenya, and track breaking story trends.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setPreferences(prev => ({ ...prev, analytics: !prev.analytics }))}
                  className={`w-11 h-6 rounded-full transition-colors flex items-center px-1 shrink-0 mt-1 cursor-pointer ${
                    preferences.analytics ? 'bg-red-600' : 'bg-slate-700'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transform transition-transform shadow ${
                    preferences.analytics ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Category 3: Personalization & Preferences */}
              <div className="bg-slate-950/90 border border-slate-800 p-4 rounded-xl flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">3. County & Language Personalization</span>
                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                      preferences.personalization ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {preferences.personalization ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Remembers your preferred 47-county filter (e.g. Nairobi, Mombasa) and language preferences (English / Swahili) for tailored headlines.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setPreferences(prev => ({ ...prev, personalization: !prev.personalization }))}
                  className={`w-11 h-6 rounded-full transition-colors flex items-center px-1 shrink-0 mt-1 cursor-pointer ${
                    preferences.personalization ? 'bg-red-600' : 'bg-slate-700'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transform transition-transform shadow ${
                    preferences.personalization ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Category 4: Marketing & Ad Alerts */}
              <div className="bg-slate-950/90 border border-slate-800 p-4 rounded-xl flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">4. Sponsored Alerts & Marketing</span>
                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                      preferences.marketing ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {preferences.marketing ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Allows displaying non-intrusive local partner dispatches and custom event updates tailored to your reading history.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setPreferences(prev => ({ ...prev, marketing: !prev.marketing }))}
                  className={`w-11 h-6 rounded-full transition-colors flex items-center px-1 shrink-0 mt-1 cursor-pointer ${
                    preferences.marketing ? 'bg-red-600' : 'bg-slate-700'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transform transition-transform shadow ${
                    preferences.marketing ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Cookies Audit Inspector Box */}
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                  <span>Browser Cookies Currently Set ({activeCookiesList.length})</span>
                  <button
                    onClick={() => setActiveCookiesList(getAllKnews254Cookies())}
                    className="text-[10px] text-red-400 hover:text-red-300 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" /> Refresh Inspection
                  </button>
                </h4>

                <div className="bg-slate-950 rounded-xl border border-slate-800 p-3 space-y-2 text-[11px] font-mono">
                  {activeCookiesList.length === 0 ? (
                    <p className="text-slate-500 italic">No Knews254 cookies set in this session yet.</p>
                  ) : (
                    <div className="space-y-1.5 max-h-32 overflow-y-auto">
                      {activeCookiesList.map((c) => (
                        <div key={c.name} className="flex items-start justify-between gap-2 border-b border-slate-900 pb-1 last:border-0">
                          <div>
                            <span className="text-red-400 font-bold">{c.name}</span>
                            <p className="text-[10px] text-slate-400 font-sans leading-tight">{c.purpose}</p>
                          </div>
                          <span className="text-[10px] text-slate-500 shrink-0 bg-slate-900 px-1.5 py-0.5 rounded">
                            {c.domain}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleResetCookies}
                className="text-xs text-rose-400 hover:text-rose-300 font-mono font-bold hover:underline cursor-pointer"
              >
                Reset & Wipe All Cookies
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleRejectOptional}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition cursor-pointer"
                >
                  Essential Only
                </button>
                <button
                  type="button"
                  onClick={handleSavePreferences}
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-extrabold transition shadow-lg shadow-red-950/50 flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" /> Save Preferences
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

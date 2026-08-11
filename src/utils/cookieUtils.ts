export interface CookieConsentPreferences {
  essential: boolean; // Always true
  analytics: boolean;
  personalization: boolean;
  marketing: boolean;
  updatedAt: string;
}

export const DEFAULT_COOKIE_CONSENT: CookieConsentPreferences = {
  essential: true,
  analytics: true,
  personalization: true,
  marketing: false,
  updatedAt: new Date().toISOString(),
};

const CONSENT_COOKIE_NAME = 'knews254_cookie_consent';

/**
 * Get a cookie by name from document.cookie
 */
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
  }
  return null;
}

/**
 * Set a cookie with expiration in days
 */
export function setCookie(name: string, value: string, days = 365): void {
  if (typeof document === 'undefined') return;
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = '; expires=' + date.toUTCString();
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${name}=${encodeURIComponent(value)}${expires}; path=/; SameSite=Lax${secure}`;
}

/**
 * Delete a cookie by setting expired date
 */
export function deleteCookie(name: string): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax`;
}

/**
 * Get cookie consent preferences from cookie or localStorage fallback
 */
export function getCookieConsent(): CookieConsentPreferences | null {
  if (typeof window === 'undefined') return null;

  try {
    // 1. Try reading real cookie first
    const cookieVal = getCookie(CONSENT_COOKIE_NAME);
    if (cookieVal) {
      const parsed = JSON.parse(cookieVal);
      if (parsed && typeof parsed === 'object') {
        return {
          essential: true,
          analytics: Boolean(parsed.analytics),
          personalization: Boolean(parsed.personalization),
          marketing: Boolean(parsed.marketing),
          updatedAt: parsed.updatedAt || new Date().toISOString(),
        };
      }
    }

    // 2. Fallback to localStorage
    const localVal = localStorage.getItem(CONSENT_COOKIE_NAME);
    if (localVal) {
      const parsed = JSON.parse(localVal);
      if (parsed && typeof parsed === 'object') {
        return {
          essential: true,
          analytics: Boolean(parsed.analytics),
          personalization: Boolean(parsed.personalization),
          marketing: Boolean(parsed.marketing),
          updatedAt: parsed.updatedAt || new Date().toISOString(),
        };
      }
    }
  } catch (err) {
    console.warn('Failed to parse cookie consent:', err);
  }

  return null;
}

/**
 * Save cookie consent preferences to both document.cookie and localStorage
 */
export function saveCookieConsent(preferences: Partial<CookieConsentPreferences>): CookieConsentPreferences {
  const updated: CookieConsentPreferences = {
    essential: true,
    analytics: preferences.analytics ?? true,
    personalization: preferences.personalization ?? true,
    marketing: preferences.marketing ?? false,
    updatedAt: new Date().toISOString(),
  };

  const jsonStr = JSON.stringify(updated);

  // Set real browser cookie for 365 days
  setCookie(CONSENT_COOKIE_NAME, jsonStr, 365);

  // Also save to localStorage for fast lookup
  try {
    localStorage.setItem(CONSENT_COOKIE_NAME, jsonStr);
  } catch (e) {
    // Ignore quota errors
  }

  // Dispatch custom event so other components react immediately
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('knews254_cookie_consent_changed', { detail: updated }));
  }

  return updated;
}

/**
 * Clear saved cookie consent
 */
export function resetCookieConsent(): void {
  deleteCookie(CONSENT_COOKIE_NAME);
  try {
    localStorage.removeItem(CONSENT_COOKIE_NAME);
  } catch (e) {
    // Ignore
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('knews254_cookie_consent_changed', { detail: null }));
  }
}

/**
 * Get active list of all Knews254 browser cookies for audit
 */
export function getAllKnews254Cookies(): Array<{ name: string; value: string; domain: string; purpose: string }> {
  if (typeof document === 'undefined') return [];
  const cookies: Array<{ name: string; value: string; domain: string; purpose: string }> = [];
  const rawCookies = document.cookie.split(';');

  const purposes: Record<string, string> = {
    'knews254_cookie_consent': 'Stores user cookie consent & privacy choices (GDPR/Kenya Data Protection Act).',
    'knews254_theme': 'Remembers dark/light newspaper display theme.',
    'knews254_lang': 'Remembers active language choice (English/Swahili).',
    'knews254_county': 'Saves preferred county news filter.',
    'knews254_bookmarks': 'Saves bookmarked reading list articles.',
    'knews254_session': 'Anonymized session identifier for security and analytics.',
  };

  rawCookies.forEach((c) => {
    const parts = c.trim().split('=');
    if (parts[0]) {
      const name = parts[0].trim();
      const value = parts[1] ? decodeURIComponent(parts[1].trim()) : '';
      if (name) {
        cookies.push({
          name,
          value: value.length > 30 ? value.substring(0, 30) + '...' : value,
          domain: typeof window !== 'undefined' ? window.location.hostname : 'knews254.co.ke',
          purpose: purposes[name] || 'Operational browser storage cookie.',
        });
      }
    }
  });

  return cookies;
}

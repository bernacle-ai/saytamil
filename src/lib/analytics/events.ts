declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function gtag(...args: unknown[]) {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag(...args);
}

export function trackGrammarCheck(charCount: number, inputType: 'direct' | 'tanglish') {
  gtag('event', 'grammar_check', {
    character_count: charCount,
    input_type: inputType,
  });
}

export function trackCopyCorrectedText() {
  gtag('event', 'copy_corrected_text');
}

export function trackSignupClick(location: 'hero' | 'nav' | 'pricing' | 'cta_banner' | 'widget') {
  gtag('event', 'signup_click', { cta_location: location });
}

export function trackUpgradeClick(plan: 'pro' | 'team') {
  gtag('event', 'upgrade_click', { plan_name: plan });
}

export function trackPricingView() {
  gtag('event', 'pricing_view');
}

export function trackShare(method: 'copy' | 'whatsapp' | 'twitter') {
  gtag('event', 'share', { method });
}

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import cis from 'translations/cis.json';
import common from 'translations/common.json';
import demo from 'translations/demo.json';
import nist from 'translations/nist.json';
import pastQuantifications from 'translations/pastQuantifications.json';
import reports from 'translations/reports.json';
import resultsNarrative from 'translations/resultsNarrative.json';
import riskRegister from 'translations/riskRegister.json';
import roci from 'translations/roci.json';

export const resources = {
  en: {
    common,
    nist,
    cis,
    demo,
    pastQuantifications,
    reports,
    resultsNarrative,
    roci,
    riskRegister,
  },
};

export const defaultNS = 'common';

// Function to register translations with host's i18n instance
async function registerTranslationsWithHost() {
  try {
    // Try to load host's i18n module via Module Federation
    // Check if @module-federation/runtime is available
    let loadRemote: typeof import('@module-federation/runtime')['loadRemote'];
    try {
      const runtime = await import('@module-federation/runtime');
      loadRemote = runtime.loadRemote;
    } catch {
      // Runtime not available, try window object instead
      if (typeof window !== 'undefined' && (window as any).__addRemoteTranslations__) {
        Object.entries(resources.en).forEach(([namespace, translations]) => {
          (window as any).__addRemoteTranslations__(namespace, translations, 'en');
        });
        return true;
      }
      return false;
    }

    const hostI18n = await loadRemote<{
      addRemoteTranslations: (
        namespace: string,
        translations: Record<string, unknown>,
        language?: string,
      ) => void;
      default: typeof import('i18next');
    }>('kovrr_ai_platform_ui/i18n');

    if (hostI18n?.addRemoteTranslations) {
      // Register all our translation namespaces with the host
      Object.entries(resources.en).forEach(([namespace, translations]) => {
        hostI18n.addRemoteTranslations(namespace, translations, 'en');
      });
      return true;
    }
  } catch (error) {
    // Host i18n module not available, try global window object
    if (typeof window !== 'undefined' && (window as any).__addRemoteTranslations__) {
      Object.entries(resources.en).forEach(([namespace, translations]) => {
        (window as any).__addRemoteTranslations__(namespace, translations, 'en');
      });
      return true;
    }
    console.warn('⚠️ Could not register translations with host:', error);
  }
  return false;
}

// Only initialize if not already initialized (i.e., not running in host)
if (!i18n.isInitialized) {
  void i18n.use(initReactI18next).init({
    resources,
    defaultNS,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });
} else {
  // Running in host - add our translations to the shared instance
  void registerTranslationsWithHost();
}

export default i18n;

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

void i18n.use(initReactI18next).init({
  resources,
  defaultNS,
  lng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;

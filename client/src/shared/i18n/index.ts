import i18n from 'i18next';
import WebApp from '@twa-dev/sdk';
import { initReactI18next } from 'react-i18next';
// import { getDeviceLanguage } from 'utils/native/language';

import en from './locales/en.json';
import fr from './locales/fr.json';
import ru from './locales/ru.json';
import uk from './locales/uk.json';


export const resources = {
  en: { translation: en },
  fr: { translation: fr },
  ru: { translation: ru },
  uk: { translation: uk },
} as const;

i18n.on('languageChanged', handler);

i18n.use(initReactI18next).init({
  lng: WebApp.initDataUnsafe?.user?.language_code,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false, // not needed for react as it escapes by default
  },

  defaultNS: 'translation',
  ns: 'translation',

  // debug: true,
  resources,
});

function handler () {
  document
    .querySelector('meta[name="description"]')
    ?.setAttribute('content', i18n.t('meta.description'));
}

if (import.meta.env.REACT_APP_DEVELOPMENT) {
  window.changeLocale = (l: string) => i18n.changeLanguage(l);
}

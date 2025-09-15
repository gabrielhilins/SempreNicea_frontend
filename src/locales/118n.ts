import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './en/en.json';
import pt from './pt/pt.json';
import it from './it/it.json';
import es from './es/es.json';
import fr from './fr/fr.json';
import de from './de/de.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      pt: { translation: pt },
      it: { translation: it },
      es: { translation: es },
      fr: { translation: fr },
      de: { translation: de }
    },
    lng: 'pt',
    fallbackLng: 'pt',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
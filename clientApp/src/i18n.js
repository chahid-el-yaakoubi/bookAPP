import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { useTranslation } from 'react-i18next';
import { useContext, useEffect } from 'react';
import { TransContext } from './contextApi/TransContext';
import en from './translations/en.json';
import fr from './translations/fr.json';
import es from './translations/es.json';
import ar from './translations/ar.json';
import tf from './translations/tf.json';

const resources = {
  en: {
    translation: en
  },
  fr: {
    translation: fr
  },
  es: {
    translation: es
  },
  ar: {
    translation: ar
  },
  tf: {
    translation: tf
  } 
};      

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false
    }
  });

export const changeLanguage = (language) => {
  i18n.changeLanguage(language);
};

export default i18n;

function YourComponent() {
  const { state } = useContext(TransContext);
  const { t } = useTranslation();

  useEffect(() => {
    changeLanguage(state.language);
    document.documentElement.dir = t('dir');
  }, [state.language, t]);

  // ... rest of your component
}
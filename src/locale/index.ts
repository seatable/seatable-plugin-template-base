import intl from 'react-intl-universal';
import de from './lang/de';
import en from './lang/en';
import fr from './lang/fr';
import es from './lang/es';
import pt from './lang/pt';
import ru from './lang/ru';
import zh_CN from './lang/zh_CN';

const AVAILABLE_LOCALES = {
  de: de,
  en: en,
  fr: fr,
  es: es,
  pt: pt,
  ru: ru,
  'zh-cn': zh_CN,
};

const LANGUAGE = 'en';

let lang = window.dtable && window.dtable.lang ? window.dtable.lang : LANGUAGE;
intl.init({ currentLocale: lang, locales: AVAILABLE_LOCALES });

import ReactDOM from 'react-dom';
import DTable from 'dtable-sdk';
import App from './app.tsx';
import './setting.ts';
import LanguageDropdown from './components/LanguageDropDown/index';
import intl from 'react-intl-universal';
import { AVAILABLE_LOCALES } from './locale/index.ts';

class SeaTablePlugin {
  static async init() {
    const dtableSDK = new DTable();

    // local develop
    window.app = {};
    window.app.state = {};
    window.dtable = {
      ...window.dtablePluginConfig,
    };
    await dtableSDK.init(window.dtablePluginConfig);
    await dtableSDK.syncWithServer();

    window.app.collaborators = dtableSDK.dtableStore.collaborators;
    window.app.collaboratorsCache = {};
    window.app.state.collaborators = dtableSDK.dtableStore.collaborators;
    window.dtableWebAPI = dtableSDK.dtableWebAPI;
    window.app.onClosePlugin = SeaTablePlugin.onClosePlugin;
    window.dtableSDK = dtableSDK;
  }

  static async execute(lang = 'en') {
    await this.init();
    const rootElement = document.getElementById('plugin-wrapper');
    ReactDOM.unmountComponentAtNode(rootElement);
    ReactDOM.render(<App isDevelopment language={lang} />, rootElement);
    const langDropElement = document.getElementById('langDrop');
    ReactDOM.unmountComponentAtNode(langDropElement);
    intl.init({ currentLocale: lang, locales: AVAILABLE_LOCALES });
  }

  static onClosePlugin(language) {
    const lang = language;
    const langDropElement = document.getElementById('langDrop');
    ReactDOM.render(<LanguageDropdown lang={lang} />, langDropElement);
    ReactDOM.unmountComponentAtNode(document.getElementById('root'));
  }
}

SeaTablePlugin.execute();

const openBtn = document.getElementById('plugin-controller');
let lang;
export function updateLanguageAndIntl(newLang) {
  lang = newLang;
}
openBtn.addEventListener(
  'click',
  function () {
    SeaTablePlugin.execute(lang);
  },
  false
);

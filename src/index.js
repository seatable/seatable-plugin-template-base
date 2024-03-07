import ReactDOM from 'react-dom';
import DTable from 'dtable-sdk';
import App from './app.tsx';
import './setting.ts';
import LanguageDropdown from './components/LanguageDropDown/index';
import intl from 'react-intl-universal';
import { AVAILABLE_LOCALES } from './locale/index.ts';

class TaskList {
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
    window.app.onClosePlugin = TaskList.onClosePlugin;
    window.dtableSDK = dtableSDK;
  }

  static async execute(lang = 'en') {
    await this.init();
    const rootElement = document.getElementById('plugin-wrapper');
    ReactDOM.unmountComponentAtNode(rootElement);
    ReactDOM.render(<App isDevelopment />, rootElement);
    const langDropElement = document.getElementById('langDrop');
    ReactDOM.unmountComponentAtNode(langDropElement);
    intl.init({ currentLocale: lang, locales: AVAILABLE_LOCALES });
  }

  static onClosePlugin() {
    const langDropElement = document.getElementById('langDrop');
    ReactDOM.render(<LanguageDropdown />, langDropElement);
    ReactDOM.unmountComponentAtNode(document.getElementById('plugin-wrapper'));
  }
}

TaskList.execute();

const openBtn = document.getElementById('plugin-controller');
let lang;
export function updateLanguageAndIntl(newLang) {
  lang = newLang;
}
openBtn.addEventListener(
  'click',
  function () {
    TaskList.execute(lang);
  },
  false
);

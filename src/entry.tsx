import ReactDOM from 'react-dom';
import App from './app';
import info from './plugin-config/info.json';
import { AVAILABLE_LOCALES } from './locale';
import intl from 'react-intl-universal';

const SeaTablePlugin = {
  execute: () => {
    let lang =
      window.dtable && Object.values(AVAILABLE_LOCALES).includes(window.dtable.lang)
        ? window.dtable.lang
        : 'en';
    intl.init({ currentLocale: lang, locales: AVAILABLE_LOCALES });
    ReactDOM.render(<App showDialog={true} />, document.querySelector('#plugin-wrapper'));
  },
};

export default SeaTablePlugin;

window.app.registerPluginItemCallback(info.name, SeaTablePlugin.execute);

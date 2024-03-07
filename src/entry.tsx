import ReactDOM from 'react-dom';
import App from './app';
import info from './plugin-config/info.json';

const SeaTablePlugin = {
  execute: () => {
    ReactDOM.render(<App showDialog={true} />, document.querySelector('#plugin-wrapper'));
  },
};

export default SeaTablePlugin;

window.app.registerPluginItemCallback(info.name, SeaTablePlugin.execute);

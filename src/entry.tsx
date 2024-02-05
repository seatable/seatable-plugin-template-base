import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';

const Plugin = {
  execute: () => {
    ReactDOM.render(<App showDialog={true} />, document.querySelector('#plugin-wrapper'));
  },
};

export default Plugin;

window.app.registerPluginItemCallback('plugin-template', Plugin.execute);

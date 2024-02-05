import React from 'react';
import ReactDOM from 'react-dom';
import DTable from 'dtable-sdk';
import App from './app.tsx';
import './setting.ts';

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

  static async execute() {
    await this.init();
    const rootElement = document.getElementById('root');
    ReactDOM.unmountComponentAtNode(rootElement);
    ReactDOM.render(<App isDevelopment />, rootElement);
  }

  static onClosePlugin() {
    ReactDOM.unmountComponentAtNode(document.getElementById('root'));
  }
}

TaskList.execute();

const openBtn = document.getElementById('plugin-controller');
openBtn.addEventListener(
  'click',
  function () {
    TaskList.execute();
  },
  false
);

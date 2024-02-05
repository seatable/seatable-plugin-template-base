import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import DTable from 'dtable-sdk';
import App from './app'; 
import './setting';

const Plugin: React.FC = () => {
  const [isDevelopment, setIsDevelopment] = useState<boolean>(true);

  const init = async () => {
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
    window.app.onClosePlugin = onClosePlugin;
    window.dtableSDK = dtableSDK;
  };

  const execute = async () => {
    await init();
    const rootElement = document.getElementById('root')!;

    ReactDOM.unmountComponentAtNode(rootElement);
    ReactDOM.render(<App isDevelopment={isDevelopment} />, rootElement);
  };

  const onClosePlugin = () => {
    ReactDOM.unmountComponentAtNode(document.getElementById('root')!);
  };

  useEffect(() => {
    execute();
  }, []);

  const openBtnClickHandler = () => {
    execute();
  };

  const openBtn = document.getElementById('plugin-controller');
  openBtn?.addEventListener('click', openBtnClickHandler, false);

  return null; // This component doesn't render anything
};

export default Plugin;

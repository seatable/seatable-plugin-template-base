import React, { useEffect, useState } from 'react';
import { IAppProps } from './utils/Interfaces/App.interface';
import styles from './styles/Modal.module.scss';
import Header from './components/Header';
import PluginSettings from './components/PluginSettings';
import './assets/css/plugin-layout.css';
import './locale';
import Views from './components/Views';
import { DEFAULT_PLUGIN_SETTINGS, PLUGIN_ID, PLUGIN_NAME } from './constants';

const App: React.FC<IAppProps> = (props) => {
  const { isDevelopment, row } = props;
  const [showSettings, setShowSettings] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [toggleViewComponent, setToggleViewComponent] = useState<boolean>(false);
  const [baseViews, setBaseViews] = useState<any[]>([]);
  const [currentTable, setCurrentTable] = useState<any>({});
  const [allViews, setAllViews] = useState<any[]>([]);
  const [plugin_settings, setPluginSettings] = useState<any>({});
  const [currentViewIdx, setCurrentViewIdx] = useState<number>(0);

  useEffect(() => {
    initPluginDTableData();
    return () => {
      unsubscribeLocalDtableChanged();
      unsubscribeRemoteDtableChanged();
    };
  }, []);

  const initPluginDTableData = async () => {
    if (isDevelopment) {
      // local develop
      window.dtableSDK.subscribe('dtable-connect', () => {
        onDTableConnect();
      });
    }
    unsubscribeLocalDtableChanged = window.dtableSDK.subscribe('local-dtable-changed', () => {
      onDTableChanged();
    });
    unsubscribeRemoteDtableChanged = window.dtableSDK.subscribe('remote-dtable-changed', () => {
      onDTableChanged();
    });
    resetData();
  };

  const toggleSettings = () => {
    setShowSettings((prev) => !prev);
  };

  let unsubscribeLocalDtableChanged = () => {
    throw new Error('Method not implemented.');
  };
  let unsubscribeRemoteDtableChanged = () => {
    throw new Error('Method not implemented.');
  };

  const onDTableConnect = () => {
    resetData();
  };

  const onDTableChanged = () => {
    resetData();
  };

  const getPluginSettings = () => {
    return window.dtableSDK.getPluginSettings(PLUGIN_NAME)?.views
      ? window.dtableSDK.getPluginSettings(PLUGIN_NAME)
      : DEFAULT_PLUGIN_SETTINGS;
  };

  const resetData = () => {
    let table = window.dtableSDK.getActiveTable();
    let baseViews = window.dtableSDK.getViews(table);
    let plugin_settings = getPluginSettings();
    let allViews = plugin_settings.views;

    setPluginSettings(plugin_settings);
    setAllViews(allViews);
    setCurrentTable(table);
    setBaseViews(baseViews);
    setIsLoading(false);
  };

  const onPluginToggle = () => {
    window.app.onClosePlugin();
  };

  // Change view
  const onSelectView = (viewId: string) => {
    let viewIdx = allViews.findIndex((view) => view._id === viewId);
    setCurrentViewIdx(viewIdx);
  };

  // Update views data
  const updateViews = (
    currentViewIdx: number,
    views: any[],
    plugin_settings: any,
    callBack: any = null
  ) => {
    setCurrentViewIdx(currentViewIdx);
    setAllViews(views);
    setPluginSettings(plugin_settings);
    updatePluginSettings(plugin_settings);
  };

  // update plugin settings
  const updatePluginSettings = (pluginSettings: any) => {
    window.dtableSDK.updatePluginSettings(PLUGIN_NAME, pluginSettings);
  };

  const toggleView = () => {
    setToggleViewComponent((prev) => !prev);
  };

  const { collaborators } = window.app.state;
  const subtables: any[] = window.dtableSDK.getTables();

  return isLoading ? (
    <div></div>
  ) : (
    <div className={styles.modal}>
      <Header
        toggleView={toggleView}
        toggleSettings={toggleSettings}
        showSettings={showSettings}
        togglePlugin={onPluginToggle}
      />
      {/* main body  */}
      <div className="d-flex position-relative" style={{ height: '100%' }}>
        {/* views  */}
        <Views
          toggleViewComponent={toggleViewComponent}
          allViews={allViews}
          onSelectView={onSelectView}
          currentViewIdx={currentViewIdx}
          plugin_settings={plugin_settings}
          updateViews={updateViews}
        />

        {/* content  */}
        <div id={PLUGIN_ID} className={styles.body}>
          <div>{`'rows: '${JSON.stringify(row)}`}</div>
          <div>{`'dtable-subtables: '${JSON.stringify(subtables)}`}</div>
        </div>
        {showSettings && (
          <PluginSettings
            subtables={subtables}
            baseViews={baseViews}
            currentTableID={currentTable._id}
          />
        )}
      </div>
    </div>
  );
};

export default App;

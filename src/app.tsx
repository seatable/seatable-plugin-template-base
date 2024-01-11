import React, { useEffect, useState } from 'react';
import { ModalBody } from 'reactstrap';
import { IAppProps } from './utils/Interfaces/App.interface';
import styles from './styles/Modal.module.scss';
import Header from './components/Header';
import PluginSettings from './components/PluginSettings';
import './assets/css/plugin-layout.css';
import './locale';

const App: React.FC<IAppProps> = ({ isDevelopment, showDialog, row }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [_showDialog, setShowDialog] = useState<boolean>(showDialog || false);
  const [baseViews, setBaseViews] = useState<any[]>([]);
  const [currentTable, setCurrentTable] = useState<any>({});
  const customPluginName: string = 'Plugin Name'; // this name will change accordingly to the Custom Plugin

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

  const resetData = () => {
    let table = window.dtableSDK.getActiveTable();
    let baseViews = window.dtableSDK.getViews(table);
    setCurrentTable(table);
    setBaseViews(baseViews);
    setIsLoading(false);
  };

  const onPluginToggle = () => {
    setShowDialog(false);
    window.app.onClosePlugin();
  };

  const { collaborators } = window.app.state;
  const subtables: any[] = window.dtableSDK.getTables();

  return isLoading ? (
    <div></div>
  ) : (
    <div className={styles.modal}>
      <Header
        toggleSettings={toggleSettings}
        showSettings={showSettings}
        toggle={onPluginToggle}
        customPluginName={customPluginName}
      />
      {/* views placeholder  */}
      {/* main content placeholder  */}
      {showSettings && (
        <PluginSettings
          subtables={subtables}
          baseViews={baseViews}
          currentTableID={currentTable._id}
        />
      )}
    </div>
  );
};

export default App;

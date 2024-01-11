import React, { useEffect, useState } from 'react';
import './locale';
import './assets/css/plugin-layout.css';
import { IAppProps } from './utils/Interfaces/App.interface';
import PluginSettings from './components/PluginSettings';

const App: React.FC<IAppProps> = ({ isDevelopment, showDialog, row }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [_showDialog, setShowDialog] = useState<boolean>(showDialog || false);
  const [baseViews, setBaseViews] = useState<any[]>([]);
  const [currentTable, setCurrentTable] = useState<any>({});

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
    <div>
      {/* header placeholder  */}
      {/* views placeholder  */}
      {/* main content placeholder  */}
      <PluginSettings
        subtables={subtables}
        baseViews={baseViews}
        currentTableID={currentTable._id}
      />
    </div>
  );
};

export default App;

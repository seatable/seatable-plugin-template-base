import React, { useEffect, useState } from 'react';
import styles from './styles/Modal.module.scss';
import { IAppProps } from './utils/Interfaces/App.interface';
import { Table, TableArray, TableView, TableViewArray } from './utils/Interfaces/Table.interface';
import Header from './components/Header';
import PluginSettings from './components/PluginSettings';
import PluginPresets from './components/PluginPresets';
import './assets/css/plugin-layout.css';
import './locale';
import { PresetsArray, IPluginSettings } from './utils/Interfaces/PluginPresets.interface';
import { IDtableSelect } from './utils/Interfaces/PluginSettings.interface';
import {
  DEFAULT_PLUGIN_SETTINGS,
  PLUGIN_ID,
  PLUGIN_NAME,
  PRESET_NAME,
  TABLE_NAME,
} from './utils/constants';
import useClickOut from './hooks/useClickOut';

const App: React.FC<IAppProps> = (props) => {
  const { isDevelopment, row } = props;
  const [isShowPlugin, setIsShowPlugin] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [togglePresetsComponent, setTogglePresetsComponent] = useState<boolean>(false);
  const [tableViews, setTableViews] = useState<TableViewArray>([]);
  const [currentTable, setCurrentTable] = useState<Table | null>(null);
  const [currentTableView, setCurrentTableView] = useState<TableView | null>(null);
  const [pluginPresets, setPluginPresets] = useState<PresetsArray>([]);
  const [pluginSettings, setPluginSettings] = useState<IPluginSettings>({
    presets: [],
    [PRESET_NAME]: PRESET_NAME,
  });
  const [currentPresetIdx, setCurrentPresetIdx] = useState<number>(0); // Preset at idx 0 it's alway loaded
  const subtables: TableArray = window.dtableSDK.getTables();

  let settingsDomNode = useClickOut(() => {
    setShowSettings(false);
  });

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
    const pluginSettings = window.dtableSDK.getPluginSettings(PLUGIN_NAME)
      ? window.dtableSDK.getPluginSettings(PLUGIN_NAME)
      : DEFAULT_PLUGIN_SETTINGS;
    delete pluginSettings.views;
    return pluginSettings;
  };

  const resetData = () => {
    let table = window.dtableSDK.getActiveTable();
    let tableViews = window.dtableSDK.getViews(table); // All the Views of a specific Table (PluginSettings component)
    let pluginSettings = getPluginSettings(); // An obj with an array of all the Presets of the Plugin (PluginPresets component)
    let pluginPresets: PresetsArray = pluginSettings.presets;

    setPluginSettings(pluginSettings);
    setPluginPresets(pluginPresets);
    setCurrentTable(table);
    setTableViews(tableViews);
    setIsLoading(false);
    setCurrentTableView(tableViews[0]);
  };

  const onPluginToggle = () => {
    setTimeout(() => {
      setIsShowPlugin(false);
    }, 300);
    window.app.onClosePlugin();
  };

  // Change view
  const onSelectPreset = (presetId: string) => {
    let presetIdx = pluginPresets.findIndex((preset) => preset._id === presetId);

    setCurrentPresetIdx(presetIdx);
  };

  // Update presets data
  const updatePresets = (
    currentPresetIdx: number,
    updatedPresets: PresetsArray,
    pluginSettings: IPluginSettings,
    callBack: any = null
  ) => {
    setCurrentPresetIdx(currentPresetIdx);
    setPluginPresets(updatedPresets);
    setPluginSettings(pluginSettings);
    updatePluginSettings(pluginSettings);
  };

  // update plugin settings
  const updatePluginSettings = (pluginSettings: IPluginSettings) => {
    window.dtableSDK.updatePluginSettings(PLUGIN_NAME, pluginSettings);
  };

  const togglePresets = () => {
    setTogglePresetsComponent((prev) => !prev);
  };

  // switch table
  const onTableChange = (table: IDtableSelect) => {
    let currentTable = subtables.find((s) => s._id === table.value) || subtables[0];
    setCurrentTable(currentTable);
    setTableViews(window.dtableSDK.getViews(currentTable));
    setCurrentTableView(currentTable.views[0]);
  };

  // switch table view
  const onBaseViewChange = (view: IDtableSelect) => {
    let _currentTableView = tableViews.find((s) => s._id === view.value) || tableViews[0];
    setCurrentTableView(_currentTableView);
  };

  const { collaborators } = window.app.state;

  if (!isShowPlugin) {
    return null;
  }

  return isLoading ? (
    <div></div>
  ) : (
    <div className={styles.modal}>
      <Header
        togglePresets={togglePresets}
        toggleSettings={toggleSettings}
        showSettings={showSettings}
        togglePlugin={onPluginToggle}
      />
      {/* main body  */}
      <div className="d-flex position-relative" style={{ height: '100%' }}>
        {/* presets  */}
        <PluginPresets
          setTogglePresetsComponent={togglePresetsComponent}
          pluginPresets={pluginPresets}
          onSelectPreset={onSelectPreset}
          currentPresetIdx={currentPresetIdx}
          pluginSettings={pluginSettings}
          updatePresets={updatePresets}
        />
        {/* content  */}
        <div id={PLUGIN_ID} className={styles.body}>
          <div>{`'rows: '${JSON.stringify(row)}`}</div>
          <div>{`'dtable-subtables: '${JSON.stringify(subtables)}`}</div>
        </div>
        {showSettings && (
          <div ref={settingsDomNode}>
            <PluginSettings
              subtables={subtables}
              tableViews={tableViews}
              currentTableID={currentTable ? currentTable._id : ''}
              baseViewID={currentTableView ? currentTableView._id : ''}
              onTableChange={onTableChange}
              onBaseViewChange={onBaseViewChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;

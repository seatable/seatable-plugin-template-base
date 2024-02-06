import React, { useEffect, useState } from 'react';
// Import of Component
import Header from './components/Header';
import PluginSettings from './components/PluginSettings';
import PluginPresets from './components/PluginPresets';
// Import of Interfaces
import { AppActiveState, AppIsShowState, IAppProps } from './utils/Interfaces/App.interface';
import { TableArray, TableViewArray, Table, TableView } from './utils/Interfaces/Table.interface';
import {
  PresetsArray,
  IPluginSettings,
  IPresetInfo,
} from './utils/Interfaces/PluginPresets/Presets.interface';
import { SelectOption } from './utils/Interfaces/PluginSettings.interface';
// Import of CSS
import styles from './styles/Modal.module.scss';
import './assets/css/plugin-layout.css';
// Import of Constants
import {
  DEFAULT_PLUGIN_SETTINGS,
  INITIAL_IS_SHOW_STATE,
  INITIAL_CURRENT_STATE,
  PLUGIN_ID,
  PLUGIN_NAME,
  PRESET_NAME,
  DEFAULT_SELECT_OPTION,
} from './utils/constants';
import './locale';

const App: React.FC<IAppProps> = (props) => {
  const { isDevelopment } = props;
  const [isShowState, setIsShowState] = useState<AppIsShowState>(INITIAL_IS_SHOW_STATE);
  const { isShowPlugin, isShowSettings, isLoading } = isShowState;
  const [appActiveState, setAppActiveState] = useState<AppActiveState>(INITIAL_CURRENT_STATE);
  const { activeTable, activeTableName, activeTableView, activePresetId, activePresetIdx } =
    appActiveState;
  const [togglePresetsComponent, setTogglePresetsComponent] = useState<boolean>(false);
  // *** // Tables, Presets, Views, Settings dataStates
  const [allTables, setAllTables] = useState<TableArray>([]);
  const [activeTableViews, setActiveTableViews] = useState<TableViewArray>([]);
  const [pluginPresets, setPluginPresets] = useState<PresetsArray>([]);
  const [pluginSettings, setPluginSettings] = useState<IPluginSettings>({
    presets: [],
    [PRESET_NAME]: PRESET_NAME,
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
    setIsShowState((prevState) => ({ ...prevState, isShowSettings: !prevState.isShowSettings }));
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
  const getPluginSettings = (activeTable: Table) => {
    const pluginSettings =
      window.dtableSDK.getPluginSettings(PLUGIN_NAME) || DEFAULT_PLUGIN_SETTINGS;
    delete pluginSettings.views;

    pluginSettings.presets = pluginSettings.presets.map((preset: IPresetInfo) => {
      if (preset.settings) {
        preset.settings.selectedTable = preset.settings.selectedTable || {
          value: activeTable._id,
          label: activeTable.name,
        };
        preset.settings.selectedView = preset.settings.selectedView || {
          value: activeTable.views[0]._id,
          label: activeTable.views[0].name,
        };
      }

      return preset;
    });

    return pluginSettings;
  };

  const resetData = () => {
    let allTables: TableArray = window.dtableSDK.getTables(); // All the Tables of the Base
    let activeTable: Table = window.dtableSDK.getActiveTable(); // How is the ActiveTable Set?
    let activeTableViews: TableViewArray = activeTable.views; // All the Views of the specific Active Table (PluginSettings component)
    let pluginSettings = getPluginSettings(activeTable); // An obj with an array of all the Presets of the Plugin (PluginPresets component)
    let pluginPresets: PresetsArray = pluginSettings.presets;

    setAllTables(allTables);
    setActiveTableViews(activeTableViews);
    setPluginSettings(pluginSettings);
    setPluginPresets(pluginPresets);
    setAppActiveState((prevState) => ({
      ...prevState,
      activeTable: activeTable,
      activeTableName:
        pluginPresets[0]?.settings?.selectedTable?.label ?? DEFAULT_SELECT_OPTION.label,
      activeTableView: activeTableViews[0],
      activePresetId: pluginPresets[0]._id,
    }));
    setIsShowState((prevState) => ({ ...prevState, isLoading: false }));
  };

  const onPluginToggle = () => {
    setTimeout(() => {
      setIsShowState((prevState) => ({ ...prevState, isShowPlugin: false }));
    }, 300);
    window.app.onClosePlugin();
  };

  // Change view
  const onSelectPreset = (presetId: string) => {
    let presetIdx = pluginPresets.findIndex((preset) => preset._id === presetId);
    const activeTableName = pluginPresets[presetIdx]?.settings?.selectedTable?.label as string;
    setAppActiveState((prevState) => ({
      ...prevState,
      activeTableName,
      activePresetIdx: presetIdx,
      activePresetId: presetId,
    }));
  };

  // Update presets data
  const updatePresets = (
    activePresetIdx: number,
    updatedPresets: PresetsArray,
    pluginSettings: IPluginSettings,
    callBack: any = null
  ) => {
    setAppActiveState((prevState) => ({
      ...prevState,
      activePresetIdx: activePresetIdx,
    }));
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

  // // switch table or view
  const onTableOrViewChange = (type: 'table' | 'view', option: SelectOption) => {
    const action = type;
    switch (action) {
      case 'view':
        let activeTableView =
          activeTableViews.find((s) => s._id === option.value) || activeTableViews[0];
        setAppActiveState((prevState) => ({ ...prevState, activeTableView }));
        break;
      case 'table':
        let activeTable = allTables.find((s) => s._id === option.value) || allTables[0];
        setActiveTableViews(activeTable.views);
        setAppActiveState((prevState) => ({
          ...prevState,
          activeTable,
        }));
        break;
    }
    updatePresetSettings(pluginPresets, activePresetId, type, { [type]: option });
  };

  const updatePresetSettings = (
    pluginPresets: PresetsArray,
    activePresetId: string,
    type: 'table' | 'view',
    option: {
      view?: SelectOption;
      table?: SelectOption;
    }
  ) => {
    const dynamicField = option.view ? 'selectedView' : 'selectedTable';
    const value = option[type]?.value;
    const label = option[type]?.label;
    const updatedPluginPresets = pluginPresets.map((preset) => {
      if (preset._id === activePresetId) {
        return {
          ...preset,
          settings: {
            ...preset.settings,
            [dynamicField]: {
              value,
              label,
            },
          },
        };
      } else return preset;
    });

    setPluginPresets(updatedPluginPresets);
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
        isShowSettings={isShowSettings}
        togglePlugin={onPluginToggle}
      />
      {/* main body  */}
      <div className="d-flex position-relative" style={{ height: '100%' }}>
        {/* presets  */}
        <PluginPresets
          setTogglePresetsComponent={togglePresetsComponent}
          pluginPresets={pluginPresets}
          onSelectPreset={onSelectPreset}
          activePresetIdx={activePresetIdx}
          pluginSettings={pluginSettings}
          updatePresets={updatePresets}
          allTables={allTables}
        />
        {/* content  */}
        <div id={PLUGIN_ID} className={styles.body}>
          {pluginPresets.map((obj) => (
            <div
              key={obj._id}
              style={{
                border: '1px solid #ddd',
                padding: '10px',
                marginBottom: '10px',
                borderRadius: '5px',
                backgroundColor: '#f5f5f5',
              }}>
              <div style={{ fontWeight: 'bold' }}>{`Preset ID: ${obj._id}`}</div>
              <div style={{ color: '#007bff' }}>{`Preset Name: ${obj.name}`}</div>
              <div style={{ marginTop: '8px', fontWeight: 'bold' }}>Settings:</div>
              <div style={{ marginLeft: '15px', color: '#28a745' }}>{`selectedTableId: ${
                obj.settings?.selectedTable?.value ?? 'N/A'
              }`}</div>
              <div style={{ marginLeft: '15px', color: '#28a745' }}>{`selectedViewId: ${
                obj.settings?.selectedView?.value ?? 'N/A'
              }`}</div>
            </div>
          ))}
          <div id="additional-info" className={styles.body}>
            <h2 style={{ color: '#007bff', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
              {activeTableName} Information
            </h2>
            <ul>
              {activeTable?.rows.map((info) => (
                <li
                  key={info._id}
                  style={{
                    border: '1px solid #ddd',
                    padding: '10px',
                    marginBottom: '10px',
                    borderRadius: '5px',
                    backgroundColor: '#f5f5f5',
                  }}>
                  <div>{`ID: ${info._id}`}</div>
                  <div>{`Creator: ${info._creator}`}</div>
                  <div>{`Created Time: ${info._ctime}`}</div>
                  <div>{`Last Modified Time: ${info._mtime}`}</div>
                  {/* Add other fields as needed */}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {isShowSettings && (
          <div>
            <PluginSettings
              allTables={allTables}
              activeTableViews={activeTableViews}
              activeTableId={activeTable ? activeTable._id : ''}
              activePresetId={activePresetId}
              activeTableViewId={activeTableView ? activeTableView._id : ''}
              pluginPresets={pluginPresets}
              onTableOrViewChange={onTableOrViewChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;

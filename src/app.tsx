import React, { useEffect, useState } from 'react';
// Import of Component
import Header from './components/Header';
import PluginSettings from './components/PluginSettings';
import PluginPresets from './components/PluginPresets';
// Import of Interfaces
import { AppActiveState, AppIsShowState, IAppProps } from './utils/Interfaces/App.interface';
import {
  TableArray,
  TableViewArray,
  Table,
  TableView,
  TableRow,
  IActiveTableAndView,
} from './utils/Interfaces/Table.interface';
import { PresetsArray, IPluginSettings } from './utils/Interfaces/PluginPresets/Presets.interface';
import { SelectOption } from './utils/Interfaces/PluginSettings.interface';
// Import of CSS
import styles from './styles/Modal.module.scss';
import './assets/css/plugin-layout.css';
// Import of Constants
import {
  INITIAL_IS_SHOW_STATE,
  INITIAL_CURRENT_STATE,
  PLUGIN_ID,
  PLUGIN_NAME,
} from './utils/constants';
import './locale';
import {
  createDefaultPreset,
  getActiveStateSafeGuard,
  getActiveTableAndActiveView,
  getPluginSettings,
} from './utils/utils';

const App: React.FC<IAppProps> = (props) => {
  const { isDevelopment } = props;
  // Boolean state to show/hide the plugin's components
  const [isShowState, setIsShowState] = useState<AppIsShowState>(INITIAL_IS_SHOW_STATE);
  const { isShowPlugin, isShowSettings, isLoading, isShowPresets } = isShowState;
  // *** // Tables, Presets, Views as dataStates. The main data of the plugin
  const [allTables, setAllTables] = useState<TableArray>([]);
  const [activeTableViews, setActiveTableViews] = useState<TableViewArray>([]);
  const [pluginPresets, setPluginPresets] = useState<PresetsArray>([]);
  // appActiveState: Define the app's active Preset + (Table + View) state using the useState hook
  // For better understanding read the comments in the AppActiveState interface
  const [appActiveState, setAppActiveState] = useState<AppActiveState>(INITIAL_CURRENT_STATE);
  // Destructure properties from the app's active state for easier access
  const { activeTable, activePresetId, activePresetIdx, activeViewRows } = appActiveState;
  const [togglePresetsComponent, setTogglePresetsComponent] = useState<boolean>(false);

  // We should get rid of the pluginSettings state and use the pluginPresets state instead
  const [pluginSettings, setPluginSettings] = useState<IPluginSettings>({
    presets: [],
    [PLUGIN_NAME]: PLUGIN_NAME,
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
    // console.log('onDTableChanged');
    // resetData();
  };

  const resetData = () => {
    let allTables: TableArray = window.dtableSDK.getTables(); // All the Tables of the Base
    let activeTable: Table = window.dtableSDK.getActiveTable(); // How is the ActiveTable Set? allTables[0]?
    let activeTableViews: TableViewArray = activeTable.views; // All the Views of the specific Active Table
    let pluginPresets: PresetsArray = getPluginSettings(activeTable, PLUGIN_NAME); // An array with all the Presets

    // If there are no presets, the default one is created
    if (pluginPresets.length === 0) {
      const defaultPluginSettings: IPluginSettings = createDefaultPreset(activeTable, PLUGIN_NAME);
      window.dtableSDK.updatePluginSettings(PLUGIN_NAME, defaultPluginSettings);
    }
    // Retrieve both objects of activeTable and activeView from the pluginPresets NOT from the window.dtableSDK
    const activeTableAndView: IActiveTableAndView = getActiveTableAndActiveView(
      pluginPresets,
      allTables
    );
    // Get the activeViewRows from the window.dtableSDK
    const activeViewRows: TableRow[] = window.dtableSDK.getViewRows(
      activeTableAndView?.view || activeTableViews[0],
      activeTableAndView?.table || activeTable
    );

    const activeStateSafeGuard = getActiveStateSafeGuard(
      pluginPresets,
      activeTable,
      activeTableAndView,
      activeViewRows
    );

    setAllTables(allTables);
    setActiveTableViews(activeTableAndView?.table?.views || activeTableViews);
    setPluginPresets(pluginPresets);
    // At first we set the first Preset as the active one
    setAppActiveState(activeStateSafeGuard);
    setIsShowState((prevState) => ({ ...prevState, isLoading: false }));
  };

  const onPluginToggle = () => {
    setTimeout(() => {
      setIsShowState((prevState) => ({ ...prevState, isShowPlugin: false }));
    }, 300);
    window.app.onClosePlugin();
  };

  // Change Preset
  const onSelectPreset = (presetId: string, newPresetActiveState?: AppActiveState) => {
    let updatedActiveState: AppActiveState;
    let updatedActiveTableViews: TableView[];
    if (newPresetActiveState !== undefined) {
      updatedActiveState = {
        ...newPresetActiveState,
      };
      updatedActiveTableViews = newPresetActiveState?.activeTable?.views!;
    } else {
      const _activePresetIdx = pluginPresets.findIndex((preset) => preset._id === presetId);
      const activePreset = pluginPresets.find((preset) => preset._id === presetId);
      const selectedTable = activePreset?.settings?.selectedTable;
      const selectedView = activePreset?.settings?.selectedView;

      const _activeTableName = selectedTable?.label as string;
      const _activeTableId = selectedTable?.value as string;
      const _activeViewId = selectedView?.value as string;

      updatedActiveTableViews =
        allTables.find((table) => table._id === _activeTableId)?.views || [];

      updatedActiveState = {
        activeTable: allTables.find((table) => table._id === _activeTableId) || activeTable,
        activeTableName: _activeTableName,
        activeTableView:
          updatedActiveTableViews.find((view) => view._id === _activeViewId) || activeTableViews[0],
        activePresetId: presetId,
        activePresetIdx: _activePresetIdx,
      };
    }

    const activeViewRows: TableRow[] = window.dtableSDK.getViewRows(
      updatedActiveState?.activeTableView,
      updatedActiveState?.activeTable
    );

    setActiveTableViews(updatedActiveTableViews);
    setAppActiveState({ ...updatedActiveState, activeViewRows });
  };

  // Update presets data
  const updatePresets = (
    _activePresetIdx: number,
    updatedPresets: PresetsArray,
    pluginSettings: IPluginSettings,
    activePresetId?: string,
    callBack: any = null
  ) => {
    setAppActiveState((prevState) => ({
      ...prevState,
      activePresetIdx: _activePresetIdx,
    }));
    setPluginPresets(updatedPresets);
    setPluginSettings(pluginSettings);
    updatePluginSettings(pluginSettings);
  };

  // update plugin settings
  const updatePluginSettings = (pluginSettings: IPluginSettings) => {
    window.dtableSDK.updatePluginSettings(PLUGIN_NAME, pluginSettings);
  };

  const updateActiveData = () => {
    let allTables: TableArray = window.dtableSDK.getTables();
    let tableOfPresetOne = pluginPresets[0].settings?.selectedTable!;
    let viewOfPresetOne = pluginPresets[0].settings?.selectedView!;
    let table = allTables.find((t) => t._id === tableOfPresetOne.value)!;
    let view = table?.views.find((v) => v._id === viewOfPresetOne.value)!;

    const newPresetActiveState: AppActiveState = {
      activePresetId: pluginPresets[0]._id,
      activePresetIdx: 0,
      activeTable: table,
      activeTableName: table.name,
      activeTableView: view,
      activeViewRows: window.dtableSDK.getViewRows(view, table),
    };

    setAppActiveState(newPresetActiveState);
  };

  const togglePresets = () => {
    setTogglePresetsComponent((prev) => !prev);
  };

  // // switch table or view
  const onTableOrViewChange = (type: 'table' | 'view', option: SelectOption) => {
    let _activeViewRows: TableRow[];
    let updatedPluginPresets: PresetsArray;

    switch (type) {
      case 'table':
        const _activeTable = allTables.find((s) => s._id === option.value)!;
        _activeViewRows = window.dtableSDK.getViewRows(_activeTable.views[0], _activeTable);
        setActiveTableViews(_activeTable.views);
        setAppActiveState((prevState) => ({
          ...prevState,
          activeTable: _activeTable,
          activeTableName: _activeTable.name,
          activeTableView: _activeTable.views[0],
          activeViewRows: _activeViewRows,
        }));

        updatedPluginPresets = pluginPresets.map((preset) =>
          preset._id === activePresetId
            ? {
                ...preset,
                settings: {
                  ...preset.settings,
                  selectedTable: { value: _activeTable._id, label: _activeTable.name },
                  selectedView: {
                    value: _activeTable.views[0]._id,
                    label: _activeTable.views[0].name,
                  },
                },
              }
            : preset
        );
        break;

      case 'view':
        let _activeTableView =
          activeTableViews.find((s) => s._id === option.value) || activeTableViews[0];
        _activeViewRows = window.dtableSDK.getViewRows(_activeTableView, activeTable);
        setAppActiveState((prevState) => ({
          ...prevState,
          activeTableView: _activeTableView,
          activeViewRows: _activeViewRows,
        }));

        updatedPluginPresets = pluginPresets.map((preset) =>
          preset._id === activePresetId
            ? {
                ...preset,
                settings: {
                  ...preset.settings,
                  selectedView: { value: _activeTableView._id, label: _activeTableView.name },
                },
              }
            : preset
        );
        break;
    }

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
          allTables={allTables}
          pluginPresets={pluginPresets}
          activePresetIdx={activePresetIdx}
          pluginSettings={pluginSettings}
          isShowPresets={isShowPresets}
          onSelectPreset={onSelectPreset}
          updatePresets={updatePresets}
          updateActiveData={updateActiveData}
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
                obj.settings?.selectedTable?.label ?? 'N/A'
              }`}</div>
              <div style={{ marginLeft: '15px', color: '#28a745' }}>{`selectedViewId: ${
                obj.settings?.selectedView?.label ?? 'N/A'
              }`}</div>
            </div>
          ))}
          <div
            key={appActiveState?.activeTableView?._id}
            style={{
              border: '1px solid #ddd',
              padding: '10px',
              marginBottom: '10px',
              borderRadius: '5px',
              backgroundColor: '#f5f5f5',
            }}>
            <div
              style={{ color: '#ff6666' }}>{`Active Table: ${appActiveState.activeTableName}`}</div>
            <div
              style={{
                color: '#ff6666',
              }}>{`Active View: ${appActiveState?.activeTableView?.name}`}</div>
          </div>
          <div style={{ marginTop: '8px', fontWeight: 'bold' }}>View Rows:</div>
          <div>
            {activeViewRows?.map((row) => (
              <div key={row._id}>
                <h6>{row['0000']}</h6>
              </div>
            ))}
          </div>
        </div>

        {isShowSettings && (
          <div>
            <PluginSettings
              allTables={allTables}
              appActiveState={appActiveState}
              activeTableViews={activeTableViews}
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

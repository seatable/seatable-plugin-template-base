import * as Icons from 'react-icons/ri';
import { PresetSettings } from '../Interfaces/PluginPresets/Presets.interface';
import { AppActiveState, AppIsShowState } from '../Interfaces/App.interface';
import { IActivePresetSettings } from '../Interfaces/PluginSettings.interface';

// Customize constant names for each different plugin.
const PLUGIN_NAME = 'Plugin template'; // INSERT PLUGIN NAME
const PLUGIN_ICON = Icons['RiOrganizationChart']; // Change PLUGIN Icon Name
const PLUGIN_ID = 'main-custom-content'; // Insert Plugin ID

const TABLE_NAME = 'table_name';
const DEFAULT_PRESET_NAME = 'Default Preset';

const DEFAULT_SELECT_OPTION = {
  value: '',
  label: '',
};
const DEFAULT_PRESET_SETTINGS: PresetSettings = {
  shown_image_name: '',
  shown_title_name: '',
  selectedTable: DEFAULT_SELECT_OPTION,
  selectedView: DEFAULT_SELECT_OPTION,
};

const DEFAULT_PLUGIN_SETTINGS = {
  [PLUGIN_NAME]: PLUGIN_NAME,
  presets: [
    {
      _id: '0000',
      name: DEFAULT_PRESET_NAME,
      settings: {},
    },
  ],
};

const PresetHandleAction = {
  // would be better to have them as enum but it gives me an error in run time
  delete: 'delete',
  rename: 'rename',
  duplicate: 'duplicate',
  edit: 'edit',
  new: 'new',
};

// enum PresetHandleAction {
//   Delete = 'delete',
//   Rename = 'rename',
//   Duplicate = 'duplicate',
//   Edit = 'edit',
//   New = 'new',
// }

const INITIAL_IS_SHOW_STATE: AppIsShowState = {
  isShowPlugin: true,
  isShowSettings: false,
  isLoading: true,
  isShowPresets: false,
};

const INITIAL_CURRENT_STATE: AppActiveState = {
  activeTable: null,
  activeTableName: 'Table1',
  activeTableView: null,
  activePresetId: '0000',
  activePresetIdx: 0,
};

const DEFAULT_SELECTED_PRESET: IActivePresetSettings = {
  activePresetId: '',
  selectedTable: DEFAULT_SELECT_OPTION,
  selectedView: DEFAULT_SELECT_OPTION,
};

export {
  PLUGIN_ICON,
  PLUGIN_NAME,
  PLUGIN_ID,
  TABLE_NAME,
  DEFAULT_PRESET_NAME,
  DEFAULT_PLUGIN_SETTINGS,
  DEFAULT_PRESET_SETTINGS,
  PresetHandleAction,
  INITIAL_IS_SHOW_STATE,
  INITIAL_CURRENT_STATE,
  DEFAULT_SELECTED_PRESET,
  DEFAULT_SELECT_OPTION,
};

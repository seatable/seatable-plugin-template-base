// External imports
import * as Icons from 'react-icons/ri';

// Interfaces
import { PresetSettings } from '../Interfaces/PluginPresets/Presets.interface';
import { AppActiveState, AppIsShowState } from '../Interfaces/App.interface';
import { IActivePresetSettings } from '../Interfaces/PluginSettings.interface';

// Constants
const POSSIBLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz0123456789';

// Plugin Configuration That Needs to be moved in a json file.
const PLUGIN_NAME = 'Plugin template'; // INSERT PLUGIN NAME
const PLUGIN_ICON = Icons['RiOrganizationChart']; // Change PLUGIN Icon Name
const PLUGIN_ID = 'main-custom-content'; // Insert Plugin ID
const BACKGROUND_COLOR = 'rgb(29, 40, 56)'; // Insert Background Color

// Table and Preset Defaults
const TABLE_NAME = 'table_name';
const DEFAULT_PRESET_NAME = 'Default Preset';

// Default Select Option
const DEFAULT_SELECT_OPTION = {
  value: '',
  label: '',
};

// Default Preset Settings
const DEFAULT_PRESET_SETTINGS: PresetSettings = {
  shown_image_name: '',
  shown_title_name: '',
  selectedTable: DEFAULT_SELECT_OPTION,
  selectedView: DEFAULT_SELECT_OPTION,
};

// Default Plugin Data
const DEFAULT_PLUGIN_DATA = {
  [PLUGIN_NAME]: PLUGIN_NAME,
  activePresetId: '0000',
  activePresetIdx: 0,
  presets: [
    {
      _id: '0000',
      name: DEFAULT_PRESET_NAME,
      settings: DEFAULT_PRESET_SETTINGS,
    },
  ],
};

// Preset Handle Actions
const PresetHandleAction = {
  delete: 'delete',
  rename: 'rename',
  duplicate: 'duplicate',
  edit: 'edit',
  new: 'new',
};

// Initial App State
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

// Default Selected Preset
const DEFAULT_SELECTED_PRESET: IActivePresetSettings = {
  activePresetId: '',
  selectedTable: DEFAULT_SELECT_OPTION,
  selectedView: DEFAULT_SELECT_OPTION,
};

// Exported Constants
export {
  POSSIBLE,
  PLUGIN_ICON,
  PLUGIN_NAME,
  PLUGIN_ID,
  TABLE_NAME,
  BACKGROUND_COLOR,
  DEFAULT_PLUGIN_DATA,
  DEFAULT_PRESET_NAME,
  DEFAULT_PRESET_SETTINGS,
  PresetHandleAction,
  INITIAL_IS_SHOW_STATE,
  INITIAL_CURRENT_STATE,
  DEFAULT_SELECTED_PRESET,
  DEFAULT_SELECT_OPTION,
};

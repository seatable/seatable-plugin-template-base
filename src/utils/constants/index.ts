import * as Icons from 'react-icons/ri';
import { PresetSettings } from '../Interfaces/PluginPresets.interface';

const TABLE_NAME = 'table_name';
const PRESET_NAME = 'view_name';

// Customize constant names for each different plugin.
const PLUGIN_NAME = 'Plugin template'; // INSERT PLUGIN NAME
const PLUGIN_ICON = Icons['RiOrganizationChart']; // Change PLUGIN Icon Name
const PLUGIN_ID = 'main-custom-content'; // Insert Plugin ID

const DEFAULT_PRESET_SETTINGS: PresetSettings = {
  shown_image_name: null,
  shown_title_name: '',
  selectedTableId: '',
  selectedViewId: '',
};

const DEFAULT_PLUGIN_SETTINGS = {
  views: [
    {
      _id: '0000',
      name: 'Default View',
      settings: {},
    },
  ],
};

export {
  PLUGIN_ICON,
  PLUGIN_NAME,
  PLUGIN_ID,
  TABLE_NAME,
  PRESET_NAME,
  DEFAULT_PLUGIN_SETTINGS,
  DEFAULT_PRESET_SETTINGS,
};

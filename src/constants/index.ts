import * as SETTING_KEY from './setting-key';
import * as Icons from 'react-icons/ri';

const PLUGIN_NAME = 'Plugin template'; // INSERT PLUGIN NAME
const PLUGIN_ICON = Icons['RiOrganizationChart']; // Change PLUGIN Icon Name

const DEFAULT_PLUGIN_SETTINGS = {
  views: [
    {
      _id: '0000',
      name: 'Default View',
      settings: {},
    },
  ],
};

export { PLUGIN_ICON, PLUGIN_NAME, SETTING_KEY, DEFAULT_PLUGIN_SETTINGS };

import * as SETTING_KEY from './setting-key';

const PLUGIN_NAME = 'Plugin template'; // INSERT PLUGIN NAME

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
  PLUGIN_NAME,
  SETTING_KEY,
  DEFAULT_PLUGIN_SETTINGS
};

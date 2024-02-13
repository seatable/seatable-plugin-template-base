import pluginContext from '../plugin-context';
import { AppActiveState } from './Interfaces/App.interface';
import {
  IPluginSettings,
  IPresetInfo,
  PresetSettings,
  PresetsArray,
} from './Interfaces/PluginPresets/Presets.interface';
import {
  IActiveTableAndView,
  Table,
  TableArray,
  TableRow,
  TableView,
} from './Interfaces/Table.interface';
import {
  DEFAULT_PLUGIN_SETTINGS,
  DEFAULT_PRESET_NAME,
  PLUGIN_NAME,
  PresetHandleAction,
} from './constants';

export const generatorBase64Code = (keyLength = 4) => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz0123456789';
  let key = '';
  for (let i = 0; i < keyLength; i++) {
    key += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return key;
};

export const generatorPresetId = (presets: Array<{ _id: string }>): string => {
  let preset_id: string = '',
    isUnique = false;
  while (!isUnique) {
    preset_id = generatorBase64Code(4);

    // eslint-disable-next-line
    isUnique = presets?.every((item) => {
      return item._id !== preset_id;
    });
    if (isUnique) {
      break;
    }
  }
  return preset_id;
};

export const getImageThumbnailUrl = (url: string, size?: number): string => {
  const server = pluginContext.getSetting('server');
  let isInternalLink = url.indexOf(server) > -1;
  if (isInternalLink) {
    size = size || 256;
    let imageThumbnailUrl = url.replace('/workspace', '/thumbnail/workspace') + '?size=' + size;
    return imageThumbnailUrl;
  }
  return url;
};

export const isValidEmail = (email: string): boolean => {
  const reg = /^[A-Za-zd]+([-_.][A-Za-zd]+)*@([A-Za-zd]+[-.])+[A-Za-zd]{2,6}$/;

  return reg.test(email);
};

export const calculateColumns = (
  galleryColumnsName: string[],
  currentColumns: { name: string }[]
): { name: string }[] => {
  let newColumns: { name: string }[] = [];
  galleryColumnsName.forEach((columnName) => {
    let column = currentColumns.find((column) => columnName === column.name);
    if (column) {
      newColumns.push(column);
    }
  });
  return newColumns;
};

export const calculateColumnsName = (
  currentColumns: { name: string }[],
  galleryColumnsName: string[] | undefined
): string[] => {
  let newColumnsName: string[] = [];
  currentColumns.forEach((column) => {
    newColumnsName.push(column.name);
  });
  if (galleryColumnsName) {
    let columnsName: string[] = Array.from(new Set([...galleryColumnsName, ...newColumnsName]));
    newColumnsName = columnsName.filter((columnName) =>
      newColumnsName.some((c) => c === columnName)
    );
  }
  return newColumnsName;
};

export const checkDesktop = () => {
  return window.innerWidth >= 768;
};

export const isTableEditable = (
  {
    permission_type = 'default',
    permitted_users = [],
  }: { permission_type?: string; permitted_users?: string[] },
  TABLE_PERMISSION_TYPE: {
    DEFAULT: string;
    ADMINS: string;
    SPECIFIC_USERS: string;
  }
): boolean => {
  const { isAdmin, username } = window.dtable ? window.dtable : window.dtablePluginConfig;

  if (!permission_type) {
    return true;
  }
  if (permission_type === TABLE_PERMISSION_TYPE.DEFAULT) {
    return true;
  }
  if (permission_type === TABLE_PERMISSION_TYPE.ADMINS && isAdmin) {
    return true;
  }
  if (
    permission_type === TABLE_PERMISSION_TYPE.SPECIFIC_USERS &&
    permitted_users.includes(username)
  ) {
    return true;
  }
  return false;
};

export const canCreateRows = (
  table: { table_permissions?: { add_rows_permission?: any } },
  TABLE_PERMISSION_TYPE: {
    DEFAULT: string;
    ADMINS: string;
    SPECIFIC_USERS: string;
  }
): boolean => {
  let canCreateRows = true;
  if (table && table.table_permissions && table.table_permissions.add_rows_permission) {
    canCreateRows = isTableEditable(
      table.table_permissions.add_rows_permission,
      TABLE_PERMISSION_TYPE
    );
  }
  return canCreateRows;
};

export const needUseThumbnailImage = (url: string): string | boolean => {
  if (!url || url.lastIndexOf('.') === -1) {
    return false;
  }
  const image_suffix = url.substr(url.lastIndexOf('.') + 1).toLowerCase();
  const suffix = ['bmp', 'tif', 'tiff'];
  return suffix.includes(image_suffix);
};

export const isInternalImg = (url: string): boolean | undefined => {
  if (!url) return;
  return url.indexOf(window.dtable.server) > -1;
};

export const checkSVGImage = (url: string): boolean | undefined => {
  if (!url) return false;
  return url.substr(-4).toLowerCase() === '.svg';
};

/**
 * Checks whether a preset name already exists in the presets array, excluding the current index.
 *
 * @param {string} presetName - The name of the preset to check for existence.
 * @param {PresetsArray} presets - An array of presets to search for duplicates.
 * @param {number} currentIndex - The index of the preset to exclude from the check.
 * @returns {boolean} - Returns true if the preset name already exists, excluding the current index.
 */
export const isUniquePresetName = (
  presetName: string,
  presets: PresetsArray,
  currentIndex: number
): boolean => {
  // Using the `some` method to check if any preset (excluding the current index) has the same name
  return presets.some((preset, index) => index !== currentIndex && preset.name === presetName);
};

/**
 * The function has the purpose of getting the plugin's presets.
 * If the plugin presets are not found, it maps inside the activeTable and returns set it as value.
 * @param {string} PLUGIN_NAME The name of the plugin.
 * @param {Table} activeTable A Table object needed in the .
 * @returns An array with the plugin's presets
 */
// export const getPluginSettings = (activeTable: Table) => {
// Function implementation...
// };
export const getPluginSettings = (activeTable: Table, PLUGIN_NAME: string) => {
  const getPluginPresets = window.dtableSDK.getPluginSettings(PLUGIN_NAME); // Plugin Presets not Settings function name should be changed

  // This is a safe guard to prevent the plugin from crashing if there are no presets
  const _presetSettings: PresetSettings = {
    selectedTable: { value: activeTable._id, label: activeTable.name },
    selectedView: { value: activeTable.views[0]._id, label: activeTable.views[0].name },
  };

  // Importing the default settings from the constants file and updating the presets array with the Default Settings
  const updatedDefaultSettings = {
    ...DEFAULT_PLUGIN_SETTINGS,
    presets: [
      {
        ...DEFAULT_PLUGIN_SETTINGS.presets[0],
        settings: _presetSettings,
      },
    ],
  };

  const pluginSettings = getPluginPresets ? getPluginPresets : updatedDefaultSettings;

  return pluginSettings.presets;
};

export const appendPresetSuffix = (name: string, nameList: string[], suffix: string): string => {
  if (!nameList.includes(name.trim())) {
    return name;
  } else {
    let _name = `${name} ${suffix}`;
    return appendPresetSuffix(_name, nameList, suffix);
  }
};

// Checking if there are any presets, if not, we set the first Table and View as the active ones
export const getActiveStateSafeGuard = (
  pluginPresets: PresetsArray,
  activeTable: Table,
  activeTableAndView: {
    table: Table;
    view: TableView;
  },
  activeViewRows: TableRow[]
) => {
  const checkForPresets: AppActiveState = {
    activeTable: (pluginPresets[0] && (activeTableAndView?.table as Table)) || activeTable,
    activeTableName:
      (pluginPresets[0] && pluginPresets[0].settings?.selectedTable?.label) || activeTable.name,
    activeTableView:
      (pluginPresets[0] && (activeTableAndView?.view as TableView)) || activeTable.views[0],
    activePresetId: (pluginPresets[0] && pluginPresets[0]._id) || '0000', // '0000' as Safe guard if there are no presets
    activePresetIdx: 0,
    activeViewRows: activeViewRows,
  };
  return checkForPresets;
};


/**
 * Retrieves the active table and view based on the preset handling action type.
 *
 * @param pluginPresets - Array of plugin presets.
 * @param allTables - Array of all available tables.
 * @param type - Type of preset handling action (e.g., new, duplicate).
 * @param option - Additional options for handling presets (e.g., preset ID, preset settings).
 * @returns An object containing the active table and view.
 */
export const getActiveTableAndActiveView = (
  pluginPresets: PresetsArray,
  allTables: TableArray,
  type?: string,
  option?: { pId: string; pSettings: PresetSettings }
) => {
  let tableViewObj;
  let table;
  let views;
  let view;

  // Type === 'new' we set the first Table and View as the active ones
  // Type === 'duplicate' we set the selected Table and View as the active ones
  // Type === undefined we set the last used Table and View as the active ones (TO-DO)
  if (type === PresetHandleAction.new) {
    table = allTables[0];
    view = table?.views[0];
  } else if (type === PresetHandleAction.duplicate) {
    table = allTables.find((i) => i.name === option?.pSettings.selectedTable?.label)!;
    views = table?.views;
    view = views?.find((v) => {
      return v.name === option?.pSettings.selectedView?.label;
    })!;
  } else if (pluginPresets.length > 0 && type === undefined) {
    // This needs to be changes since in this case we need to retrieve the Last Preset used from the USER
    table = allTables.find((i) => i.name === pluginPresets[0].settings?.selectedTable?.label)!;
    views = table?.views;
    view = views?.find((v) => {
      return v.name === pluginPresets[0].settings?.selectedView?.label;
    })!;
  }

  return (tableViewObj = {
    table: table,
    view: view,
  } as IActiveTableAndView);
};

/**
 * Creates a default preset for the plugin.
 * @param activeTable - The active table for which it retrieves the info.
 * @param pluginName - The name of the plugin associated with the preset.
 * @returns The default preset with initial settings.
 */
export const createDefaultPreset = (activeTable: Table, pluginName: string): IPluginSettings => {
  return {
    presets: [
      {
        _id: generatorPresetId([]),
        name: DEFAULT_PRESET_NAME,
        settings: {
          selectedTable: { value: activeTable._id, label: activeTable.name },
          selectedView: { value: activeTable?.views[0]?._id, label: activeTable?.views[0]?.name },
        },
      },
    ],
    [PLUGIN_NAME]: pluginName,
  };
};

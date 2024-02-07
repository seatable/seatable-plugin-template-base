import pluginContext from '../plugin-context';
import { PresetsArray } from './Interfaces/PluginPresets/Presets.interface';

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

export const isPresetNameAlreadyExists = (
  presetName: string,
  presets: PresetsArray,
  currentIndex: number
): boolean => {
  return presets.some((preset, index) => index !== currentIndex && preset.name === presetName);
};

export const appendPresetSuffix = (name: string, nameList: string[]): string => {
  if (!nameList.includes(name)) {
    return name
  } else {
    let _name = `${name} new`;
    return appendPresetSuffix(_name, nameList)
  }
}

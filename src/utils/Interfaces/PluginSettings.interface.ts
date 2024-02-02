import { PresetSettings, PresetsArray } from './PluginPresets/Presets.interface';
import { TableArray, TableViewArray } from './Table.interface';

interface IPluginSettingsProps {
  allTables: TableArray;
  activeTableViews: TableViewArray;
  activeTableId: string;
  activeTableViewId: string;
  onTableOrViewChange: (type: 'table' | 'view', option: SelectOption) => void;
  pluginPresets: PresetsArray;
  activePresetId: string;
}

interface SelectOption {
  value: string; // item._id
  label: string; // item.name
}

interface IActivePresetSettings extends PresetSettings {
  activePresetId: string;
}

export type { IPluginSettingsProps, SelectOption, IActivePresetSettings };

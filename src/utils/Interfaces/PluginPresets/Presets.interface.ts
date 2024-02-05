import { PRESET_NAME } from '../../constants';
import { SelectOption } from '../PluginSettings.interface';
import { TableArray } from '../Table.interface';

export interface IPresetsProps {
  pluginPresets: PresetsArray;
  activePresetIdx: number;
  onSelectPreset: (presetId: string) => void;
  updatePresets: (currentIdx: number, presets: any[], pluginSettings: any, type: string) => void;
  pluginSettings: IPluginSettings;
  setTogglePresetsComponent: boolean;
  allTables: TableArray;
}

export interface IPresetsState {
  dragItemIndex: number | null;
  dragOverItemIndex: number | null;
  _allViews: any[];
}

export interface IPluginSettings {
  presets: PresetsArray;
  [PRESET_NAME]: string;
}

export interface IPresetInfo {
  _id: string;
  name: string;
  settings?: PresetSettings;
}

export interface PresetSettings {
  shown_image_name?: string | undefined;
  shown_title_name?: string | undefined;
  selectedTable?: SelectOption;
  selectedView?: SelectOption;
}

export type PresetsArray = IPresetInfo[];

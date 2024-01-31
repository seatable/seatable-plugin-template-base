import { PRESET_NAME } from '../../constants';

export interface IPresetsProps {
  pluginPresets: PresetsArray;
  currentPresetIdx: number;
  onSelectPreset: (presetId: string) => void;
  updatePresets: (currentIdx: number, presets: any[], pluginSettings: any) => void;
  pluginSettings: IPluginSettings;
  setTogglePresetsComponent: boolean;
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

interface IPresetInfo {
  _id: string;
  name: string;
  settings?: PresetSettings;
}

export interface PresetSettings {
  shown_image_name: string | null;
  shown_title_name: string;
  selectedTableId?: string;
  selectedViewId?: string;
}

export type PresetsArray = IPresetInfo[];

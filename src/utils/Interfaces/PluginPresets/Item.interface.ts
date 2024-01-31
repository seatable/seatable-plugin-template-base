import { PresetsArray } from './Presets.interface';

export interface IPresetItemProps {
  pluginPresets: PresetsArray;
  currentPresetIdx: number;
  presetName: string;
  onSelectPreset: (presetId: string) => void;
  togglePresetsUpdate: (e: React.MouseEvent<HTMLElement>, type?: 'edit') => void;
  deletePreset: () => void;
  v: any;
  onChangePresetName: (e: React.FormEvent<HTMLInputElement>) => void;
  onEditPresetSubmit: (e?: React.MouseEvent<HTMLElement>) => void;
  duplicatePreset: (name: string) => void;
  showEditPresetPopUp: boolean;
}

// Not used, still to keep?
export interface IViewItemState {
  showViewDropdown: boolean;
  isEditing: boolean;
  popupRef: React.RefObject<HTMLUListElement> | undefined;
}

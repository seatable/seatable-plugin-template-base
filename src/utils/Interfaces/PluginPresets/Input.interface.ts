export interface IPresetInput {
  onChangePresetName: (e: React.FormEvent<HTMLInputElement>) => void;
  onEditPresetSubmit: (e?: React.MouseEvent<HTMLElement>) => void;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  isEditing: boolean;
  presetName: string;
}

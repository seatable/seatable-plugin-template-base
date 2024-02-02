export interface IPresetDropdownProps {
  deletePreset: () => void;
  toggleEditPresetPopUp: (e: React.MouseEvent<HTMLElement>) => void;
  duplicatePreset: () => void;
  dropdownRef: React.RefObject<HTMLUListElement> | undefined;
}

// Not Used Anymore, still to keep?
export interface IViewDropdownState {
  showViewDropdown: boolean;
}

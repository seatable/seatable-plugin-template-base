export interface IPresetDropdownProps {
  togglePresetsUpdatePopUp: (e: React.MouseEvent<HTMLElement>) => void;
  dropdownRef: React.RefObject<HTMLUListElement> | undefined;
}

// Not Used Anymore, still to keep?
export interface IViewDropdownState {
  showViewDropdown: boolean;
}

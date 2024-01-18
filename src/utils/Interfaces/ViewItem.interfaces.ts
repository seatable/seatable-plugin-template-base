export interface IViewItemProps {
  allViews: any[];
  currentViewIdx: number;
  onSelectView: (viewId: string) => void;
  toggleNewViewPopUp: (e: React.MouseEvent<HTMLElement>, type?: 'edit') => void;
  deleteView: () => void;
  v: any;
  viewName: string;
  onViewNameChange: (e: React.FormEvent<HTMLInputElement>) => void;
  onEditViewSubmit: (e: React.MouseEvent<HTMLElement>, type?: 'edit') => void;
  duplicateView: (name: string) => void;
  showEditViewPopUp: boolean;
}

export interface IViewItemState {
  showViewDropdown: boolean;
  isEditing: boolean;
  popupRef: React.RefObject<HTMLUListElement> | undefined;
}

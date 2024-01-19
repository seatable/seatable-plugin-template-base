import { VIEW_NAME } from '../../constants';

export interface IViewsProps {
  allViews: any[];
  currentViewIdx: number;
  onSelectView: (viewId: string) => void;
  updateViews: (currentIdx: number, views: any[], plugin_settings: any) => void;
  plugin_settings: { views: any; [VIEW_NAME]: any };
  toggleViewComponent: boolean;
}

export interface IViewsState {
  dragItemIndex: number | null;
  dragOverItemIndex: number | null;
  _allViews: any[];
}

import { Table, TableView } from './Table.interface';

export interface IAppProps {
  isDevelopment?: boolean;
  showDialog?: boolean;
  row?: any;
}
export interface AppIsShowState {
  isShowPlugin: boolean;
  isShowSettings: boolean;
  isLoading: boolean;
}

export interface AppActiveState {
  activeTable: Table | null;
  activeTableName: string;
  activeTableView: TableView | null;
  activePresetId: string;
  activePresetIdx: number;
}

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
  isShowPresets: boolean;
}

// AppActiveState is a state that holds the active state of what is shown in the plugin
export interface AppActiveState {
  // as "active" is meant the state of the selected Preset
  activePresetId: string; // Stores the ID of the active preset
  activePresetIdx: number; // Keeps track of the index of the active preset
  activeTable: Table | null; // Represents the currently active table in the app
  activeTableName: string; // Holds the name of the active table
  activeTableView: TableView | null; // Represents the currently active table view in the app
}

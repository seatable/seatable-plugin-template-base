export interface IPluginSettingsProps {
  subtables: any[];
  currentTableID: string;
  baseViews: any[];
  onTablechange: (table: IDtableSelect) => void;
  onBaseViewChange: (view: IDtableSelect) => void;
  baseViewID: string;
}

export interface IDtableSelect {
  value: string;
  label: string;
}

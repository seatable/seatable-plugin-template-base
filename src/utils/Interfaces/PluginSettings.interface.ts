import { TableViewArray } from './Table.interface';

interface IPluginSettingsProps {
  subtables: any[];
  currentTableID: string;
  tableViews: TableViewArray;
  onTableChange: (table: IDtableSelect) => void;
  onBaseViewChange: (view: IDtableSelect) => void;
  baseViewID: string;
}

interface IDtableSelect {
  value: string;
  label: string;
}

export type { IPluginSettingsProps, IDtableSelect };

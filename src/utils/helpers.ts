import { TableArray } from './Interfaces/Table.interface';

export const truncateTableName = (tableName: string) => {
  let _tableName;

  if (tableName.split('').length > 22) {
    _tableName = tableName.slice(0, 20) + '...';

    return _tableName;
  }

  return tableName;
};

export const createDefaultPresetSettings = (allTables: TableArray) => {
  console.log('allTables', allTables);
  const tableInfo = { value: allTables[0]._id, label: allTables[0].name };
  const viewInfo = { value: allTables[0].views[0]._id, label: allTables[0].views[0].name };
  return {
    shown_image_name: 'Image',
    shown_title_name: 'Title',
    selectedTable: tableInfo,
    selectedView: viewInfo,
  };
};
export const createDuplicatedPresetSettings = (allTables: TableArray) => {
  console.log('allTables', allTables);
  const tableInfo = { value: allTables[0]._id, label: allTables[0].name };
  const viewInfo = { value: allTables[0].views[0]._id, label: allTables[0].views[0].name };
  return {
    shown_image_name: 'Image',
    shown_title_name: 'Title',
    selectedTable: tableInfo,
    selectedView: viewInfo,
  };
};

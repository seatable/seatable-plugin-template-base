import React, { useEffect, useState } from 'react';
import DtableSelect from '../Elements/dtable-select';
import styles from '../../styles/PluginSettings.module.scss';
import {
  IActivePresetSettings,
  SelectOption,
  IPluginSettingsProps,
} from '../../utils/Interfaces/PluginSettings.interface';
import { DEFAULT_SELECTED_PRESET } from '../../utils/constants';
import { truncateTableName } from '../../utils/helpers';

const PluginSettings: React.FC<IPluginSettingsProps> = ({
  allTables,
  activeTableViews,
  appActiveState,
  pluginPresets,
  onTableOrViewChange,
}) => {
  const [tableOptions, setTableOptions] = useState<SelectOption[]>();
  const [viewOptions, setViewOptions] = useState<SelectOption[]>();
  const [tableSelectedOption, setTableSelectedOption] = useState<SelectOption>();
  const [viewSelectedOption, setViewSelectedOption] = useState<SelectOption>();

  // Change options when active table or view changes
  useEffect(() => {
    const { activeTable, activeTableName, activePresetId, activeTableView } = appActiveState;

    let tableOptions = allTables.map((item) => {
      let value = item._id;
      let label = truncateTableName(item.name);
      return { value, label };
    });

    let viewOptions = activeTableViews.map((item) => {
      let value = item._id;
      let label = truncateTableName(item.name);
      return { value, label };
    });

    let tableSelectedOption = tableOptions.find((item) => item.value === activeTable?._id);
    let viewSelectedOption = viewOptions.find((item) => item.value === activeTableView?._id);

    setTableOptions(tableOptions);
    setTableSelectedOption(tableSelectedOption);
    setViewOptions(viewOptions);
    setViewSelectedOption(viewSelectedOption);
  }, [appActiveState]);

  return (
    <div className={`p-5 bg-white ${styles.settings}`}>
      <div>
        <div className={styles.settings_dropdowns}>
          <div>
            <p className="d-inline-block mb-2">Table</p>
            {/* toggle table view  */}
            <DtableSelect
              value={tableSelectedOption}
              options={tableOptions}
              onChange={(selectedOption: SelectOption) => {
                let type = 'table' as 'table' | 'view';
                onTableOrViewChange(type, selectedOption);
              }}
            />
          </div>

          <div>
            <p className="d-inline-block mb-2 mt-3">View</p>
            {/* toggle table view  */}
            <DtableSelect
              value={viewSelectedOption}
              options={viewOptions}
              onChange={(selectedOption: SelectOption) => {
                let type = 'view' as 'table' | 'view';
                onTableOrViewChange(type, selectedOption);
              }}
            />
          </div>
        </div>

        {/* insert custom settings  */}
      </div>
    </div>
  );
};

export default PluginSettings;

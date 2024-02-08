import React, { useEffect, useState } from 'react';
import DtableSelect from '../Elements/dtable-select';
import styles from '../../styles/PluginSettings.module.scss';
import {
  IActivePresetSettings,
  SelectOption,
  IPluginSettingsProps,
} from '../../utils/Interfaces/PluginSettings.interface';
import { truncateTableName } from '../../utils/helpers';

// PluginSettings component for managing table and view options
const PluginSettings: React.FC<IPluginSettingsProps> = ({
  allTables,
  appActiveState,
  activeTableViews,
  pluginPresets,
  onTableOrViewChange,
}) => {
  // State variables for table and view options
  const [tableOptions, setTableOptions] = useState<SelectOption[]>();
  const [viewOptions, setViewOptions] = useState<SelectOption[]>();
  const [tableSelectedOption, setTableSelectedOption] = useState<SelectOption>();
  const [viewSelectedOption, setViewSelectedOption] = useState<SelectOption>();

  // useEffect(() => {
  //   console.log('activePresetIdx in Settings', appActiveState.activePresetIdx);
  // }, [appActiveState.activePresetIdx]);

  // Change options when active table or view changes
  useEffect(() => {
    console.log('Settings has been called');
    console.log('pluginPresets', pluginPresets);
    console.log('Active Table Name: ', appActiveState.activeTableName);
    console.log('Active View Name: ', appActiveState.activeTableView?.name);
    const { activeTable, activeTableView } = appActiveState;

    // Create options for tables
    let tableOptions = allTables.map((item) => {
      let value = item._id;
      let label = truncateTableName(item.name);
      return { value, label };
    });

    // Create options for views
    let viewOptions = activeTableViews.map((item) => {
      let value = item._id;
      let label = truncateTableName(item.name);
      return { value, label };
    });

    console.log('tableOptions', tableOptions);
    console.log('viewOptions', viewOptions);
    // Set selected options based on activeTable and activeTableView
    let tableSelectedOption = {
      value: appActiveState?.activeTable?._id!,
      label: appActiveState.activeTableName,
    };
    let viewSelectedOption = viewOptions.find((item) => item.value === activeTableView?._id);
    console.log('tableSelectedOption', tableSelectedOption);
    console.log('viewSelectedOption', viewSelectedOption?.label);

    // Update state with new options and selected values
    setTableOptions(tableOptions);
    setTableSelectedOption(tableSelectedOption);
    setViewOptions(viewOptions);
    setViewSelectedOption(viewSelectedOption);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appActiveState]);

  return (
    <div className={`p-5 bg-white ${styles.settings}`}>
      <div>
        <div className={styles.settings_dropdowns}>
          <div>
            <p className="d-inline-block mb-2">Table</p>
            {/* Toggle table view */}
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
            {/* Toggle table view */}
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

        {/* Insert custom settings */}
      </div>
    </div>
  );
};

export default PluginSettings;

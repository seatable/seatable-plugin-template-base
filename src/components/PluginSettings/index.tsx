import React, { useEffect, useState } from 'react';
import DtableSelect from '../Elements/dtable-select';
import styles from '../../styles/PluginSettings.module.scss';
import styles2 from '../../styles/Presets.module.scss';
import {
  SelectOption,
  IPluginSettingsProps,
} from '../../utils/Interfaces/PluginSettings.interface';
import { truncateTableName } from '../../utils/utils';
import { HiOutlineChevronDoubleRight } from 'react-icons/hi2';
import { SettingsOption } from '../../utils/types';
import intl from 'react-intl-universal';
// import en from '../../locale/lang/en';

// PluginSettings component for managing table and view options
const PluginSettings: React.FC<IPluginSettingsProps> = ({
  allTables,
  appActiveState,
  activeTableViews,
  isShowSettings,
  onToggleSettings,
  onTableOrViewChange,
}) => {
  // State variables for table and view options
  const [tableOptions, setTableOptions] = useState<SelectOption[]>();
  const [viewOptions, setViewOptions] = useState<SelectOption[]>();
  const [tableSelectedOption, setTableSelectedOption] = useState<SelectOption>();
  const [viewSelectedOption, setViewSelectedOption] = useState<SelectOption>();

  // Change options when active table or view changes
  useEffect(() => {
    const { activeTableView } = appActiveState;

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

    // Set selected options based on activeTable and activeTableView
    let tableSelectedOption = {
      value: appActiveState?.activeTable?._id!,
      label: appActiveState.activeTableName,
    };
    let viewSelectedOption = viewOptions.find((item) => item.value === activeTableView?._id);

    // Update state with new options and selected values
    setTableOptions(tableOptions);
    setTableSelectedOption(tableSelectedOption);
    setViewOptions(viewOptions);
    setViewSelectedOption(viewSelectedOption);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appActiveState]);

  return (
    <div className={`bg-white ${isShowSettings ? styles.settings : styles.settings_hide}`}>
      <div className="p-5">
        <div
          className={`d-flex align-items-center justify-content-between ${styles.settings_header}`}>
          <h4 className="m-0">{intl.get('settings_headline').d(`head`)}</h4>
          {/* <h4 className="m-0">{intl.get('settings_headline').d(`${en.settings_headline}`)}</h4> */}
          <button className={styles2.presets_uncollapse_btn2_settings} onClick={onToggleSettings}>
            <HiOutlineChevronDoubleRight />
          </button>
        </div>
        <div>
          <div className={styles.settings_dropdowns}>
            <div>
              {/* <p className="d-inline-block mb-2">{intl.get('table').d(`${en.table}`)}</p> */}
              <p className="d-inline-block mb-2">{intl.get('table').d(`table`)}</p>
              {/* Toggle table view */}
              <DtableSelect
                value={tableSelectedOption}
                options={tableOptions}
                onChange={(selectedOption: SelectOption) => {
                  let type = 'table' as SettingsOption;
                  onTableOrViewChange(type, selectedOption);
                }}
              />
            </div>

            <div>
              <p className="d-inline-block mb-2 mt-3">{intl.get('view').d(`view`)}</p>
              {/* <p className="d-inline-block mb-2 mt-3">{intl.get('view').d(`${en.view}/`)}</p> */}
              {/* Toggle table view */}
              <DtableSelect
                value={viewSelectedOption}
                options={viewOptions}
                onChange={(selectedOption: SelectOption) => {
                  let type = 'view' as SettingsOption;
                  onTableOrViewChange(type, selectedOption);
                }}
              />
            </div>
          </div>
          {/* Insert custom settings */}
        </div>
      </div>
    </div>
  );
};

export default PluginSettings;

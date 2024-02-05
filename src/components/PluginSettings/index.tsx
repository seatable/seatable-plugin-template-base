import React, { useEffect, useState } from 'react';
import DtableSelect from '../Elements/dtable-select';
import styles from '../../styles/PluginSettings.module.scss';
import {
  IDtableSelect,
  IPluginSettingsProps,
} from '../../utils/Interfaces/PluginSettings.interface';
import { truncateTableName } from '../../utils/helpers';

const PluginSettings: React.FC<IPluginSettingsProps> = ({
  subtables,
  tableViews,
  currentTableID,
  baseViewID,
  onBaseViewChange,
  onTableChange,
}) => {
  const [tableSelectedOption, setTableSelectedOption] = useState<IDtableSelect>();
  const [tableOptions, setTableOptions] = useState<IDtableSelect[]>();
  const [viewSelectedOption, setViewSelectedOption] = useState<IDtableSelect>();
  const [viewOptions, setViewOptions] = useState<IDtableSelect[]>();

  useEffect(() => {
    let tableOptions = subtables.map((item) => {
      let value = item._id;
      let label = truncateTableName(item.name);
      return { value, label };
    });

    let viewOptions = tableViews.map((item) => {
      let value = item._id;
      let label = truncateTableName(item.name);
      return { value, label };
    });

    let tableSelectedOption = tableOptions.find((item) => item.value === currentTableID);
    let viewSelectedOption = viewOptions.find((item) => item.value === baseViewID);

    setTableOptions(tableOptions);
    setTableSelectedOption(tableSelectedOption);
    setViewOptions(viewOptions);
    setViewSelectedOption(viewSelectedOption);
  }, [currentTableID, baseViewID]);

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
              onChange={onTableChange}
            />
          </div>

          <div>
            <p className="d-inline-block mb-2 mt-3">View</p>
            {/* toggle table view  */}
            <DtableSelect
              value={viewSelectedOption}
              options={viewOptions}
              onChange={onBaseViewChange}
            />
          </div>
        </div>

        {/* insert custom settings  */}
      </div>
    </div>
  );
};

export default PluginSettings;

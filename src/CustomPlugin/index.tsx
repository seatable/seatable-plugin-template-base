import React from 'react';
import styles from '../styles/custom-styles/CustomPlugin.module.scss';
import { ICustomPluginProps } from '../utils/Interfaces/CustomPlugin';
import { IPresetInfo } from '../utils/Interfaces/PluginPresets/Presets.interface';

const CustomPlugin: React.FC<ICustomPluginProps> = ({
  pluginPresets,
  appActiveState,
  activeViewRows,
}) => (
  <div className={styles.custom}>
    <div>Here are the listed presets for the plugin</div>
    <div className={styles.custom_presetList}>
      {pluginPresets.map((preset: IPresetInfo) => (
        <div key={preset._id} className={styles.custom_presetList_presetItem}>
          <div className={styles.custom_presetList_presetItem_presetInfo}>
            <span className={styles.custom_presetList_presetItem_presetInfo_presetId}>
              Preset ID:{' '}
            </span>
            <span>{preset._id}</span>
          </div>
          <div className={styles.custom_presetList_presetItem_presetInfo}>
            <span className={styles.custom_presetList_presetItem_presetInfo_presetName}>
              Preset Name:{' '}
            </span>
            <span>{preset.name}</span>
          </div>
          <div className={styles.custom_presetList_presetItem_presetInfo}>
            <span className={styles.custom_presetList_presetItem_presetInfo_presetName}>
              Selected Table:{' '}
            </span>
            <span>{preset.settings?.selectedTable?.label ?? 'N/A'} </span>
          </div>
          <div className={styles.custom_presetList_presetItem_presetInfo}>
            <span className={styles.custom_presetList_presetItem_presetInfo_presetName}>
              Selected View:{' '}
            </span>
            <span>{preset.settings?.selectedView?.label ?? 'N/A'} </span>
          </div>
        </div>
      ))}
    </div>
    <span>The Active Table and Active View of the selected Prest</span>
    <div className={styles.custom_activeInfo}>
      <div className={styles.custom_activeInfo_activeTable}>
        <span>{appActiveState.activeTableName}</span>
      </div>
      <div className={styles.custom_activeInfo_activeView}>
        <span>{appActiveState?.activeTableView?.name || 'N/A'}</span>
      </div>
    </div>
    <span>The Rows of the Active Table and Active View </span>
    <div className={styles.custom_filteredRows}>
      {activeViewRows?.map((row, index) => (
        <div key={index} className={styles.row}>
          <span className={styles.custom_filteredRows_row_rowNumber}>Row {index + 1}: </span>
          <span className={styles.custom_filteredRows_row_rowContent}>{row['0000']}</span>
        </div>
      ))}
    </div>
  </div>
);

export default CustomPlugin;

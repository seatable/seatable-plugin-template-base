import React, { useEffect, useState } from 'react';
import styles from '../../../styles/Modal.module.scss';
import stylesPresets from '../../../styles/Presets.module.scss';
import { IPresetDropdownProps } from '../../../utils/Interfaces/PluginPresets/Dropdown.interface';
import { PresetHandleAction } from '../../../utils/constants';
import intl from 'react-intl-universal';
// import en from '../../../locale/lang/en';

const PresetDropdown: React.FC<IPresetDropdownProps> = ({
  togglePresetsUpdatePopUp,
  dropdownRef,
  pluginPresets,
}) => {
  const isPresets = pluginPresets.length >= 2;

  return (
    <ul ref={dropdownRef} className={styles.preset_dropdown}>
      <li
        onClick={togglePresetsUpdatePopUp}
        id={PresetHandleAction.rename}
        className="d-flex align-items-center">
        <i className="item-icon dtable-font dtable-icon-rename"></i>
        {/* <p className="ml-2">{intl.get('preset_rename').d(`${en.preset_rename}`)}</p> */}
        <p className="ml-2">{intl.get('preset_rename').d(`rename`)}</p>
      </li>
      <li
        onClick={togglePresetsUpdatePopUp}
        id={PresetHandleAction.duplicate}
        className="d-flex align-items-center">
        <i className="item-icon dtable-font dtable-icon-copy"></i>
        {/* <p className="ml-2">{intl.get('preset_duplicate').d(`${en.preset_duplicate}`)}</p> */}
        <p className="ml-2">{intl.get('preset_duplicate').d(`duplicate`)}</p>
      </li>
      <li
        onClick={isPresets ? togglePresetsUpdatePopUp : undefined}
        id={PresetHandleAction.delete}
        className={`d-flex align-items-center ${isPresets ? 'clickable' : 'not-clickable'}`}
        style={{ pointerEvents: isPresets ? 'auto' : 'none' }}>
        <i
          className={`item-icon dtable-font dtable-icon-delete ${
            !isPresets ? stylesPresets.isPresetsCondition : ''
          }`}></i>
        <p className={`ml-2 ${!isPresets ? stylesPresets.isPresetsCondition : ''}`}>
          {intl.get('preset_delete').d(`delete`)}
          {/* {intl.get('preset_delete').d(`${en.preset_delete}`)} */}
        </p>
      </li>
    </ul>
  );
};

export default PresetDropdown;

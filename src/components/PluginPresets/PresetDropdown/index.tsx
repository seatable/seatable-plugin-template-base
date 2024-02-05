import React from 'react';
import styles from '../../../styles/Modal.module.scss';
import { IPresetDropdownProps } from '../../../utils/Interfaces/PluginPresets/Dropdown.interface';
import { PresetHandleAction } from '../../../utils/constants';

const PresetDropdown: React.FC<IPresetDropdownProps> = ({
  togglePresetsUpdatePopUp,
  dropdownRef,
}) => {
  return (
    <ul ref={dropdownRef} className={styles.preset_dropdown}>
      <li
        onClick={togglePresetsUpdatePopUp}
        id={PresetHandleAction.rename}
        className="d-flex align-items-center">
        <i className="item-icon dtable-font dtable-icon-rename"></i>
        <p className="ml-2">Rename Preset</p>
      </li>
      <li
        onClick={togglePresetsUpdatePopUp}
        id={PresetHandleAction.duplicate}
        className="d-flex align-items-center">
        <i className="item-icon dtable-font dtable-icon-copy"></i>
        <p className="ml-2">Duplicate Preset</p>
      </li>
      <li
        onClick={togglePresetsUpdatePopUp}
        id={PresetHandleAction.delete}
        className="d-flex align-items-center">
        <i className="item-icon dtable-font dtable-icon-delete"></i>
        <p className="ml-2">Delete Preset</p>
      </li>
    </ul>
  );
};

export default PresetDropdown;

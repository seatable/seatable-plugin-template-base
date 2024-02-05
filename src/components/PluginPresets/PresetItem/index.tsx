import React, { useEffect, useState } from 'react';
import { BsThreeDots } from 'react-icons/bs';

import styles from '../../../styles/Modal.module.scss';
import styles2 from '../../../styles/Presets.module.scss';
import '../../../assets/css/plugin-layout.css';

import PresetDropdown from '../PresetDropdown';
import useClickOut from '../../../hooks/useClickOut';
import { IPresetItemProps } from '../../../utils/Interfaces/PluginPresets/Item.interface';
import PresetInput from '../PresetInput';
import { PresetDropDownAction } from '../../../utils/constants';

const PresetItem: React.FC<IPresetItemProps> = ({
  v,
  activePresetIdx,
  presetName,
  pluginPresets,
  onChangePresetName,
  deletePreset,
  onSelectPreset,
  duplicatePreset,
  togglePresetsUpdate,
  onEditPresetSubmit,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showPresetDropdown, setShowPresetDropdown] = useState(false);

  let popupDomNode = useClickOut(() => {
    setShowPresetDropdown(false);
  });

  // toggle Preset dropdown(edit/delete)
  const togglePresetDropdown = () => {
    setShowPresetDropdown((prev) => !prev);
  };

  const editOnEnterKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onEditPresetSubmit();
    }
  };

  // Update a Preset
  const handlePresetsUpdate = (e: React.MouseEvent<HTMLElement>) => {
    const action = e.currentTarget.id;
    switch (action) {
      case PresetDropDownAction.delete:
        deletePreset();
        togglePresetDropdown();
        break;
      case PresetDropDownAction.rename:
        setIsEditing((prev) => !prev);
        togglePresetsUpdate(e, 'edit');
        togglePresetDropdown();
        setShowPresetDropdown(false);
        break;
      case PresetDropDownAction.duplicate:
        // duplicatePreset(`${v.name} copy`);
        duplicatePreset(v.name);
        setShowPresetDropdown(false);
        break;
      default:
    }
  };

  const onClickPreset = (e: React.MouseEvent<HTMLElement>) => {
    if (e.detail === 2) {
      handlePresetsUpdate(e);
    } else {
      onSelectPreset(v?._id);
    }
  };

  return (
    <div>
      <PresetInput
        onChangePresetName={onChangePresetName}
        onEditPresetSubmit={onEditPresetSubmit}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        presetName={presetName}
      />
      <div
        onClick={onClickPreset}
        style={{ display: isEditing ? 'none' : 'flex' }}
        className={
          pluginPresets[activePresetIdx]?._id === v?._id
            ? styles.modal_header_viewBtn_active
            : styles.modal_header_viewBtn
        }>
        <div className="d-flex align-items-center">
          <i className={`dtable-font dtable-icon-drag ${styles.modal_header_viewBtn_icons}`}></i>
          <p className="ml-2 mb-0">{v.name}</p>
        </div>
        <span onClick={togglePresetDropdown}>
          <BsThreeDots color="#191717" className={styles.modal_header_viewBtn_icons} />
        </span>
        {showPresetDropdown && (
          <PresetDropdown
            dropdownRef={popupDomNode}
            togglePresetsUpdatePopUp={handlePresetsUpdate}
          />
        )}
      </div>
    </div>
  );
};

export default PresetItem;
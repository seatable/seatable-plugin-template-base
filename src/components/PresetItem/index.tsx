import React, { useState } from 'react';
import { BsThreeDots } from 'react-icons/bs';

import styles from '../../styles/Modal.module.scss';
import styles2 from '../../styles/Presets.module.scss';
import '../../assets/css/plugin-layout.css';

import PresetDropdown from '../PresetDropdown';
import useClickOut from '../../hooks/useClickOut';
import { IPresetItemProps } from '../../utils/Interfaces/PresetItem.interface';

const PresetItem: React.FC<IPresetItemProps> = ({
  v,
  currentPresetIdx,
  presetName,
  pluginPresets,
  onChangePresetName,
  deletePreset,
  onSelectPreset,
  duplicatePreset,
  toggleNewPresetPopUp,
  onEditPresetSubmit,
  showEditPresetPopUp,
}) => {
  const [showPresetDropdown, setShowPresetDropdown] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  let editDomNode = useClickOut(() => {
    setIsEditing(false);
  });

  let popupDomNode = useClickOut(() => {
    setShowPresetDropdown(false);
  });

  // toggle Preset dropdown(edit/delete)
  const togglePresetDropdown = () => {
    setShowPresetDropdown((prev) => !prev);
  };

  // delete a Preset
  const onDeletePreset = () => {
    deletePreset();
    togglePresetDropdown();
  };

  // edit a Preset
  const onEditPreset = (e: React.MouseEvent<HTMLElement>) => {
    setIsEditing((prev) => !prev);
    setShowPresetDropdown(false);
    toggleNewPresetPopUp(e, 'edit');
  };

  const onDuplicatePreset = () => {
    duplicatePreset(`${v.name} copy`);
    setShowPresetDropdown(false);
  };

  const onClickPreset = (e: React.MouseEvent<HTMLElement>) => {
    if (e.detail === 2) {
      onEditPreset(e);
    } else {
      onSelectPreset(v?._id);
    }
  };

  const editOnEnterKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onEditPresetSubmit();
    }
  };

  return (
    <div>
      <div
        className={styles2.presets_input}
        ref={editDomNode}
        style={{ display: !isEditing ? 'none' : 'flex' }}>
        <input
          autoFocus
          value={presetName}
          onKeyDown={editOnEnterKeyPress}
          onChange={onChangePresetName}
        />
        <button onClick={onEditPresetSubmit}>
          <span className="dtable-font dtable-icon-check-mark"></span>
        </button>
        <button onClick={onEditPreset}>
          <span className="dtable-font dtable-icon-x btn-close"></span>
        </button>
      </div>

      <div
        onClick={onClickPreset}
        style={{ display: isEditing ? 'none' : 'flex' }}
        className={
          pluginPresets[currentPresetIdx]?._id === v?._id
            ? styles.modal_header_viewBtn_active
            : styles.modal_header_viewBtn
        }>
        <div className="d-flex align-items-center">
          <i className={`dtable-font dtable-icon-drag ${styles.modal_header_viewBtn_icons}`}></i>
          <p className="ml-2 mb-0"> {v.name}</p>
        </div>

        <span onClick={togglePresetDropdown}>
          <BsThreeDots color="#191717" className={styles.modal_header_viewBtn_icons} />
        </span>

        {showPresetDropdown && (
          <PresetDropdown
            dropdownRef={popupDomNode}
            deletePreset={onDeletePreset}
            toggleEditPresetPopUp={onEditPreset}
            duplicatePreset={onDuplicatePreset}
          />
        )}
      </div>
    </div>
  );
};

export default PresetItem;

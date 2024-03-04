import React, { useEffect, useState } from 'react';
import { BsThreeDots } from 'react-icons/bs';
// External dependencies
import useClickOut from '../../../hooks/useClickOut';
// Internal dependencies
import PresetDropdown from '../PresetDropdown';
import PresetInput from '../PresetInput';
// Constants
import { KeyDownActions, PresetHandleAction } from '../../../utils/constants';
// Interfaces
import { IPresetItemProps } from '../../../utils/Interfaces/PluginPresets/Item.interface';
// Styles
import styles from '../../../styles/Modal.module.scss';
import '../../../assets/css/plugin-layout.css';

const PresetItem: React.FC<IPresetItemProps> = ({
  p,
  activePresetIdx,
  presetName,
  pluginPresets,
  onChangePresetName,
  deletePreset,
  onSelectPreset,
  duplicatePreset,
  togglePresetsUpdate,
  onToggleSettings,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showPresetDropdown, setShowPresetDropdown] = useState(false);
  const [pName, setPName] = useState(p.name);

  useEffect(() => {
    if (p.name.length > 15) {
      setPName(p.name.slice(0, 15) + '...');
    }
  }, []);

  let popupDomNode = useClickOut(() => {
    setShowPresetDropdown(false);
  });

  // toggle Preset dropdown(edit/delete)
  const togglePresetDropdown = () => {
    setShowPresetDropdown((prev) => !prev);
  };

  // Update a Preset
  const handlePresetsUpdate = (e: React.MouseEvent<HTMLElement>) => {
    const action = e.currentTarget.id;
    switch (action) {
      case PresetHandleAction.delete:
        deletePreset();
        togglePresetDropdown();
        break;
      case PresetHandleAction.rename:
        setIsEditing((prev) => !prev);
        togglePresetsUpdate(e, PresetHandleAction.edit);
        togglePresetDropdown();
        setShowPresetDropdown(false);
        break;
      case PresetHandleAction.duplicate:
        duplicatePreset(p);
        setShowPresetDropdown(false);
        break;
      default:
    }
  };

  const onClickPreset = (e: React.MouseEvent<HTMLElement>) => {
    if (e.detail === 2) {
      handlePresetsUpdate(e);
    } else {
      onSelectPreset(p?._id);
    }
  };

  return (
    <div>
      <PresetInput
        onChangePresetName={onChangePresetName}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        presetName={presetName}
      />
      <div style={{ position: 'relative' }}>
        <div
          onClick={onClickPreset}
          style={{ display: isEditing ? 'none' : 'flex' }}
          className={
            pluginPresets[activePresetIdx]?._id === p?._id
              ? styles.modal_header_viewBtn_active
              : styles.modal_header_viewBtn
          }>
          <div className="d-flex align-items-center">
            <p className="mb-0">{pName}</p>
          </div>
          <span className="d-flex align-items-center">
            <span>
              <i
                className={`dtable-font dtable-icon-drag mx-1 ${styles.modal_header_viewBtn_icons}`}></i>
            </span>
            <span
              className={`dtable-font dtable-icon-set-up ${styles.modal_header_viewBtn_settings}`}
              onClick={onToggleSettings}></span>
            <BsThreeDots
              className={`mx-1 ${styles.modal_header_viewBtn_icons}`}
              onClick={togglePresetDropdown}
            />
          </span>
        </div>
        {showPresetDropdown && (
          <PresetDropdown
            dropdownRef={popupDomNode}
            pluginPresets={pluginPresets}
            togglePresetsUpdatePopUp={handlePresetsUpdate}
          />
        )}
      </div>
    </div>
  );
};

export default PresetItem;

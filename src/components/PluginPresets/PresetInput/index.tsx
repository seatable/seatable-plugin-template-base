import React, { useEffect, useState } from 'react';
import styles2 from '../../../styles/Presets.module.scss';
import { IPresetInput } from '../../../utils/Interfaces/PluginPresets/Input.interface';
import useClickOut from '../../../hooks/useClickOut';

const PresetInput: React.FC<IPresetInput> = ({
  onChangePresetName,
  onEditPresetSubmit,
  setIsEditing,
  isEditing,
  presetName,
}) => {
  const [_presetName, setPresetName] = useState('');

  useEffect(() => {
    setPresetName(presetName);
  }, [presetName]);

  let editDomNode = useClickOut(() => {
    setIsEditing(false);
  });

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onEditPresetSubmit();
    }
  };

  const onCheckMarkClick = () => {
    onEditPresetSubmit();
    setIsEditing(false);
  };

  const onBtnCloseClick = () => {
    onEditPresetSubmit();
    setIsEditing(false);
  };

  return (
    <div
      className={styles2.presets_input}
      ref={editDomNode}
      style={{ display: !isEditing ? 'none' : 'flex' }}>
      <input autoFocus value={_presetName} onKeyDown={onKeyDown} onChange={onChangePresetName} />
      <button onClick={onCheckMarkClick}>
        <span className="dtable-font dtable-icon-check-mark"></span>
      </button>
      <button onClick={onBtnCloseClick}>
        <span className="dtable-font dtable-icon-x btn-close"></span>
      </button>
    </div>
  );
};

export default PresetInput;

import React, { useEffect, useRef, useState } from 'react';
import styles2 from '../../../styles/Presets.module.scss';
import { IPresetInput } from '../../../utils/Interfaces/PluginPresets/Input.interface';
import useClickOut from '../../../hooks/useClickOut';
import { KeyDownActions } from '../../../utils/constants';

const PresetInput: React.FC<IPresetInput> = ({
  onChangePresetName,
  setIsEditing,
  isEditing,
  presetName,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [_presetName, setPresetName] = useState('');
  const [blurCausedByKeyDown, setBlurCausedByKeyDown] = useState(false);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      setPresetName(presetName);
      inputRef.current.focus();
      setTimeout(() => {
        inputRef?.current?.select();
      }, 0);
    }
  }, [isEditing]);

  const onChangePresetNameSubmit = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPresetName(e.target.value);
  };

  let editDomNode = useClickOut(() => {
    setIsEditing(false);
  });

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === KeyDownActions.enter) {
      onChangePresetName(e);
    } else if (e.key === KeyDownActions.escape) {
      setBlurCausedByKeyDown(true);
      setIsEditing(false);
    }
  };

  const handleFocusOut = (e: React.FormEvent<HTMLInputElement>) => {
    if (!blurCausedByKeyDown) {
      onChangePresetName(e);
    }

    setBlurCausedByKeyDown(false);
  };

  return (
    <div
      className={styles2.presets_input}
      ref={editDomNode}
      style={{ display: !isEditing ? 'none' : 'flex' }}>
      <input
        id="select-input"
        ref={inputRef}
        value={_presetName}
        onKeyDown={onKeyDown}
        onChange={onChangePresetNameSubmit}
        onBlur={handleFocusOut}
      />
    </div>
  );
};

export default PresetInput;

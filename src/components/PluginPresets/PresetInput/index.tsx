import React, { useEffect, useRef, useState } from 'react';
import styles2 from '../../../styles/Presets.module.scss';
import { IPresetInput } from '../../../utils/Interfaces/PluginPresets/Input.interface';
import useClickOut from '../../../hooks/useClickOut';
import { KeyDownActions } from '../../../utils/constants';

const PresetInput: React.FC<IPresetInput> = ({
  onChangePresetName,
  onEditPresetSubmit,
  setIsEditing,
  isEditing,
  presetName,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [_presetName, setPresetName] = useState('');

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      setTimeout(() => {
        inputRef?.current?.select();
      }, 0);
    }
  }, [isEditing]);

  useEffect(() => {
    setPresetName(presetName);
  }, [presetName]);

  let editDomNode = useClickOut(() => {
    !isEditing
      ? setIsEditing(false)
      : (() => {
          setIsEditing(false);
          onEditPresetSubmit();
        })();
  });

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === KeyDownActions.enter) {
      onEditPresetSubmit();
    } else if (e.key === KeyDownActions.escape) {
      setIsEditing(false);
    }
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
        onChange={onChangePresetName}
      />
    </div>
  );
};

export default PresetInput;

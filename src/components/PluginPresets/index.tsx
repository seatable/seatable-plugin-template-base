import React, { useEffect, useState } from 'react';
import PresetItem from '../PresetItem/index';
import styles from '../../styles/Presets.module.scss';
import deepCopy from 'deep-copy';
import Preset from '../../model/preset';
import { IPresetsProps, PresetsArray } from '../../utils/Interfaces/PluginPresets.interface';
import { generatorPresetId } from '../../utils/utils';
import { DEFAULT_PRESET_SETTINGS, TABLE_NAME } from '../../utils/constants';
import { TableArray, TableColumn } from '../../utils/Interfaces/Table.interface';

const PluginPresets: React.FC<IPresetsProps> = ({
  pluginPresets,
  onSelectPreset,
  currentPresetIdx,
  pluginSettings,
  updatePresets,
  setTogglePresetsComponent,
}) => {
  const [dragItemIndex, setDragItemIndex] = useState<number | null>(null);
  const [dragOverItemIndex, setDragOverItemIndex] = useState<number | null>(null);
  const [presetName, setPresetName] = useState('');
  const [_pluginPresets, setPluginPresets] = useState<PresetsArray>([]);
  const [showNewPresetPopUp, setShowNewPresetPopUp] = useState<boolean>(false);
  const [showEditPresetPopUp, setShowEditPresetPopUp] = useState<boolean>(false);

  useEffect(() => {
    setPluginPresets(pluginPresets);
  }, [pluginPresets]);

  const getSelectedTable = (tables: TableArray, settings: any = {}) => {
    let selectedTable = window.dtableSDK.getTableByName(settings[TABLE_NAME]);
    if (!selectedTable) {
      return tables[0];
    }
    return selectedTable;
  };

  const initOrgChartSetting = (settings = {}) => {
    let initUpdated = {};
    let tables = window.dtableSDK.getTables();
    let selectedTable = getSelectedTable(tables, settings);
    let titleColumn = selectedTable.columns.find((column: TableColumn) => column.key === '0000');
    let imageColumn = selectedTable.columns.find((column: TableColumn) => column.type === 'image');
    let imageName = imageColumn ? imageColumn.name : null;
    let titleName = titleColumn ? titleColumn.name : null;
    initUpdated = Object.assign(
      {},
      { shown_image_name: imageName },
      { shown_title_name: titleName }
    );
    return initUpdated;
  };

  // handle preset name change
  const onChangePresetName = (e: React.FormEvent<HTMLInputElement>) => {
    setPresetName(e.currentTarget.value);
  };

  // handle add/edit preset functionality
  const onNewPresetSubmit = (e?: React.MouseEvent<HTMLElement>, type?: 'edit') => {
    if (type === 'edit') {
      editPreset(presetName);
      setPresetName('');
      setShowEditPresetPopUp(false);
    } else {
      addPreset(presetName);
      setPresetName('');
      setShowNewPresetPopUp(false);
    }
  };

  // toggle new/edit preset popup display
  const toggleNewPresetPopUp = (e?: React.MouseEvent<HTMLElement>, type?: 'edit') => {
    if (type === 'edit') {
      // const presetName = pluginPresets.find((v, i) => i === currentPresetIdx).name;
      const presetName = pluginPresets[currentPresetIdx]?.name;
      setPresetName(presetName);
      setShowEditPresetPopUp((prev) => !prev);
    } else {
      setShowNewPresetPopUp((prev) => !prev);
    }
  };

  // add new preset
  const addPreset = (presetName: string) => {
    let currentPresetIdx = pluginPresets.length;
    let _id: string = generatorPresetId(pluginPresets) || '';
    let newPreset = new Preset({ _id, name: presetName });
    let newPresetsArray = deepCopy(pluginPresets);
    newPresetsArray.push(newPreset);

    let initUpdated = initOrgChartSetting();
    newPresetsArray[currentPresetIdx].settings = Object.assign(
      DEFAULT_PRESET_SETTINGS,
      initUpdated
    );
    pluginSettings.presets = newPresetsArray;

    updatePresets(currentPresetIdx, newPresetsArray, pluginSettings);
  };

  // duplicate a preset
  const duplicatePreset = (name: string) => {
    addPreset(name);
  };

  // edit preset name
  const editPreset = (presetName: string) => {
    let newPresets = deepCopy(pluginPresets);
    let oldPreset = pluginPresets[currentPresetIdx];
    let _id: string = generatorPresetId(pluginPresets) || '';
    let updatedPreset = new Preset({ ...oldPreset, _id, name: presetName });

    newPresets.splice(currentPresetIdx, 1, updatedPreset);
    pluginSettings.presets = newPresets;

    updatePresets(currentPresetIdx, newPresets, pluginSettings);
  };

  // delete preset
  const deletePreset = () => {
    let newPresets = deepCopy(pluginPresets);
    newPresets.splice(currentPresetIdx, 1);
    if (currentPresetIdx >= newPresets.length) {
      currentPresetIdx = newPresets.length - 1;
    }
    pluginSettings.presets = newPresets;

    updatePresets(0, newPresets, pluginSettings);
  };

  // drag and drop logic
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    setDragItemIndex(index);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    setDragOverItemIndex(index);
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>, v_id: string) => {
    const __pluginPresets = [...pluginPresets];
    if (dragItemIndex !== null && dragOverItemIndex !== null) {
      const dragItem = __pluginPresets.splice(dragItemIndex, 1)[0];
      __pluginPresets.splice(dragOverItemIndex, 0, dragItem);
      setPluginPresets(__pluginPresets);
      setDragItemIndex(null);
      setDragOverItemIndex(null);
      let _pluginSettings = { ...pluginSettings, presets: __pluginPresets };

      updatePresets(currentPresetIdx, __pluginPresets, _pluginSettings);
    }
  };

  const addOnEnterKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onNewPresetSubmit();
    }
  };

  return (
    <div
      style={setTogglePresetsComponent ? { display: 'block' } : {}}
      className={`${styles.presets}`}>
      <div className="d-flex flex-column">
        {pluginPresets?.map((v, i) => (
          <div
            style={
              dragOverItemIndex === i && i === 0
                ? { borderTop: '2px solid #A9A9A9' }
                : dragOverItemIndex === i
                  ? { borderBottom: '2px solid #A9A9A9' }
                  : {}
            }
            key={v._id}
            draggable
            onDragStart={(e) => handleDragStart(e, i)}
            onDragEnter={(e) => handleDragEnter(e, i)}
            onDragEnd={(e) => handleDragEnd(e, v._id)}
            onDragOver={handleDragOver}>
            <PresetItem
              v={v}
              currentPresetIdx={currentPresetIdx}
              presetName={presetName}
              pluginPresets={pluginPresets}
              onChangePresetName={onChangePresetName}
              onSelectPreset={onSelectPreset}
              deletePreset={deletePreset}
              duplicatePreset={duplicatePreset}
              toggleNewPresetPopUp={toggleNewPresetPopUp}
              onEditPresetSubmit={(e?: React.MouseEvent<HTMLElement>) =>
                onNewPresetSubmit(e, 'edit')
              }
              showEditPresetPopUp={showEditPresetPopUp}
            />
          </div>
        ))}
      </div>
      {/* add new preset input  */}
      {showNewPresetPopUp && (
        <div className={styles.presets_input}>
          <input
            autoFocus
            value={presetName}
            onKeyDown={addOnEnterKeyPress}
            onChange={onChangePresetName}
          />
          <button onClick={onNewPresetSubmit}>
            <span className="dtable-font dtable-icon-check-mark"></span>
          </button>
          <button onClick={toggleNewPresetPopUp}>
            <span className="dtable-font dtable-icon-x btn-close"></span>
          </button>
        </div>
      )}
      {/* add new preset button  */}
      {!showNewPresetPopUp && (
        <button onClick={toggleNewPresetPopUp} className={styles.presets_add_button}>
          <i className="dtable-font dtable-icon-add-table"></i>
        </button>
      )}
    </div>
  );
};

export default PluginPresets;

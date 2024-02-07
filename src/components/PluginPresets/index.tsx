import React, { useEffect, useState } from 'react';
import { getTableByName } from 'dtable-utils';
import PresetItem from './PresetItem/index';
import styles from '../../styles/Presets.module.scss';
import deepCopy from 'deep-copy';
import Preset from '../../model/preset';
import {
  IPresetsProps,
  PresetSettings,
  PresetsArray,
} from '../../utils/Interfaces/PluginPresets/Presets.interface';
<<<<<<< HEAD
import { generatorPresetId, isUniquePresetName } from '../../utils/utils';
import { DEFAULT_PLUGIN_SETTINGS, PresetHandleAction, TABLE_NAME } from '../../utils/constants';
=======
import { appendPresetSuffix, generatorPresetId, isPresetNameAlreadyExists } from '../../utils/utils';
import {
  DEFAULT_PLUGIN_SETTINGS,
  DEFAULT_PRESET_SETTINGS,
  TABLE_NAME,
} from '../../utils/constants';
>>>>>>> 01_TB-dev
import { TableArray, TableColumn } from '../../utils/Interfaces/Table.interface';
import PresetInput from './PresetInput';
import useClickOut from '../../hooks/useClickOut';
import { createDefaultPresetSettings } from '../../utils/helpers';
import { AppActiveState } from '../../utils/Interfaces/App.interface';

const PluginPresets: React.FC<IPresetsProps> = ({
  allTables,
  pluginPresets,
  activePresetIdx,
  pluginSettings,
  isShowPresets,
  onSelectPreset,
  updatePresets,
}) => {
  const [dragItemIndex, setDragItemIndex] = useState<number | null>(null);
  const [dragOverItemIndex, setDragOverItemIndex] = useState<number | null>(null);
  const [presetName, setPresetName] = useState('');
  const [presetNameAlreadyExists, setPresetNameAlreadyExists] = useState(false);
  const [_pluginPresets, setPluginPresets] = useState<PresetsArray>([]);
  const [showNewPresetPopUp, setShowNewPresetPopUp] = useState<boolean>(false);
  const [showEditPresetPopUp, setShowEditPresetPopUp] = useState<boolean>(false);

  useEffect(() => {
    setPluginPresets(pluginPresets);
  }, [pluginPresets]);

  const getSelectedTable = (tables: TableArray, settings: any = {}) => {
    let selectedTable = getTableByName(settings[TABLE_NAME]);
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

  useClickOut(() => {
    setPresetNameAlreadyExists(false);
  });

  // Submit new/edited preset name
  const onNewPresetSubmit = (e?: React.MouseEvent<HTMLElement>, type?: string) => {
    let _presetName =
      presetName ||
      DEFAULT_PLUGIN_SETTINGS.presets[0].name +
        ' ' +
        (type === 'edit' ? _pluginPresets.length : _pluginPresets.length + 1);
    const isUnique = isUniquePresetName(_presetName, _pluginPresets, activePresetIdx);

    if (isUnique && type === PresetHandleAction.new) {
      _presetName += ' New';
      setPresetNameAlreadyExists(false);
    } else if (isUnique) {
      setPresetNameAlreadyExists(true);
      return;
    }

    if (type === PresetHandleAction.edit) {
      editPreset(_presetName);
    } else {
      addPreset(type || PresetHandleAction.new, _presetName);
      setShowNewPresetPopUp(false);
    }

    setPresetName('');
    setShowEditPresetPopUp(type === PresetHandleAction.edit ? false : true);
  };

  // Toggle input field for add/edit preset
  const togglePresetsUpdate = (e?: React.MouseEvent<HTMLElement>, type?: string) => {
    if (type === PresetHandleAction.edit) {
      const presetName = pluginPresets[activePresetIdx]?.name;
      setPresetName(presetName);
      setShowEditPresetPopUp((prev) => !prev);
    } else {
      setPresetName('');
      setShowNewPresetPopUp((prev) => !prev);
    }
  };

  // add new/duplicate preset
  const addPreset = (
    type: string,
    presetName: string,
    option?: { pId: string; pSettings: PresetSettings }
  ) => {
    console.log('addPreset called', type);
    let _presetSettings: PresetSettings =
      type === PresetHandleAction.new
        ? createDefaultPresetSettings(allTables)
        : type === PresetHandleAction.duplicate && option?.pSettings
          ? option.pSettings
          : {};

    setPluginPresets(_pluginPresets || []);
    let _activePresetIdx = _pluginPresets?.length;
    let _id: string = generatorPresetId(pluginPresets) || '';
    let newPreset = new Preset({ _id, name: presetName });
    let newPresetsArray = deepCopy(_pluginPresets);
    newPresetsArray.push(newPreset);
    let initUpdated = initOrgChartSetting();
    newPresetsArray[_activePresetIdx].settings = Object.assign(_presetSettings, initUpdated);
    pluginSettings.presets = newPresetsArray;
    updatePresets(_activePresetIdx, newPresetsArray, pluginSettings, _id);

    // Update active state info
    const newPresetActiveState: AppActiveState = {
      activePresetId: _id,
      activePresetIdx: _activePresetIdx,
      activeTable: allTables[0],
      activeTableName: newPresetsArray[_activePresetIdx]?.settings?.selectedTable?.label!,
      activeTableView: allTables[0].views[0],
    };

    if (type !== PresetHandleAction.duplicate) {
      onSelectPreset(_id, newPresetActiveState);
    }
  };

  // Duplicate a preset
  const duplicatePreset = (p: any) => {
    // anytofix
    const { name, _id, settings } = p;
    addPreset(PresetHandleAction.duplicate, `${name} copy`, { pId: _id, pSettings: settings });
  };

  // edit preset name
  const editPreset = (presetName: string) => {
    let newPluginPresets = deepCopy(pluginPresets);
    let oldPreset = pluginPresets[activePresetIdx];
    let _id: string = generatorPresetId(pluginPresets) || '';
    let updatedPreset = new Preset({ ...oldPreset, _id, name: presetName });

    newPluginPresets.splice(activePresetIdx, 1, updatedPreset);
    pluginSettings.presets = newPluginPresets;

    updatePresets(activePresetIdx, newPluginPresets, pluginSettings, PresetHandleAction.edit);
  };

  // Delete the selected Preset
  const deletePreset = () => {
    let newPluginPresets = deepCopy(pluginPresets);
    newPluginPresets.splice(activePresetIdx, 1);
    if (activePresetIdx >= newPluginPresets.length) {
      activePresetIdx = newPluginPresets.length - 1;
    }
    pluginSettings.presets = newPluginPresets;
    updatePresets(0, newPluginPresets, pluginSettings, PresetHandleAction.delete);
  };

  // drag and drop logic
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.stopPropagation();
    setDragItemIndex(index);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.stopPropagation();
    setDragOverItemIndex(index);
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>, v_id: string) => {
    e.stopPropagation();
    e.preventDefault();

    const __pluginPresets = [...pluginPresets];
    if (dragItemIndex !== null && dragOverItemIndex !== null) {
      const dragItem = __pluginPresets.splice(dragItemIndex, 1)[0];
      __pluginPresets.splice(dragOverItemIndex, 0, dragItem);
      setPluginPresets(__pluginPresets);
      setDragItemIndex(null);
      setDragOverItemIndex(null);
      let _pluginSettings = { ...pluginSettings, presets: __pluginPresets };

      updatePresets(activePresetIdx, __pluginPresets, _pluginSettings, 'drag');
    }
  };

  return (
    <div style={isShowPresets ? { display: 'block' } : {}} className={`${styles.presets}`}>
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
            draggable="true"
            onDragStart={(e) => handleDragStart(e, i)}
            onDragEnter={(e) => handleDragEnter(e, i)}
            onDragEnd={(e) => handleDragEnd(e, v._id)}
            onDragOver={handleDragOver}>
            <PresetItem
              v={v}
              activePresetIdx={activePresetIdx}
              presetName={presetName}
              pluginPresets={pluginPresets}
              onChangePresetName={onChangePresetName}
              onSelectPreset={onSelectPreset}
              deletePreset={deletePreset}
              duplicatePreset={duplicatePreset}
              togglePresetsUpdate={togglePresetsUpdate}
              onEditPresetSubmit={(e?: React.MouseEvent<HTMLElement>) =>
                onNewPresetSubmit(e, PresetHandleAction.edit)
              }
              showEditPresetPopUp={showEditPresetPopUp}
            />
          </div>
        ))}
      </div>
      {/* add new preset input  */}
      {showNewPresetPopUp && (
        <PresetInput
          onChangePresetName={onChangePresetName}
          onEditPresetSubmit={(e?: React.MouseEvent<HTMLElement>) =>
            onNewPresetSubmit(e, PresetHandleAction.new)
          }
          isEditing={showNewPresetPopUp}
          setIsEditing={setShowNewPresetPopUp}
          presetName={presetName}
        />
      )}
      {/* add new preset button  */}
      {!showNewPresetPopUp && (
        <button
          onClick={(e) => togglePresetsUpdate(e, PresetHandleAction.new)}
          className={styles.presets_add_button}>
          <i className="dtable-font dtable-icon-add-table"></i>
        </button>
      )}
      {presetNameAlreadyExists && (
        <div className="error-message d-flex justify-content-center mt-9">
          <span className="alert-danger">There is another preset with this name</span>
        </div>
      )}
    </div>
  );
};

export default PluginPresets;

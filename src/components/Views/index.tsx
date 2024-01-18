import React, { useEffect, useState } from 'react';
import ViewItem from '../ViewItem/index';
import styles from '../../styles/Views.module.scss';
import deepCopy from 'deep-copy';
import View from '../../model/view';
import { IViewsProps } from '../../utils/Interfaces/Views.interface';
import { generatorViewId } from '../../utils/utils';
import { TABLE_NAME } from '../../constants/setting-key';

const Views: React.FC<IViewsProps> = ({
  allViews,
  onSelectView,
  currentViewIdx,
  plugin_settings,
  updateViews,
  toggleViewComponent
}) => {
  const [dragItemIndex, setDragItemIndex] = useState<number | null>(null);
  const [dragOverItemIndex, setDragOverItemIndex] = useState<number | null>(null);
  const [viewName, setViewName] = useState('');
  const [_allViews, setAllViews] = useState<any[]>([]);
  const [showNewViewPopUp, setShowNewViewPopUp] = useState<boolean>(false);
  const [showEditViewPopUp, setShowEditViewPopUp] = useState<boolean>(false);

  useEffect(() => {
    setAllViews(allViews);
  }, [allViews]);

  const getSelectedTable = (tables: any, settings: any = {}) => {
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
    let titleColumn = selectedTable.columns.find((column: any) => column.key === '0000');
    let imageColumn = selectedTable.columns.find((column: any) => column.type === 'image');
    let imageName = imageColumn ? imageColumn.name : null;
    let titleName = titleColumn ? titleColumn.name : null;
    initUpdated = Object.assign(
      {},
      { shown_image_name: imageName },
      { shown_title_name: titleName }
    );
    return initUpdated;
  };

  // handle view name change
  const onViewNameChange = (e: React.FormEvent<HTMLInputElement>) => {
    setViewName(e.currentTarget.value);
  };

  // handle add/edit view functionality
  const onNewViewSubmit = (e?: React.MouseEvent<HTMLElement>, type?: 'edit') => {
    if (type === 'edit') {
      editView(viewName);
      setViewName('');
      setShowEditViewPopUp(false);
    } else {
      addView(viewName);
      setViewName('');
      setShowNewViewPopUp(false);
    }
  };

  // toggle new/edit view popup display
  const toggleNewViewPopUp = (e?: React.MouseEvent<HTMLElement>, type?: 'edit') => {
    if (type === 'edit') {
      const viewName = allViews.find((v, i) => i === currentViewIdx).name;
      setViewName(viewName);
      setShowEditViewPopUp((prev) => !prev);
    } else {
      setShowNewViewPopUp((prev) => !prev);
    }
  };

  // add new view
  const addView = (viewName: string) => {
    let currentViewIdx = allViews.length;
    let _id: string = generatorViewId(allViews) || '';
    let newView = new View({ _id, name: viewName });
    let newViews = deepCopy(allViews);
    newViews.push(newView);

    let initUpdated = initOrgChartSetting();
    newViews[currentViewIdx].settings = Object.assign({}, initUpdated);
    plugin_settings.views = newViews;

    updateViews(currentViewIdx, newViews, plugin_settings);
  };

  // duplicate a view
  const duplicateView = (name: string) => {
    addView(name);
  };

  // edit view name
  const editView = (viewName: string) => {
    let newViews = deepCopy(allViews);
    let oldView = allViews[currentViewIdx];
    let _id: string = generatorViewId(allViews) || '';
    let updatedView = new View({ ...oldView, _id, name: viewName });

    newViews.splice(currentViewIdx, 1, updatedView);
    plugin_settings.views = newViews;

    updateViews(currentViewIdx, newViews, plugin_settings);
  };

  // delete view
  const deleteView = () => {
    let newViews = deepCopy(allViews);
    newViews.splice(currentViewIdx, 1);
    if (currentViewIdx >= newViews.length) {
      currentViewIdx = newViews.length - 1;
    }
    plugin_settings.views = newViews;

    updateViews(0, newViews, plugin_settings);
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
    const __allViews = [...allViews];
    if (dragItemIndex !== null && dragOverItemIndex !== null) {
      const dragItem = __allViews.splice(dragItemIndex, 1)[0];
      __allViews.splice(dragOverItemIndex, 0, dragItem);
      setAllViews(__allViews);
      setDragItemIndex(null);
      setDragOverItemIndex(null);
      let _plugin_settings = { ...plugin_settings, views: __allViews };

      updateViews(currentViewIdx, __allViews, _plugin_settings);
    }
  };

  const addOnEnterKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onNewViewSubmit()
    }
  }

  return (
    <div style={toggleViewComponent ? { display: "block"} : {}} className={`${styles.views}`}>
      <div className="d-flex flex-column">
        {allViews?.map((v, i) => (
          <div
            style={dragOverItemIndex === i ? { borderTop: '2px solid #A9A9A9' } : {}}
            key={v._id}
            draggable
            onDragStart={(e) => handleDragStart(e, i)}
            onDragEnter={(e) => handleDragEnter(e, i)}
            onDragEnd={(e) => handleDragEnd(e, v._id)}
            onDragOver={handleDragOver}>
            <ViewItem
              v={v}
              onSelectView={onSelectView}
              allViews={allViews}
              currentViewIdx={currentViewIdx}
              toggleNewViewPopUp={toggleNewViewPopUp}
              deleteView={deleteView}
              viewName={viewName}
              onViewNameChange={onViewNameChange}
              onEditViewSubmit={(e?: React.MouseEvent<HTMLElement>) => onNewViewSubmit(e, 'edit')}
              showEditViewPopUp={showEditViewPopUp}
              duplicateView={duplicateView}
            />
          </div>
        ))}
      </div>
      {/* add new view input  */}
      {showNewViewPopUp && (
        <div className={styles.views_input}>
          <input autoFocus value={viewName} onKeyDown={addOnEnterKeyPress} onChange={onViewNameChange} />
          <button onClick={onNewViewSubmit}>
            <span className="dtable-font dtable-icon-check-mark"></span>
          </button>
          <button onClick={toggleNewViewPopUp}>
            <span className="dtable-font dtable-icon-x btn-close"></span>
          </button>
        </div>
      )}
      {/* add new view button  */}
      {!showNewViewPopUp && (
        <button onClick={toggleNewViewPopUp} className={styles.views_add_button}>
          <i className="dtable-font dtable-icon-add-table"></i>
        </button>
      )}
    </div>
  );
};

export default Views;

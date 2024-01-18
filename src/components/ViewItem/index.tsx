import React, { Component, useEffect, useRef, useState } from 'react';
import styles from '../../styles/Modal.module.scss';
import styles2 from '../../styles/Views.module.scss';
import '../../assets/css/plugin-layout.css';
import { BsThreeDots } from 'react-icons/bs';
import ViewDropdown from '../ViewDropdown/index';
import { IViewItemProps } from '../../utils/Interfaces/ViewItem.interfaces';

const ViewItem: React.FC<IViewItemProps> = ({
  v,
  allViews,
  currentViewIdx,
  viewName,
  onViewNameChange,
  deleteView,
  onSelectView,
  duplicateView,
  toggleNewViewPopUp,
  onEditViewSubmit,
}) => {
  const [showViewDropdown, setShowViewDropdown] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const popupRef = useRef<any>();

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const handleOutsideClick = (event: any) => {
    if (popupRef?.current && !popupRef.current.contains(event.target)) {
      // Click outside the popup, close it
      setShowViewDropdown(false);
    }
  };

  // toggle view dropdown(edit/delete)
  const toggleViewDropdown = () => {
    setShowViewDropdown((prev) => !prev);
  };

  // delete a view
  const onDeleteView = () => {
    deleteView();
    toggleViewDropdown();
  };

  // edit a view
  const onEditView = (e: React.MouseEvent<HTMLElement>) => {
    setIsEditing((prev) => !prev);
    setShowViewDropdown(false);
    toggleNewViewPopUp(e, 'edit');
  };

  const onDuplicateView = () => {
    duplicateView(`${v.name} copy`);
    setShowViewDropdown(false);
  };

  const onClickView = (e: React.MouseEvent<HTMLElement>) => {
    if (e.detail === 2) {
      onDuplicateView();
    } else {
      onSelectView(v?._id);
    }
  };

  return (
    <div>
      <div className={styles2.views_input} style={{ display: !isEditing ? 'none' : 'flex' }}>
        <input autoFocus value={viewName} onChange={onViewNameChange} />
        <button onClick={(e) => onEditViewSubmit(e, 'edit')}>
          <span className="dtable-font dtable-icon-check-mark"></span>
        </button>
        <button onClick={onEditView}>
          <span className="dtable-font dtable-icon-x btn-close"></span>
        </button>
      </div>

      <div
        onClick={onClickView}
        style={{ display: isEditing ? 'none' : 'flex' }}
        className={
          allViews[currentViewIdx]?._id === v?._id
            ? styles.modal_header_viewBtn_active
            : styles.modal_header_viewBtn
        }>
        <div className="d-flex align-items-center">
          <i className={`dtable-font dtable-icon-drag ${styles.modal_header_viewBtn_icons}`}></i>
          <p className="ml-2 mb-0"> {v.name}</p>
        </div>

        <span onClick={toggleViewDropdown}>
          <BsThreeDots color="#191717" className={styles.modal_header_viewBtn_icons} />
        </span>

        {showViewDropdown && (
          <ViewDropdown
            dropdownRef={popupRef}
            deleteView={onDeleteView}
            toggleEditViewPopUp={onEditView}
            duplicateView={onDuplicateView}
          />
        )}
      </div>
    </div>
  );
};

export default ViewItem;

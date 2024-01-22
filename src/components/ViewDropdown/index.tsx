import React from 'react';
import styles from '../../styles/Modal.module.scss';
import { IViewDropdownProps } from '../../utils/Interfaces/ViewDropdown.interface';

const ViewDropdown: React.FC<IViewDropdownProps> = ({
  deleteView,
  toggleEditViewPopUp,
  duplicateView,
  dropdownRef,
}) => {
  return (
    <ul ref={dropdownRef} className={styles.view_dropdown}>
      <li onClick={toggleEditViewPopUp} className="d-flex align-items-center">
        <i className="item-icon dtable-font dtable-icon-rename"></i>
        <p className="ml-2">Rename View</p>
      </li>
      <li onClick={duplicateView} className="d-flex align-items-center">
        <i className="item-icon dtable-font dtable-icon-copy"></i>
        <p className="ml-2">Duplicate View</p>
      </li>
      <li onClick={deleteView} className="d-flex align-items-center">
        <i className="item-icon dtable-font dtable-icon-delete"></i>
        <p className="ml-2">Delete View</p>
      </li>
    </ul>
  );
};

export default ViewDropdown;

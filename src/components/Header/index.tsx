import React, { useState, useEffect } from 'react';
import styles from '../../styles/Modal.module.scss';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { IHeaderProps } from '../../utils/Interfaces/Header.interface';
import { PLUGIN_ICON, PLUGIN_ID, PLUGIN_NAME } from '../../constants';
import { compareLoose } from 'semver';

const Header: React.FC<IHeaderProps> = (props) => {
  const { showSettings, toggleSettings, togglePlugin } = props;
  const [orgChartContent, setOrgChartContent] = useState<string | null>(null);

  useEffect(() => {
    const input = document.getElementById('org_chart');
    if (input) {
      setOrgChartContent(input.innerHTML);
    }
  }, []);

  const printPdfDocument = () => {
    const originalContents = document.body.innerHTML;
    // document.body.innerHTML = orgChartContent || '';
    window.print();
    // document.body.innerHTML = originalContents;
  };

  const downloadPdfDocument = () => {
    const input = document.getElementById(PLUGIN_ID);
    if (input) {
      html2canvas(input, {
        logging: true,
        allowTaint: false,
        useCORS: true,
      }).then((canvas: any) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('l', 'mm', 'a4', true);
        pdf.addImage(imgData, 'JPEG', 0, 0, 230, 200);
        pdf.save(`${PLUGIN_ID} .pdf`);
      });
    }
  };

  return (
    <div className={styles.modal_header}>
      {/* logo and plugin name  */}
      <div className="d-flex align-items-center">
        <button className={styles.modal_header_viewBtn_menu} onClick={props.toggleView}>
          <span className="dtable-font dtable-icon-menu"></span>
        </button>
        <div className={`bg-info py-1 px-2 rounded mr-2 ${styles.modal_header_logo}`}>
          <PLUGIN_ICON size={16} color="#fff" />
        </div>
        <p className={styles.modal_header_name}>{PLUGIN_NAME}</p>
      </div>

      {/* settings and close icons  */}
      <div
        className={`d-flex align-items-center justify-content-end ${styles.modal_header_settings}`}>
        <button className={styles.modal_header_icon_btn} onClick={downloadPdfDocument}>
          <span className="dtable-font dtable-icon-download"></span>
        </button>
        <button className={styles.modal_header_icon_btn} onClick={printPdfDocument}>
          <span className="dtable-font dtableprint-icon"></span>
        </button>
        <button
          className={`${styles.modal_header_icon_btn} ${
            showSettings ? styles.modal_header_icon_btn_active : ''
          }`}
          onClick={toggleSettings}>
          <span className="dtable-font dtable-icon-set-up"></span>
          {showSettings && <p>Settings</p>}
        </button>
        <button className={styles.modal_header_icon_btn} onClick={togglePlugin}>
          <span className="dtable-font dtable-icon-x btn-close"></span>
        </button>
      </div>
    </div>
  );
};

export default Header;

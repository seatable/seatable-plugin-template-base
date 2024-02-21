import React, { useState, useEffect } from 'react';
import styles from '../../styles/Modal.module.scss';
import styles2 from '../../styles/Presets.module.scss';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { IHeaderProps } from '../../utils/Interfaces/Header.interface';
import { PLUGIN_ID } from '../../utils/constants';
import { HiOutlineChevronDoubleRight } from 'react-icons/hi2';

const Header: React.FC<IHeaderProps> = (props) => {
  const {
    presetName,
    isShowSettings,
    isShowPresets,
    onTogglePresets,
    toggleSettings,
    togglePlugin,
  } = props;
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
      }).then((canvas: HTMLCanvasElement) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('l', 'mm', 'a4', true);
        pdf.addImage(imgData, 'JPEG', 0, 0, 230, 200);
        pdf.save(`${PLUGIN_ID} .pdf`);
      });
    }
  };

  return (
    <div className={styles.modal_header}>
      <div className={`d-flex align-items-center justify-content-start`}>
        <div
          className={`align-items-center ${isShowPresets ? 'd-none' : 'd-flex'} ${
            styles2.presets_uncollapse_btns_wrapper
          }`}>
          <button className={styles2.presets_uncollapse_btn1}>
            <span className="dtable-font dtable-icon-menu"></span>
          </button>
          <button className={styles2.presets_uncollapse_btn2} onClick={onTogglePresets}>
            <HiOutlineChevronDoubleRight />
          </button>
        </div>
        <div className={styles2.presets_pluginName}>
          <p>{presetName}</p>
        </div>
      </div>
      <div
        className={`d-flex align-items-center justify-content-end ${styles.modal_header_settings}`}>
        <span className={styles.modal_header_icon_btn} onClick={downloadPdfDocument}>
          <span className="dtable-font dtable-icon-download"></span>
        </span>
        <span className={styles.modal_header_icon_btn} onClick={printPdfDocument}>
          <span className="dtable-font dtable-icon-print"></span>
        </span>
        <span
          className={`${styles.modal_header_icon_btn} ${
            isShowSettings ? styles.modal_header_icon_btn_active : ''
          }`}
          onClick={toggleSettings}>
          <span className="dtable-font dtable-icon-set-up"></span>
          {isShowSettings && (
            <span className={styles.modal_header_icon_btn_settings}>Settings</span>
          )}
        </span>
        <span className={styles.modal_header_icon_btn} onClick={togglePlugin}>
          <span className="dtable-font dtable-icon-x btn-close"></span>
        </span>
      </div>
    </div>
  );
};

export default Header;

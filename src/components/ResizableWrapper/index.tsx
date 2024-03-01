import React, { useEffect, useRef, useState } from 'react';
import styles from '../../styles/Modal.module.scss';
import { IResizableWrapper } from '../../utils/Interfaces/ResizableWrapper.interface';

const ResizableWrapper: React.FC<IResizableWrapper> = ({ children }) => {
  const [allowTextSelection, setAllowTextSelection] = useState<boolean>(true);
  const modalRef = useRef<null | HTMLDivElement>(null);
  const modalTop = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    let resizableModal = modalRef.current;
    let style;
    let height: number;
    if (resizableModal) {
      style = window.getComputedStyle(resizableModal);
      height = parseInt(style.height, 10);
    }
    let yCord = 0;
    let topResizer = modalTop.current;

    const onMouseMoveTopResize = (event: MouseEvent) => {
      const dy = event.clientY - yCord;
      height = height - dy;
      yCord = event.clientY;
      if (resizableModal) {
        const maxWindowHeight = window.innerHeight - 18;
        if (height >= 50 && height < maxWindowHeight) {
          resizableModal.style.height = `${height}px`;
        }
      }
    };
    const onMouseUpTopResize = (event: MouseEvent) => {
      document.removeEventListener('mousemove', onMouseMoveTopResize);
    };
    const onMouseDownTopResize = (event: MouseEvent) => {
      setAllowTextSelection(false);
      yCord = event.clientY;
      if (resizableModal) {
        style = window.getComputedStyle(resizableModal);
        resizableModal.style.bottom = style.bottom;
        resizableModal.style.top = '';
      }
      document.addEventListener('mousemove', onMouseMoveTopResize);
      document.addEventListener('mouseup', onMouseUpTopResize);
    };
    topResizer?.addEventListener('mousedown', onMouseDownTopResize);

    return () => {
      setAllowTextSelection(true);
      topResizer?.removeEventListener('mousedown', onMouseDownTopResize);
    };
  }, [modalRef]);

  return (
    <div
      ref={modalRef}
      className={styles.modal_wrapper}
      style={{ userSelect: allowTextSelection ? 'auto' : 'none' }}>
      {/* draggable  */}
      <div ref={modalTop} className={styles.modal_draggable}>
        <span></span>
        <span></span>
      </div>
      {children}
    </div>
  );
};

export default ResizableWrapper;

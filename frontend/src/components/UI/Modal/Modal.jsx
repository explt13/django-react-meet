import React, { useRef, useState } from 'react'
import classes from './Modal.module.css'

const Modal = ({ children, visible, setVisible, blockClose, onModalClose}) => {
    const [closing, setClosing] = useState(false);
    const rootClasses = [classes.modal];
    
    const handleClose = () => {
        setClosing(true);
        onModalClose()
        const timeoutId = setTimeout(() => {
            setClosing(false);
            setVisible(false);
        }, 200);

        return () => clearTimeout(timeoutId);
    };

    if (visible) {
        rootClasses.push(classes.active);
    }
    if (closing) {
        rootClasses.push(classes.closing);
    }

    return (
        <div className={rootClasses.join(' ')} onClick={blockClose ? undefined : handleClose}>
            <div className={classes.modalContent} onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>
    )
}

export default Modal
import React, { useState } from 'react'
import classes from './Sidebar.module.css'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon  } from '@fortawesome/react-fontawesome'
import CustomIcon from '../CustomIcon/CustomIcon'

const Sidebar = ({children, visible, setVisible}) => {
    const [closing, setClosing] = useState(false)
    const rootClasses = [classes.sidebar]
    const contentClasses = [classes.content]

    const handleClose = () => {
        setClosing(true) // animation
        const timeoutId = setTimeout(() => {
            setClosing(false) // display none
            setVisible(false)
        }, 350) // timeout equals to animation duration
        return () => clearTimeout(timeoutId)
    }

    if (visible){
        rootClasses.push(classes.active)
    }
    if (closing){
        rootClasses.push(classes.closing)
        contentClasses.push(classes.inactive)
    }

    const enhancedChildren = React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { handleClose });
        }
        return child;
      });


    return (
        <div className={rootClasses.join(' ')} onClick={handleClose}>
            <div className={contentClasses.join(' ')} onClick={(e) => e.stopPropagation()}>
                <div className={classes.closeBtn}>
                    <CustomIcon><FontAwesomeIcon icon={faTimes} onClick={handleClose}/></CustomIcon>
                </div>
                {enhancedChildren}
            </div>
        </div>
  )
}

export default Sidebar
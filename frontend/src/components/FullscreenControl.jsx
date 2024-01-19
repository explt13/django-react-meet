import React, { useEffect, useRef } from 'react'
import classes from './styles/Control.module.css'
import CustomIcon from './UI/CustomIcon/CustomIcon'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExpand } from '@fortawesome/free-solid-svg-icons'

const FullscreenControl = ({setIsMapFullscreen, isMapFullscreen}) => {

  const handleFullscreen = () => {
      setIsMapFullscreen(!isMapFullscreen)
  }

  return (
    <div className={classes.fullscreenControl} onClick={handleFullscreen}>
        <CustomIcon>
            <FontAwesomeIcon icon={faExpand} />
        </CustomIcon>
    </div>
  )
}

export default FullscreenControl